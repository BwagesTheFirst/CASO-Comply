# agent/agent/scanner.py
from __future__ import annotations

import hashlib
import logging
import os
from pathlib import Path

from agent.config import sanitize_filename

logger = logging.getLogger(__name__)

_HIPAA_MODE = os.environ.get("CASO_HIPAA_MODE", "").lower() in ("true", "1", "yes")

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".pptx"}

EXTENSION_TO_FORMAT = {
    ".pdf": "pdf",
    ".docx": "docx",
    ".xlsx": "xlsx",
    ".pptx": "pptx",
}

def compute_file_hash(file_path: str, chunk_size: int = 8192) -> str:
    h = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(chunk_size):
            h.update(chunk)
    return h.hexdigest()

def scan_folder(folder_path: str) -> list[dict]:
    """Recursively scan a folder for supported document files.

    Returns list of {path, sha256, format}.
    """
    root = Path(folder_path)
    if not root.exists():
        logger.warning("Scan path does not exist: %s", folder_path)
        return []

    results = []
    for file_path in sorted(root.rglob("*")):
        if not file_path.is_file():
            continue
        ext = file_path.suffix.lower()
        if ext not in SUPPORTED_EXTENSIONS:
            continue
        # Skip remediated output files to avoid recursive re-processing
        if "_remediated" in file_path.stem:
            continue
        try:
            results.append({
                "path": str(file_path),
                "sha256": compute_file_hash(str(file_path)),
                "format": EXTENSION_TO_FORMAT[ext],
            })
        except OSError:
            logger.warning("Could not read file: %s",
                          sanitize_filename(file_path.name, _HIPAA_MODE))

    logger.info("Found %d documents in %s (%s)",
                len(results), folder_path,
                ", ".join(f"{sum(1 for r in results if r['format'] == fmt)} {fmt}"
                          for fmt in sorted(set(r["format"] for r in results))))
    return results
