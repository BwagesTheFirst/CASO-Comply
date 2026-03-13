"""Data retention and auto-purge for HIPAA compliance.

All purge features default to disabled (values of 0).
When enabled, files and DB paths are cleaned up on a schedule
to prevent indefinite accumulation of sensitive documents.
"""
from __future__ import annotations

import glob
import hashlib
import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from agent.config import AgentConfig, sanitize_filename
from agent.db import Database

logger = logging.getLogger("caso-agent.purge")


async def run_purge_cycle(config: AgentConfig, db: Database) -> None:
    """Run once per scan cycle after processing. Called from main.py."""
    await _purge_originals(config, db)
    await _purge_remediated(config, db)
    await _purge_db_paths(config, db)


async def _purge_originals(config: AgentConfig, db: Database) -> None:
    """Delete original input files after successful processing + N hours."""
    if config.purge_originals_after_hours <= 0:
        return

    cutoff = datetime.now(timezone.utc) - timedelta(hours=config.purge_originals_after_hours)
    cutoff_str = cutoff.strftime("%Y-%m-%d %H:%M:%S")

    cursor = await db._db.execute(
        """SELECT path FROM documents
           WHERE status = 'completed'
             AND processed_at IS NOT NULL
             AND processed_at < ?
             AND path NOT LIKE 'hash_%'""",
        (cutoff_str,),
    )
    rows = await cursor.fetchall()

    deleted = 0
    for row in rows:
        file_path = row[0]
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                deleted += 1
                display = sanitize_filename(file_path, config.hipaa_mode)
                logger.info("Purged original: %s", display)
            except OSError:
                display = sanitize_filename(file_path, config.hipaa_mode)
                logger.exception("Failed to purge original: %s", display)

    if deleted:
        logger.info("Purged %d original file(s)", deleted)


async def _purge_remediated(config: AgentConfig, db: Database) -> None:
    """Delete remediated output files older than N hours."""
    if config.purge_remediated_after_hours <= 0:
        return

    cutoff_ts = (datetime.now(timezone.utc) - timedelta(hours=config.purge_remediated_after_hours)).timestamp()

    # Collect candidate paths: output_dir and suffix-based files next to originals
    candidate_paths: list[str] = []

    # Files in the output directory
    output_dir = Path(config.output_dir)
    if output_dir.is_dir():
        for f in output_dir.iterdir():
            if f.is_file():
                candidate_paths.append(str(f))

    # Suffix-mode files: look for *_remediated* alongside scanned folders
    for scan_path in config.scan_paths:
        scan_dir = Path(scan_path)
        if scan_dir.is_dir():
            for f in scan_dir.rglob("*_remediated*"):
                if f.is_file():
                    candidate_paths.append(str(f))

    deleted = 0
    for fpath in candidate_paths:
        try:
            mtime = os.path.getmtime(fpath)
            if mtime < cutoff_ts:
                os.remove(fpath)
                deleted += 1
                display = sanitize_filename(fpath, config.hipaa_mode)
                logger.info("Purged remediated: %s", display)

                # Also remove the companion .cert.json if it exists
                cert_path = fpath + ".cert.json"
                if os.path.exists(cert_path):
                    os.remove(cert_path)
                    logger.info("Purged certificate: %s", sanitize_filename(cert_path, config.hipaa_mode))
        except OSError:
            display = sanitize_filename(fpath, config.hipaa_mode)
            logger.exception("Failed to purge remediated: %s", display)

    if deleted:
        logger.info("Purged %d remediated file(s)", deleted)


async def _purge_db_paths(config: AgentConfig, db: Database) -> None:
    """Hash file paths in DB records older than N days to preserve audit trail."""
    if config.purge_db_paths_after_days <= 0:
        return

    cutoff = datetime.now(timezone.utc) - timedelta(days=config.purge_db_paths_after_days)
    cutoff_str = cutoff.strftime("%Y-%m-%d %H:%M:%S")

    # Find rows that still have unhashed paths
    cursor = await db._db.execute(
        """SELECT path FROM documents
           WHERE processed_at IS NOT NULL
             AND processed_at < ?
             AND path NOT LIKE 'hash_%'""",
        (cutoff_str,),
    )
    rows = await cursor.fetchall()

    hashed = 0
    for row in rows:
        original_path = row[0]
        path_hash = "hash_" + hashlib.sha256(original_path.encode()).hexdigest()
        await db._db.execute(
            "UPDATE documents SET path = ? WHERE path = ?",
            (path_hash, original_path),
        )
        hashed += 1

    if hashed:
        await db._db.commit()
        logger.info("Hashed %d DB path(s) older than %d days", hashed, config.purge_db_paths_after_days)


def cleanup_temp_files() -> None:
    """Remove orphaned temp files. Called on startup."""
    removed = 0

    # Clean *_tmp_remediated* files in /data/
    data_dir = Path("/data")
    if data_dir.is_dir():
        for f in data_dir.rglob("*_tmp_remediated*"):
            if f.is_file():
                try:
                    f.unlink()
                    removed += 1
                except OSError:
                    logger.exception("Failed to remove temp file: %s", f)

    # Clean stale files in /tmp matching our patterns
    tmp_patterns = [
        "/tmp/caso_*",
        "/tmp/*_remediated_tmp*",
        "/tmp/*_tmp_remediated*",
    ]
    for pattern in tmp_patterns:
        for fpath in glob.glob(pattern):
            p = Path(fpath)
            if p.is_file():
                try:
                    p.unlink()
                    removed += 1
                except OSError:
                    logger.exception("Failed to remove temp file: %s", p)

    if removed:
        logger.info("Cleaned up %d orphaned temp file(s) on startup", removed)
    else:
        logger.debug("No orphaned temp files found")
