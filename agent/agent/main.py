from __future__ import annotations

import asyncio
import logging
import sys
from pathlib import Path

import httpx
import uvicorn
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from agent.config import load_config
from agent.db import Database
from agent.scanner import scan_folder
from agent.processor import Processor
from agent.license import LicenseClient
from agent.api import create_app

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("caso-agent")

async def _fetch_completed_reviews(config, db, license_client):
    """Poll for completed human reviews and download corrected files."""
    if not config.license_key or not license_client:
        return

    plan_name = license_client.plan_name
    if plan_name != "Human Review":
        return

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(
                f"{config.caso_api_url}/api/review/pending",
                headers={"Authorization": f"Bearer {config.license_key}"},
            )
            if resp.status_code != 200:
                logger.warning("Failed to fetch pending reviews: %d", resp.status_code)
                return

            reviews = resp.json().get("reviews", [])
            if not reviews:
                return

            logger.info("Found %d completed reviews to download", len(reviews))

            for review in reviews:
                review_id = review["id"]
                output_path = review["output_path"]
                filename = review["filename"]

                try:
                    dl_resp = await client.get(
                        f"{config.caso_api_url}/api/review/{review_id}/download-corrected",
                        headers={"Authorization": f"Bearer {config.license_key}"},
                    )
                    if dl_resp.status_code != 200:
                        logger.warning("Failed to download corrected %s: %d", filename, dl_resp.status_code)
                        continue

                    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
                    with open(output_path, "wb") as f:
                        f.write(dl_resp.content)

                    logger.info("Downloaded corrected file: %s → %s", filename, output_path)

                    await client.post(
                        f"{config.caso_api_url}/api/review/{review_id}/delivered",
                        headers={"Authorization": f"Bearer {config.license_key}"},
                    )

                    await db.update_result(path=review["original_path"], status="completed")

                    logger.info("Review %s delivered: %s", review_id, filename)

                except Exception:
                    logger.exception("Failed to process review %s for %s", review_id, filename)

    except Exception:
        logger.exception("Failed to fetch completed reviews")

async def run_scan_cycle(config, db: Database, processor: Processor):
    """One full scan + process cycle."""
    logger.info("Starting scan cycle")

    for scan_path in config.scan_paths:
        # Run sync I/O in a thread to avoid blocking the event loop
        found = await asyncio.to_thread(scan_folder, scan_path)
        for item in found:
            if await db.needs_processing(item["path"], item["sha256"]):
                await db.upsert_pdf(
                    path=item["path"],
                    sha256=item["sha256"],
                    source="folder",
                )

    pending = await db.get_pending()
    logger.info("Processing %d pending PDFs", len(pending))
    for pdf in pending:
        await processor.process_one(pdf["path"])

    stats = await db.get_stats()
    logger.info(
        "Cycle complete: %d total, %d completed, %d failed",
        stats["total"], stats["completed"] or 0, stats["failed"] or 0,
    )

    # Poll for completed human reviews
    await _fetch_completed_reviews(config, db, processor.license_client)

async def main():
    config_path = sys.argv[1] if len(sys.argv) > 1 else "/app/config.yaml"
    config = load_config(config_path)

    logger.info("CASO Comply Agent starting (mode=%s)", config.mode)

    # Store DB alongside output directory
    db_dir = Path(config.output_dir).parent
    db_dir.mkdir(parents=True, exist_ok=True)
    db_path = str(db_dir / "caso-agent.db")
    db = Database(db_path)
    await db.init()

    license_client = LicenseClient(
        api_url=config.caso_api_url,
        license_key=config.license_key,
        enabled=config.phone_home,
    )
    if not await license_client.validate():
        logger.error("License validation failed. Exiting.")
        sys.exit(1)

    processor = Processor(config=config, db=db, license_client=license_client)

    scheduler = AsyncIOScheduler()
    app = create_app(config, db, scheduler=scheduler)
    scheduler.add_job(
        run_scan_cycle,
        "cron",
        **_parse_cron(config.cron),
        args=[config, db, processor],
        id="scan_cycle",
        max_instances=1,
        misfire_grace_time=300,
    )
    scheduler.start()

    await run_scan_cycle(config, db, processor)

    server_config = uvicorn.Config(
        app, host="0.0.0.0", port=config.local_port, log_level="info",
    )
    server = uvicorn.Server(server_config)
    await server.serve()

def _parse_cron(cron_str: str) -> dict:
    """Parse a 5-field cron string into APScheduler kwargs."""
    parts = cron_str.strip().split()
    if len(parts) != 5:
        return {"minute": "0"}
    return {
        "minute": parts[0],
        "hour": parts[1],
        "day": parts[2],
        "month": parts[3],
        "day_of_week": parts[4],
    }

if __name__ == "__main__":
    asyncio.run(main())
