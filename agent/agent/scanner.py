# agent/agent/scanner.py
from __future__ import annotations

import hashlib
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def compute_file_hash(file_path: str, chunk_size: int = 8192) -> str:
    h = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(chunk_size):
            h.update(chunk)
    return h.hexdigest()

def scan_folder(folder_path: str) -> list[dict]:
    """Recursively scan a folder for PDF files. Returns list of {path, sha256}."""
    root = Path(folder_path)
    if not root.exists():
        logger.warning("Scan path does not exist: %s", folder_path)
        return []

    results = []
    for pdf_file in sorted(root.rglob("*.pdf")):
        if not pdf_file.is_file():
            continue
        try:
            results.append({
                "path": str(pdf_file),
                "sha256": compute_file_hash(str(pdf_file)),
            })
        except OSError:
            logger.warning("Could not read file: %s", pdf_file)

    logger.info("Found %d PDFs in %s", len(results), folder_path)
    return results
