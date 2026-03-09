# agent/agent/api.py
from __future__ import annotations

import secrets
import time
from pathlib import Path

import yaml
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from agent.config import AgentConfig, VALID_OUTPUT_MODES
from agent.db import Database

# In-memory token store: token -> expiry timestamp
_active_tokens: dict[str, float] = {}

TOKEN_LIFETIME = 86400  # 24 hours


class LoginRequest(BaseModel):
    password: str


class ConfigUpdateRequest(BaseModel):
    scan_paths: list[str] | None = None
    cron: str | None = None
    output_dir: str | None = None
    output_mode: str | None = None
    max_workers: int | None = None
    watch: bool | None = None


def _validate_cron(cron_str: str) -> bool:
    """Validate that a cron string has exactly 5 space-separated fields."""
    parts = cron_str.strip().split()
    return len(parts) == 5


def _verify_token(authorization: str | None) -> bool:
    """Verify a Bearer token is valid and not expired."""
    if not authorization or not authorization.startswith("Bearer "):
        return False
    token = authorization[7:]
    expiry = _active_tokens.get(token)
    if expiry is None:
        return False
    if time.time() > expiry:
        del _active_tokens[token]
        return False
    return True


def _require_auth(authorization: str | None):
    """Raise 401 if token is invalid."""
    if not _verify_token(authorization):
        raise HTTPException(status_code=401, detail="Unauthorized")


def _get_client_ip(request: Request) -> str:
    """Extract client IP from request."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def create_app(config: AgentConfig, db: Database, scheduler=None) -> FastAPI:
    app = FastAPI(title="CASO Comply Agent", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Store scheduler on app state for access in endpoints
    app.state.scheduler = scheduler

    # --- Public read-only endpoints ---

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
    async def trigger_scan(request: Request):
        ip = _get_client_ip(request)
        await db.add_audit_log("scan_triggered", "Manual scan triggered", ip)
        return {"message": "Scan triggered"}

    # --- Auth endpoint ---

    @app.post("/api/auth")
    async def authenticate(body: LoginRequest, request: Request):
        ip = _get_client_ip(request)
        if body.password != config.admin_password:
            await db.add_audit_log("login_failed", "Invalid password attempt", ip)
            raise HTTPException(status_code=401, detail="Invalid password")
        token = secrets.token_hex(32)
        _active_tokens[token] = time.time() + TOKEN_LIFETIME
        await db.add_audit_log("login_success", "Admin authenticated", ip)
        return {"token": token}

    # --- Protected mutation endpoints ---

    @app.put("/api/config")
    async def update_config(
        body: ConfigUpdateRequest,
        request: Request,
        authorization: str | None = Header(default=None),
    ):
        _require_auth(authorization)
        ip = _get_client_ip(request)

        changes = {}

        if body.scan_paths is not None:
            config.scan_paths = body.scan_paths
            changes["scan_paths"] = body.scan_paths

        if body.cron is not None:
            if not _validate_cron(body.cron):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid cron format. Must be 5 space-separated fields.",
                )
            old_cron = config.cron
            config.cron = body.cron
            changes["cron"] = body.cron

            # Reschedule cron job if scheduler is available and cron changed
            sched = app.state.scheduler
            if sched and old_cron != body.cron:
                # Grab existing job args before removing
                old_job = sched.get_job("scan_cycle")
                job_args = old_job.args if old_job else []
                try:
                    sched.remove_job("scan_cycle")
                except Exception:
                    pass
                parts = body.cron.strip().split()
                from agent.main import run_scan_cycle

                sched.add_job(
                    run_scan_cycle,
                    "cron",
                    minute=parts[0],
                    hour=parts[1],
                    day=parts[2],
                    month=parts[3],
                    day_of_week=parts[4],
                    args=job_args,
                    id="scan_cycle",
                    max_instances=1,
                    misfire_grace_time=300,
                )

        if body.output_dir is not None:
            config.output_dir = body.output_dir
            changes["output_dir"] = body.output_dir

        if body.output_mode is not None:
            if body.output_mode not in VALID_OUTPUT_MODES:
                raise HTTPException(
                    status_code=400,
                    detail=f"output_mode must be one of {VALID_OUTPUT_MODES}",
                )
            config.output_mode = body.output_mode
            changes["output_mode"] = body.output_mode

        if body.max_workers is not None:
            if body.max_workers < 1:
                raise HTTPException(status_code=400, detail="max_workers must be >= 1")
            config.max_workers = body.max_workers
            changes["max_workers"] = body.max_workers

        if body.watch is not None:
            config.watch = body.watch
            changes["watch"] = body.watch

        if not changes:
            return {"message": "No changes provided"}

        # Write updated config to YAML
        config_data = {
            "mode": config.mode,
            "license_key": config.license_key,
            "scan_paths": config.scan_paths,
            "watch": config.watch,
            "cron": config.cron,
            "website_urls": config.website_urls,
            "output_dir": config.output_dir,
            "output_mode": config.output_mode,
            "max_workers": config.max_workers,
            "gemini_api_key": config.gemini_api_key,
            "phone_home": config.phone_home,
            "caso_api_url": config.caso_api_url,
            "local_port": config.local_port,
        }
        config_path = Path("/app/config.yaml")
        config_path.parent.mkdir(parents=True, exist_ok=True)
        with open(config_path, "w") as f:
            yaml.safe_dump(config_data, f, default_flow_style=False)

        await db.add_audit_log(
            "config_updated",
            f"Updated fields: {', '.join(changes.keys())}",
            ip,
        )

        return {"message": "Configuration updated", "changes": changes}

    # --- Audit log endpoint (protected) ---

    @app.get("/api/audit-log")
    async def get_audit_log(
        limit: int = 50,
        authorization: str | None = Header(default=None),
    ):
        _require_auth(authorization)
        return await db.get_audit_log(limit=limit)

    # --- Static files (must be last) ---
    web_dir = Path(__file__).parent / "web"
    if web_dir.exists():
        app.mount("/", StaticFiles(directory=str(web_dir), html=True), name="web")

    return app
