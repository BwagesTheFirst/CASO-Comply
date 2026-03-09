"""
CASO Comply -- Gemini AI Verification Layer

After the initial font-size-based auto-classification, this module sends
page images and the proposed tag assignments to Gemini 2.5 Flash for
semantic verification.  Gemini checks heading hierarchy, reading order,
artifact detection, and generates alt text for images.
"""

from __future__ import annotations

import asyncio
import base64
import json
import logging
import os
from typing import Any

from pathlib import Path

import fitz  # PyMuPDF

logger = logging.getLogger(__name__)

MODEL_ID = "gemini-2.5-flash"

# ── Structured output schema sent to Gemini ──────────────────────────────

RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "corrected_tags": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "original_mcid": {"type": "integer"},
                    "page": {"type": "integer"},
                    "type": {"type": "string"},
                    "text": {"type": "string"},
                    "bbox": {"type": "array", "items": {"type": "number"}},
                    "is_artifact": {"type": "boolean"},
                    "reason": {"type": "string"},
                },
                "required": [
                    "original_mcid",
                    "page",
                    "type",
                    "text",
                    "bbox",
                    "is_artifact",
                    "reason",
                ],
            },
        },
        "alt_texts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "page": {"type": "integer"},
                    "description": {"type": "string"},
                },
                "required": ["page", "description"],
            },
        },
        "issues_found": {
            "type": "array",
            "items": {"type": "string"},
        },
        "reading_order_correct": {"type": "boolean"},
        "heading_hierarchy_valid": {"type": "boolean"},
    },
    "required": [
        "corrected_tags",
        "alt_texts",
        "issues_found",
        "reading_order_correct",
        "heading_hierarchy_valid",
    ],
}

XLSX_RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "sheet_names": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "original": {"type": "string"},
                    "suggested": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": ["original", "suggested", "reason"],
            },
        },
        "alt_texts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "sheet": {"type": "string"},
                    "object_index": {"type": "integer"},
                    "description": {"type": "string"},
                },
                "required": ["sheet", "object_index", "description"],
            },
        },
        "issues_found": {
            "type": "array",
            "items": {"type": "string"},
        },
        "color_only_cells": {
            "type": "array",
            "items": {"type": "string"},
        },
        "structure_valid": {"type": "boolean"},
    },
    "required": ["sheet_names", "alt_texts", "issues_found", "color_only_cells", "structure_valid"],
}

PPTX_RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "slides": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "slide_number": {"type": "integer"},
                    "suggested_title": {"type": "string"},
                    "reading_order": {
                        "type": "array",
                        "items": {"type": "integer"},
                    },
                    "reading_order_correct": {"type": "boolean"},
                },
                "required": ["slide_number", "suggested_title", "reading_order", "reading_order_correct"],
            },
        },
        "alt_texts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "slide": {"type": "integer"},
                    "shape_index": {"type": "integer"},
                    "description": {"type": "string"},
                    "is_decorative": {"type": "boolean"},
                },
                "required": ["slide", "shape_index", "description", "is_decorative"],
            },
        },
        "issues_found": {
            "type": "array",
            "items": {"type": "string"},
        },
        "heading_hierarchy_valid": {"type": "boolean"},
    },
    "required": ["slides", "alt_texts", "issues_found", "heading_hierarchy_valid"],
}

# ── Prompt ───────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """\
You are an expert PDF accessibility auditor.  You will receive:

1. Rendered images of every page in a PDF document.
2. A JSON array of proposed tag assignments produced by a font-size heuristic.

Your job is to verify and correct the tag assignments so that a screen reader
will present the document logically to a blind user.

**Rules you MUST enforce:**

- Heading hierarchy: H1 → H2 → H3 in order.  No skipping levels (e.g. H1
  directly followed by H3 with no H2 in between).  A document should have
  exactly one H1 (the main title).
- Body text that is merely large font should remain P (paragraph), not a heading.
  Headings are structural titles/section labels, not long body paragraphs.
- Headers, footers, page numbers, and other repeated boilerplate that appear
  on every page should be marked as Artifact (set is_artifact=true, type="Artifact").
  Screen readers skip artifacts.
- Multi-column layouts: reading order should proceed column-by-column
  (finish left column before right column), NOT line-by-line across columns.
  Reorder tags if needed.
- For any images visible on the pages, generate concise, descriptive alt text
  in the alt_texts array.  Use web search if helpful for context.
- Preserve the original_mcid and page from the input so corrections can be
  mapped back.

