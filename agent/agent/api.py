# agent/agent/api.py
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from agent.config import AgentConfig
from agent.db import Database

def create_app(config: AgentConfig, db: Database) -> FastAPI:
    app = FastAPI(title="CASO Comply Agent", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    async def health():
        return {"status": "ok", "mode": config.mode}

    @app.get("/api/stats")
    async def stats():
        return await db.get_stats()

    @app.get("/api/config")
    async def get_config():
        return {
            "mode": config.mode,
            "scan_paths": config.scan_paths,
            "watch": config.watch,
            "cron": config.cron,
            "website_urls": config.website_urls,
            "output_dir": config.output_dir,
            "output_mode": config.output_mode,
            "max_workers": config.max_workers,
            "phone_home": config.phone_home,
        }

    @app.get("/api/pdfs")
    async def list_pdfs(limit: int = 100, offset: int = 0):
        return await db.get_all(limit=limit, offset=offset)

    @app.get("/api/pdfs/pending")
    async def pending_pdfs():
        return await db.get_pending()

    @app.post("/api/scan/trigger")
    async def trigger_scan():
        return {"message": "Scan triggered"}

    web_dir = Path(__file__).parent / "web"
    if web_dir.exists():
        app.mount("/", StaticFiles(directory=str(web_dir), html=True), name="web")

    return app
