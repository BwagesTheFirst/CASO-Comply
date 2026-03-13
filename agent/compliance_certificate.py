# compliance_certificate.py
"""Generate audit-ready compliance certificates for remediated documents."""
from __future__ import annotations

import hashlib
import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path

logger = logging.getLogger(__name__)

# Standards applicable to all document formats
_COMMON_STANDARDS = [
    "WCAG 2.2 AA",
    "Section 508",
    "ADA Title II",
    "EN 301 549",
]

# PDF-only standard
_PDF_STANDARD = "PDF/UA (ISO 14289)"


def _sha256(path: str) -> str:
    """Compute SHA-256 hex digest for a file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def _build_checks(score_dict: dict) -> dict:
    """Convert a score dict into the certificate checks format.

    Expects keys like {"check_name": {"passed": bool, "weight": int, "description": str}}
    or a flat score dict with "score" and "details" keys (common in our pipeline).
    """
    checks: dict = {}
    # Try "checks", "details", or the dict itself as the source of check items
    details = score_dict.get("checks", score_dict.get("details", score_dict))
    for key, value in details.items():
        if key == "score":
            continue
        if isinstance(value, dict) and "passed" in value:
            checks[key] = {
                "passed": value.get("passed", False),
                "weight": value.get("weight", 0),
                "description": value.get("description", key),
            }
    return checks


def generate_certificate(
    original_path: str,
    remediated_path: str,
    format: str,
    before_analysis: dict,
    after_analysis: dict,
    remediation_type: str = "standard",
    verification_info: dict | None = None,
    org_name: str = "Local Processing",
    plan_name: str = "Standard",
    processing_time: float = 0.0,
) -> dict:
    """Generate a JSON compliance certificate for a remediated document.

    Parameters
    ----------
    original_path : str
        Path to the original (pre-remediation) file.
    remediated_path : str
        Path to the remediated output file.
    format : str
        Document format — one of "pdf", "docx", "xlsx", "pptx".
    before_analysis : dict
        Analysis/scoring result for the original file (must contain "score" sub-dict).
    after_analysis : dict
        Analysis/scoring result for the remediated file.
    remediation_type : str
        One of "standard", "ai_verified", "human_review".
    verification_info : dict | None
        Optional dict with AI verification details:
        ``{"model": str, "score": float, "issues": [str]}``.
    org_name : str
        Organisation name (from license data).
    plan_name : str
        Plan tier name (from license data).
    processing_time : float
        Time in seconds the remediation took.

    Returns
    -------
    dict
        The full certificate dictionary (also saved to disk as .cert.json).
    """
    # --- hashes ---
    sha_original = _sha256(original_path)
    sha_remediated = _sha256(remediated_path)

    # --- scores ---
    before_score_dict = before_analysis.get("score", before_analysis)
    after_score_dict = after_analysis.get("score", after_analysis)
    score_before = before_score_dict.get("score", 0)
    score_after = after_score_dict.get("score", 0)

    # --- standards ---
    standards = list(_COMMON_STANDARDS)
    if format == "pdf":
        standards.insert(1, _PDF_STANDARD)

    # --- checks from after-analysis ---
    checks = _build_checks(after_score_dict)

    # --- verification ---
    ai_verified = verification_info is not None
    ai_model = verification_info.get("model") if verification_info else None
    ai_verification_score = verification_info.get("score") if verification_info else None
    issues_found = verification_info.get("issues", []) if verification_info else []

    # --- page count ---
    page_count = before_analysis.get("page_count", 0)

    certificate = {
        "certificate_id": str(uuid.uuid4()),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "document": {
            "filename": Path(original_path).name,
            "format": format,
            "page_count": page_count,
            "sha256_original": sha_original,
            "sha256_remediated": sha_remediated,
        },
        "compliance": {
            "standards": standards,
            "score_before": score_before,
            "score_after": score_after,
            "checks": checks,
        },
        "remediation": {
            "type": remediation_type,
            "ai_verified": ai_verified,
            "ai_model": ai_model,
            "ai_verification_score": ai_verification_score,
            "issues_found": issues_found,
            "processing_time_seconds": round(processing_time, 3),
        },
        "organization": {
            "name": org_name,
            "plan": plan_name,
        },
    }

    # --- save alongside remediated file ---
    cert_path = Path(remediated_path).with_suffix(".cert.json")
    try:
        cert_path.write_text(json.dumps(certificate, indent=2), encoding="utf-8")
        logger.info("Compliance certificate saved → %s", cert_path)
    except OSError:
        logger.warning("Could not write certificate to %s", cert_path)

    return certificate