Return ONLY the JSON object matching the provided schema.
"""

DOCX_SYSTEM_PROMPT = """\
You are an expert Word document accessibility auditor. You will receive:

1. Rendered images of every page in a Word document.
2. A JSON array of proposed tag assignments produced by a heuristic analysis.

Your job is to verify and correct the tag assignments so that a screen reader
will present the document logically to a blind user.

**Rules you MUST enforce:**

- Heading hierarchy: H1 → H2 → H3 in order. No skipping levels.
  A document should have exactly one H1 (the main title).
- Body text that is merely large or bold should remain P (paragraph), not a heading.
  Headings are structural titles/section labels.
- Headers, footers, page numbers should be marked as Artifact (is_artifact=true).
- Multi-column layouts: reading order should proceed column-by-column.
- For any images visible on the pages, generate concise, descriptive alt text.
- Preserve the original_mcid and page from the input so corrections can be mapped back.

Return ONLY the JSON object matching the provided schema.
"""

XLSX_SYSTEM_PROMPT = """\
You are an expert spreadsheet accessibility auditor. You will receive:

1. Rendered images of every sheet in an Excel workbook.
2. A JSON object describing the workbook structure: sheet names, tables, merged cells,
   images, and proposed fixes.

Your job is to verify the structure and suggest corrections.

**Rules you MUST enforce:**

- Every data table must have a designated header row.
- Merged cells should be unmerged — verify the unmerge was appropriate.
- Sheet names must be descriptive (not "Sheet1", "Sheet2").
  Suggest meaningful names based on the visible content.
- Charts and images must have descriptive alt text.
- Identify any cells where color alone conveys meaning and flag them.
- Check if the data flows logically for a screen reader reading left-to-right, top-to-bottom.

Return ONLY the JSON object matching the provided schema.
"""

PPTX_SYSTEM_PROMPT = """\
You are an expert presentation accessibility auditor. You will receive:

1. Rendered images of every slide in a PowerPoint presentation.
2. A JSON object describing the slide structure: shape tree order, proposed reading order,
   title presence, images, and tables.

Your job is to verify and correct the structure.

**Rules you MUST enforce:**

- Every slide MUST have a title. If missing, suggest appropriate title text
  based on the visible content.
- Reading order must be logical: title first, then content top-to-bottom,
  left-to-right. Verify the proposed order matches visual layout.
- All images and shapes must have descriptive alt text. Decorative images
  should be marked decorative.
- Tables must have header rows designated.
- Flag any content that appears to rely solely on color to convey meaning.
- Identify any animations or transitions that could cause seizures.

