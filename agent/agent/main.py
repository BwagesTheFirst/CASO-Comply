from __future__ import annotations

import asyncio
import logging
import sys
from pathlib import Path

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

async def run_scan_cycle(config, db: Database, processor: Processor):
    """One full scan + process cycle."""
    logger.info("Starting scan cycle")

    for scan_path in config.scan_paths:
        found = scan_folder(scan_path)
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

async def main():
    config_path = sys.argv[1] if len(sys.argv) > 1 else "/app/config.yaml"
    config = load_config(config_path)

    logger.info("CASO Comply Agent starting (mode=%s)", config.mode)

    db = Database()
    await db.init()

    license_client = LicenseClient(
        api_url=config.caso_api_url,
        license_key=config.license_key,
        enabled=config.phone_home,
    )
    if not await license_client.validate():
        logger.error("License validation failed. Exiting.")
        sys.exit(1)

    processor = Processor(config=config, db=db)
    app = create_app(config, db)

    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        run_scan_cycle,
        "cron",
        **_parse_cron(config.cron),
        args=[config, db, processor],
        id="scan_cycle",
        max_instances=1,
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
