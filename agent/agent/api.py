# agent/agent/api.py
from __future__ import annotations

import os
import secrets
import time
from pathlib import Path

import yaml
from fastapi import FastAPI, Header, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from agent.config import AgentConfig, VALID_OUTPUT_MODES
from agent.db import Database

BROWSE_ROOT = "/data"

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

    # --- Browse endpoint (protected) ---

    @app.get("/api/browse")
    async def browse_directory(
        path: str = Query(default=BROWSE_ROOT),
        authorization: str | None = Header(default=None),
    ):
        _require_auth(authorization)

        # Resolve the requested path and enforce jail to BROWSE_ROOT
        try:
            resolved = os.path.realpath(path)
        except (ValueError, OSError):
            raise HTTPException(status_code=403, detail="Invalid path")

        real_root = os.path.realpath(BROWSE_ROOT)

        # Must be exactly the root or a subdirectory of it
        if resolved != real_root and not resolved.startswith(real_root + os.sep):
            raise HTTPException(
                status_code=403,
                detail="Access denied: path is outside the allowed directory",
            )

        if not os.path.isdir(resolved):
            raise HTTPException(status_code=404, detail="Directory not found")

        entries = []
        try:
            with os.scandir(resolved) as it:
                for entry in sorted(it, key=lambda e: (not e.is_dir(), e.name.lower())):
                    # Resolve each entry to prevent symlink escape
                    entry_real = os.path.realpath(entry.path)
                    if not entry_real.startswith(real_root + os.sep) and entry_real != real_root:
                        continue  # skip entries that resolve outside jail

                    if entry.is_dir():
                        # Count PDFs and total files (immediate children only)
                        pdf_count = 0
                        total_files = 0
                        try:
                            with os.scandir(entry_real) as sub_it:
                                for sub_entry in sub_it:
                                    if sub_entry.is_file():
                                        total_files += 1
                                        if sub_entry.name.lower().endswith(".pdf"):
                                            pdf_count += 1
                        except PermissionError:
                            pass
                        entries.append({
                            "name": entry.name,
                            "type": "directory",
                            "pdf_count": pdf_count,
                            "total_files": total_files,
                        })
                    elif entry.is_file() and entry.name.lower().endswith(".pdf"):
                        try:
                            size_kb = round(entry.stat().st_size / 1024)
                        except OSError:
                            size_kb = 0
                        entries.append({
                            "name": entry.name,
                            "type": "file",
                            "size_kb": size_kb,
                        })
        except PermissionError:
            raise HTTPException(status_code=403, detail="Permission denied")

        # Compute parent path (clamped to root)
        parent = os.path.dirname(resolved)
        if not parent.startswith(real_root) or parent == resolved:
            parent = None
        else:
            # Return the original logical path's parent for the UI
            parent = os.path.dirname(path.rstrip("/")) or BROWSE_ROOT

        return {
            "path": path.rstrip("/") or BROWSE_ROOT,
            "entries": entries,
            "parent": parent,
        }

    # --- Static files (must be last) ---
    web_dir = Path(__file__).parent / "web"
    if web_dir.exists():
        app.mount("/", StaticFiles(directory=str(web_dir), html=True), name="web")

    return app