Return ONLY the JSON object matching the provided schema.
"""


def _render_pages_as_images(pdf_path: str, dpi: int = 150) -> list[str]:
    """Render every page of *pdf_path* as a PNG and return base64 strings.

    Pages are rendered one at a time to keep peak memory low.
    """
    doc = fitz.open(pdf_path)
    images: list[str] = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(dpi=dpi)
        img_bytes = pix.tobytes("png")
        images.append(base64.standard_b64encode(img_bytes).decode("ascii"))
        del pix  # free memory immediately
    doc.close()
    return images


def _render_office_as_images(file_path: str, dpi: int = 150) -> list[str]:
    """Convert an Office file to a temp PDF via LibreOffice, render pages as PNGs.

    Returns base64-encoded PNG strings, one per page/slide/sheet.
    """
    import subprocess
    import tempfile

    with tempfile.TemporaryDirectory() as tmp_dir:
        # Convert to PDF using LibreOffice headless
        result = subprocess.run(
            ["soffice", "--headless", "--convert-to", "pdf", "--outdir", tmp_dir, file_path],
            capture_output=True, text=True, timeout=120,
        )
        if result.returncode != 0:
            raise RuntimeError(f"LibreOffice conversion failed: {result.stderr}")

        # Find the generated PDF
        pdf_files = list(Path(tmp_dir).glob("*.pdf"))
        if not pdf_files:
            raise RuntimeError("LibreOffice produced no PDF output")

        # Render the temp PDF pages as images
        return _render_pages_as_images(str(pdf_files[0]), dpi=dpi)


def _build_gemini_contents(
    page_images: list[str],
    tag_assignments: list[dict],
) -> list[dict]:
    """Build the ``contents`` list for a Gemini generateContent request."""
    parts: list[dict] = []

    # Add each page image
    for idx, b64 in enumerate(page_images):
        parts.append({"text": f"--- Page {idx} ---"})
        parts.append({
            "inline_data": {
                "mime_type": "image/png",
                "data": b64,
            }
        })

    # Add the current tag assignments as JSON
    parts.append({
        "text": (
            "Below are the current tag assignments produced by a font-size "
            "heuristic.  Please verify and correct them.\n\n"
            + json.dumps(tag_assignments, indent=2)
        )
    })

    return [{"role": "user", "parts": parts}]


# ── Public API ───────────────────────────────────────────────────────────


async def verify_and_correct(
    pdf_path: str,
    tag_assignments: list[dict],
    content: dict,
) -> dict:
    """Send page images + tags to Gemini 2.5 Flash and return corrections.

    Returns
    -------
    dict
        corrected_tags : list[dict]   – same shape as *tag_assignments* but corrected
        alt_texts       : dict        – {page_num: [{image_index, alt_text}]}
        issues_found    : list[str]   – human-readable issue descriptions
        verification_score : float    – 0-1 confidence
    """
    # ── Graceful fallback wrapper ────────────────────────────────────
    try:
        return await _call_gemini(pdf_path, tag_assignments, content)
    except Exception:
        logger.exception("Gemini verification failed -- returning original tags unchanged")
        return {
            "corrected_tags": tag_assignments,
            "alt_texts": {},
            "issues_found": ["Gemini verification unavailable -- used original tags"],
            "verification_score": 0.0,
        }


async def _call_gemini(
    pdf_path: str,
    tag_assignments: list[dict],
    content: dict,
) -> dict:
    """Internal: actually call the Gemini API."""
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    # ── Render pages ─────────────────────────────────────────────────
    logger.info("Rendering PDF pages as images for Gemini verification")
    page_images = await asyncio.to_thread(_render_pages_as_images, pdf_path)
    logger.info("Rendered %d page images", len(page_images))

    # ── Build request ────────────────────────────────────────────────
    contents = _build_gemini_contents(page_images, tag_assignments)

    # Free the base64 list now that it is embedded in *contents*
    del page_images

    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        response_mime_type="application/json",
        response_schema=RESPONSE_SCHEMA,
    )

    logger.info("Sending request to Gemini %s", MODEL_ID)
    response = await asyncio.to_thread(
        client.models.generate_content,
        model=MODEL_ID,
        contents=contents,
        config=config,
    )

    # ── Parse response ───────────────────────────────────────────────
    raw_text = response.text
    result = json.loads(raw_text)

    # Normalise corrected_tags back to the format remediation.py expects
    corrected_tags = []
    for item in result.get("corrected_tags", []):
        corrected_tags.append({
            "type": item.get("type", "P"),
            "page": item.get("page", 0),
            "mcid": item.get("original_mcid", 0),
            "text": item.get("text", ""),
            "bbox": item.get("bbox", [0, 0, 0, 0]),
            "font_size": _find_font_size(tag_assignments, item.get("original_mcid"), item.get("page")),
            "is_artifact": item.get("is_artifact", False),
            "reason": item.get("reason", ""),
        })

    # Build alt_texts as {page_num: [{image_index, alt_text}]}
    alt_texts: dict[int, list[dict]] = {}
    for entry in result.get("alt_texts", []):
        page = entry.get("page", 0)
        alt_texts.setdefault(page, []).append({
            "image_index": len(alt_texts.get(page, [])),
            "alt_text": entry.get("description", ""),
        })

    issues = result.get("issues_found", [])

    # Compute a simple verification score
    hierarchy_ok = result.get("heading_hierarchy_valid", False)
    order_ok = result.get("reading_order_correct", False)
    n_changes = sum(1 for c in corrected_tags if c.get("reason") and "unchanged" not in c.get("reason", "").lower())
    change_ratio = n_changes / max(len(corrected_tags), 1)
    score = (
        (0.4 if hierarchy_ok else 0.0)
        + (0.4 if order_ok else 0.0)
        + (0.2 * (1.0 - change_ratio))
    )

    logger.info(
        "Gemini verification complete: %d issues, score=%.2f, %d tags corrected",
        len(issues), score, n_changes,
    )

    return {
        "corrected_tags": corrected_tags,
        "alt_texts": alt_texts,
        "issues_found": issues,
        "verification_score": round(score, 3),
    }


def _find_font_size(
    original_tags: list[dict],
    mcid: int | None,
    page: int | None,
) -> float:
    """Look up the font_size from the original tag list by mcid+page."""
    for t in original_tags:
        if t.get("mcid") == mcid and t.get("page") == page:
            return t.get("font_size", 0)
    return 0


# ── Office file verification ─────────────────────────────────────────────


async def verify_and_correct_office(
    file_path: str,
    structure_data: dict | list,
    format: str,
) -> dict:
    """Send rendered Office pages + structure to Gemini for verification.

    Parameters
    ----------
    file_path : str
        Path to the .docx/.xlsx/.pptx file
    structure_data : dict or list
        Format-specific structure info
    format : str
        One of "docx", "xlsx", "pptx"

    Returns
    -------
    dict with format-specific corrections
    """
    try:
        return await _call_gemini_office(file_path, structure_data, format)
    except Exception:
        logger.exception("Gemini verification failed for %s -- returning defaults", format)
        if format == "docx":
            return {
                "corrected_tags": structure_data if isinstance(structure_data, list) else [],
                "alt_texts": {},
                "issues_found": ["Gemini verification unavailable -- used original tags"],
                "verification_score": 0.0,
            }
        elif format == "xlsx":
            return {
                "sheet_names": [],
                "alt_texts": [],
                "issues_found": ["Gemini verification unavailable"],
                "color_only_cells": [],
                "verification_score": 0.0,
            }
        else:  # pptx
            return {
                "slides": [],
                "alt_texts": [],
                "issues_found": ["Gemini verification unavailable"],
                "verification_score": 0.0,
            }


async def _call_gemini_office(
    file_path: str,
    structure_data: dict | list,
    format: str,
) -> dict:
    """Internal: call Gemini API for Office file verification."""
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    # Render pages via LibreOffice temp PDF
    logger.info("Rendering %s as images for Gemini verification", format.upper())
    page_images = await asyncio.to_thread(_render_office_as_images, file_path)
    logger.info("Rendered %d page images", len(page_images))

    # Build request parts
    parts: list[dict] = []
    for idx, b64 in enumerate(page_images):
        parts.append({"text": f"--- Page {idx + 1} ---"})
        parts.append({"inline_data": {"mime_type": "image/png", "data": b64}})
    del page_images

    parts.append({
        "text": (
            "Below is the current document structure. "
            "Please verify and correct it.\n\n"
            + json.dumps(structure_data, indent=2, default=str)
        )
    })

    contents = [{"role": "user", "parts": parts}]

    # Select prompt and schema by format
    if format == "docx":
        system_prompt = DOCX_SYSTEM_PROMPT
        schema = RESPONSE_SCHEMA
    elif format == "xlsx":
        system_prompt = XLSX_SYSTEM_PROMPT
        schema = XLSX_RESPONSE_SCHEMA
    else:
        system_prompt = PPTX_SYSTEM_PROMPT
        schema = PPTX_RESPONSE_SCHEMA

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        response_mime_type="application/json",
        response_schema=schema,
    )

    logger.info("Sending %s verification request to Gemini %s", format.upper(), MODEL_ID)
    response = await asyncio.to_thread(
        client.models.generate_content,
        model=MODEL_ID,
        contents=contents,
        config=config,
    )

    result = json.loads(response.text)

    # Compute verification score
    issues = result.get("issues_found", [])
    if format == "docx":
        hierarchy_ok = result.get("heading_hierarchy_valid", False)
        order_ok = result.get("reading_order_correct", False)
        corrected = result.get("corrected_tags", [])
        n_changes = sum(1 for c in corrected if c.get("reason") and "unchanged" not in c.get("reason", "").lower())
        change_ratio = n_changes / max(len(corrected), 1)
        score = (0.4 if hierarchy_ok else 0.0) + (0.4 if order_ok else 0.0) + (0.2 * (1.0 - change_ratio))
    elif format == "xlsx":
        structure_ok = result.get("structure_valid", False)
        score = (0.6 if structure_ok else 0.0) + (0.4 * (1.0 - min(len(issues), 5) / 5))
    else:  # pptx
        hierarchy_ok = result.get("heading_hierarchy_valid", False)
        slides = result.get("slides", [])
        order_ok_count = sum(1 for s in slides if s.get("reading_order_correct", False))
        order_ratio = order_ok_count / max(len(slides), 1)
        score = (0.3 if hierarchy_ok else 0.0) + (0.5 * order_ratio) + (0.2 * (1.0 - min(len(issues), 5) / 5))

    result["verification_score"] = round(score, 3)

    logger.info("Gemini %s verification complete: %d issues, score=%.2f", format.upper(), len(issues), score)
    return result
