"""
CASO Comply -- PDF Accessibility Remediation Engine

Core engine for analyzing and remediating PDF accessibility issues.
Extracts content structure via PyMuPDF, detects tables via pdfplumber,
auto-classifies text blocks by font size into heading/paragraph tags,
and writes a proper tagged PDF structure using pikepdf.
"""

from __future__ import annotations

import asyncio
import logging
import os
from collections import defaultdict
from pathlib import Path

import fitz  # PyMuPDF
import pdfplumber
import pikepdf
from pikepdf import Array, Dictionary, Name, String

from agent.config import sanitize_filename
from gemini_verify import verify_and_correct

logger = logging.getLogger(__name__)

# Module-level HIPAA flag — set once from env so remediation functions
# can sanitize log output without needing a config reference.
_HIPAA_MODE = os.environ.get("CASO_HIPAA_MODE", "").lower() in ("true", "1", "yes")


# ---------------------------------------------------------------------------
# 1. Analysis
# ---------------------------------------------------------------------------

def analyze_structure(pdf_path: str) -> dict:
    """Analyze PDF structural accessibility features using pikepdf."""
    report = {
        "file": str(pdf_path),
        "tagged": False,
        "has_lang": False,
        "has_title": False,
        "title": None,
        "language": None,
        "has_struct_tree": False,
        "page_count": 0,
        "has_outlines": False,
        "has_display_doc_title": False,
        "issues": [],
    }

    with pikepdf.open(pdf_path) as pdf:
        report["page_count"] = len(pdf.pages)

        # Tagged / MarkInfo
        mark_info = pdf.Root.get("/MarkInfo")
        if mark_info:
            report["tagged"] = bool(mark_info.get("/Marked", False))
        if not report["tagged"]:
            report["issues"].append("PDF is not tagged -- no structure tree exists")

        # StructTreeRoot
        struct_tree = pdf.Root.get("/StructTreeRoot")
        if struct_tree:
            report["has_struct_tree"] = True
        else:
            report["issues"].append("No StructTreeRoot -- document has no semantic structure")

        # Language
        lang = pdf.Root.get("/Lang")
        if lang:
            report["has_lang"] = True
            report["language"] = str(lang)
        else:
            report["issues"].append("No /Lang -- document language not specified")

        # Title
        if pdf.docinfo:
            title = pdf.docinfo.get("/Title")
            if title:
                report["has_title"] = True
                report["title"] = str(title)
        if not report["has_title"]:
            report["issues"].append("No /Title in document info")

        # DisplayDocTitle
        viewer_prefs = pdf.Root.get("/ViewerPreferences")
        if viewer_prefs and viewer_prefs.get("/DisplayDocTitle"):
            report["has_display_doc_title"] = True
        else:
            report["issues"].append("DisplayDocTitle not set")

        # Bookmarks / Outlines
        if "/Outlines" in pdf.Root:
            report["has_outlines"] = True
        elif report["page_count"] > 20:
            report["issues"].append(
                f"No bookmarks -- recommended for documents over 20 pages "
                f"({report['page_count']} pages)"
            )

    return report


def extract_content(pdf_path: str, max_pages: int = 50) -> dict:
    """Extract text blocks with positions, font sizes, and images using PyMuPDF."""
    content: dict = {
        "pages": [],
        "total_images": 0,
        "total_text_blocks": 0,
    }

    doc = fitz.open(pdf_path)
    page_limit = min(len(doc), max_pages)

    for page_num in range(page_limit):
        page = doc[page_num]
        page_data = {
            "page": page_num,
            "width": page.rect.width,
            "height": page.rect.height,
            "text_blocks": [],
            "images": [],
        }

        blocks = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)["blocks"]
        for block in blocks:
            if block["type"] == 0:  # text
                spans_info = _extract_spans(block)
                if spans_info["text"]:
                    page_data["text_blocks"].append(spans_info)
                    content["total_text_blocks"] += 1
            elif block["type"] == 1:  # image
                page_data["images"].append({
                    "bbox": list(block["bbox"]),
                    "width": block.get("width", 0),
                    "height": block.get("height", 0),
                })
                content["total_images"] += 1

        # Also detect XObject images that don't appear as block type 1
        xobj_images = page.get_images(full=True)
        if xobj_images and not page_data["images"]:
            for img_info in xobj_images:
                img_width = img_info[2]
                img_height = img_info[3]
                if img_width > 50 and img_height > 50:
                    page_data["images"].append({
                        "bbox": [0, 0, float(page.rect.width), float(page.rect.height)],
                        "width": img_width,
                        "height": img_height,
                    })
                    content["total_images"] += 1

        content["pages"].append(page_data)

    doc.close()
    return content


def _extract_spans(block: dict) -> dict:
    """Pull full text, dominant font size, and font name from a text block."""
    text_parts: list[str] = []
    sizes: list[float] = []
    fonts: list[str] = []

    for line in block.get("lines", []):
        line_text = ""
        for span in line.get("spans", []):
            span_text = span.get("text", "")
            line_text += span_text
            if span_text.strip():
                sizes.append(span.get("size", 0))
                fonts.append(span.get("font", ""))
        text_parts.append(line_text)

    text = "\n".join(text_parts).strip()
    dominant_size = max(sizes) if sizes else 0
    dominant_font = max(set(fonts), key=fonts.count) if fonts else ""

    return {
        "text": text,
        "bbox": list(block["bbox"]),
        "font_size": round(dominant_size, 2),
        "font_name": dominant_font,
    }


def detect_tables(pdf_path: str, max_pages: int = 50) -> dict:
    """Detect tables using pdfplumber."""
    result = {"tables_found": 0, "pages_with_tables": [], "pages_analyzed": 0}

    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages[:max_pages]):
            result["pages_analyzed"] += 1
            tables = page.find_tables()
            if tables:
                result["tables_found"] += len(tables)
                result["pages_with_tables"].append(i)

    return result


def compute_score(structure: dict, content: dict, tables: dict) -> dict:
    """Compute a weighted accessibility score from structural checks."""
    checks = {
        "tagged": {
            "passed": structure["tagged"],
            "weight": 25,
            "description": "Document is tagged",
        },
        "language": {
            "passed": structure["has_lang"],
            "weight": 10,
            "description": "Document language specified",
        },
        "title": {
            "passed": structure["has_title"],
            "weight": 10,
            "description": "Document title set",
        },
        "struct_tree": {
            "passed": structure["has_struct_tree"],
            "weight": 25,
            "description": "Structure tree present",
        },
        "display_doc_title": {
            "passed": structure["has_display_doc_title"],
            "weight": 5,
            "description": "DisplayDocTitle enabled",
        },
        "bookmarks": {
            "passed": structure["has_outlines"] or structure["page_count"] <= 20,
            "weight": 5,
            "description": "Bookmarks present (or not needed)",
        },
    }

    # Image alt text -- actually verify /Alt on Figure StructElems
    if content["total_images"] > 0:
        alt_text_passed = False
        if structure["has_struct_tree"]:
            alt_text_passed = _check_figure_alt_texts(structure.get("file", ""))
        checks["alt_text"] = {
            "passed": alt_text_passed,
            "weight": 10,
            "description": (
                "Figure elements have alt text" if alt_text_passed
                else "Images found but Figure elements lack /Alt attributes"
            ),
        }
    else:
        checks["alt_text"] = {
            "passed": True,
            "weight": 10,
            "description": "No images -- alt text not needed",
        }

    # Table headers -- actually verify TH children in Table StructElems
    if tables["tables_found"] > 0:
        th_passed = False
        if structure["has_struct_tree"]:
            th_passed = _check_table_headers(structure.get("file", ""))
        checks["table_headers"] = {
            "passed": th_passed,
            "weight": 10,
            "description": (
                "Tables have TH header elements" if th_passed
                else "Tables detected but no TH elements in structure tree"
            ),
        }
    else:
        checks["table_headers"] = {
            "passed": True,
            "weight": 10,
            "description": "No tables -- headers not needed",
        }

    total_possible = sum(c["weight"] for c in checks.values())
    total_earned = sum(c["weight"] for c in checks.values() if c["passed"])
    score = round((total_earned / total_possible) * 100) if total_possible else 0

    return {
        "score": score,
        "total_possible": total_possible,
        "total_earned": total_earned,
        "checks": checks,
        "grade": (
            "A" if score >= 90 else
            "B" if score >= 70 else
            "C" if score >= 50 else
            "F"
        ),
    }


def _walk_struct_elems(node, tag_name: str) -> list:
    """Recursively collect StructElems whose /S matches tag_name."""
    results = []
    s = node.get("/S")
    if s is not None and str(s) == f"/{tag_name}":
        results.append(node)
    kids = node.get("/K")
    if kids is not None:
        if isinstance(kids, Array):
            for child in kids:
                if isinstance(child, Dictionary) or hasattr(child, "get"):
                    try:
                        results.extend(_walk_struct_elems(child, tag_name))
                    except Exception:
                        pass
        elif isinstance(kids, Dictionary) or hasattr(kids, "get"):
            try:
                results.extend(_walk_struct_elems(kids, tag_name))
            except Exception:
                pass
    return results


def _check_figure_alt_texts(pdf_path: str) -> bool:
    """Return True if at least one Figure StructElem has an /Alt attribute."""
    if not pdf_path:
        return False
    try:
        with pikepdf.open(pdf_path) as pdf:
            struct_tree = pdf.Root.get("/StructTreeRoot")
            if not struct_tree:
                return False
            figures = _walk_struct_elems(struct_tree, "Figure")
            if not figures:
                return False
            # Pass if at least one Figure has /Alt
            return any(fig.get("/Alt") is not None for fig in figures)
    except Exception:
        return False


def _check_table_headers(pdf_path: str) -> bool:
    """Return True if at least one Table StructElem contains a TH child."""
    if not pdf_path:
        return False
    try:
        with pikepdf.open(pdf_path) as pdf:
            struct_tree = pdf.Root.get("/StructTreeRoot")
            if not struct_tree:
                return False
            tables = _walk_struct_elems(struct_tree, "Table")
            if not tables:
                return False
            # Check if any table has TH descendants
            for table in tables:
                th_elems = _walk_struct_elems(table, "TH")
                if th_elems:
                    return True
            return False
    except Exception:
        return False


def analyze_pdf(file_path: str) -> dict:
    """
    Full analysis pipeline.  Returns a dict with structure, content,
    tables, score, and issue summary.
    """
    path = str(file_path)
    structure = analyze_structure(path)
    content = extract_content(path)
    tables = detect_tables(path)
    score = compute_score(structure, content, tables)

    return {
        "structure": structure,
        "content": {
            "total_text_blocks": content["total_text_blocks"],
            "total_images": content["total_images"],
            "pages_analyzed": len(content["pages"]),
            "pages": content["pages"],
        },
        "tables": tables,
        "score": score,
    }


# ---------------------------------------------------------------------------
# 2. Auto-classification
# ---------------------------------------------------------------------------

def _classify_blocks(content: dict) -> list[dict]:
    """
    Auto-classify text blocks into H1 / H2 / H3 / P by font size.

    Strategy:
      - Collect all distinct font sizes across the document.
      - Sort descending.  Largest = H1, second = H2, third = H3,
        everything else = P.
      - Only assign heading tags to blocks whose text is short enough
        to be plausible headings (< 200 chars).
    """
    MAX_HEADING_CHARS = 200

    # Gather all non-empty blocks with sizes
    all_blocks: list[dict] = []
    for page_data in content["pages"]:
        for block in page_data["text_blocks"]:
            if block["text"].strip():
                all_blocks.append({
                    **block,
                    "page": page_data["page"],
                })

    if not all_blocks:
        return []

    # Determine distinct sizes
    sizes = sorted({b["font_size"] for b in all_blocks if b["font_size"] > 0}, reverse=True)

    # Build a size -> tag map
    size_tag: dict[float, str] = {}
    heading_levels = ["H1", "H2", "H3"]
    for idx, size in enumerate(sizes):
        if idx < len(heading_levels):
            size_tag[size] = heading_levels[idx]
        else:
            size_tag[size] = "P"

    # If there's only one distinct size, everything is P
    if len(sizes) <= 1:
        size_tag = {s: "P" for s in sizes}

    # Assign tags
    classified: list[dict] = []
    mcid_counters: dict[int, int] = defaultdict(int)

    for block in all_blocks:
        tag = size_tag.get(block["font_size"], "P")

        # Long text cannot be a heading
        if tag != "P" and len(block["text"]) > MAX_HEADING_CHARS:
            tag = "P"

        page = block["page"]
        mcid = mcid_counters[page]
        mcid_counters[page] += 1

        classified.append({
            "type": tag,
            "page": page,
            "mcid": mcid,
            "text": block["text"],
            "bbox": block["bbox"],
            "font_size": block["font_size"],
        })

    return classified


# ---------------------------------------------------------------------------
# 3. Tag writing (pikepdf)
# ---------------------------------------------------------------------------

def _add_metadata(pdf: pikepdf.Pdf, title: str, lang: str = "en-US"):
    """Set document-level accessibility metadata."""
    pdf.Root[Name("/Lang")] = String(lang)

    with pdf.open_metadata() as meta:
        meta["dc:title"] = title
        meta["dc:language"] = [lang]
        meta["pdfuaid:part"] = "1"

    # Ensure the pdfuaid namespace is in the XMP packet
    # pikepdf's open_metadata may not register the pdfuaid namespace,
    # so we inject it directly into the XMP stream.
    if "/Metadata" in pdf.Root:
        xmp_stream = pdf.Root["/Metadata"]
        xmp_bytes = xmp_stream.read_bytes()
        xmp_str = xmp_bytes.decode("utf-8", errors="replace")

        pdfuaid_ns = 'xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/"'
        pdfuaid_element = "<pdfuaid:part>1</pdfuaid:part>"

        if "pdfuaid:part" not in xmp_str:
            # Add namespace and element before closing </rdf:Description>
            # Find the last </rdf:Description> and inject before it
            insertion_point = xmp_str.rfind("</rdf:Description>")
            if insertion_point != -1:
                # Find the opening <rdf:Description that precedes this closing tag
                # and add namespace there
                desc_start = xmp_str.rfind("<rdf:Description", 0, insertion_point)
                if desc_start != -1:
                    # Find the > that closes this opening tag
                    tag_end = xmp_str.find(">", desc_start)
                    if tag_end != -1:
                        # Insert a new rdf:Description block with pdfuaid
                        new_block = (
                            f'\n    <rdf:Description rdf:about="" {pdfuaid_ns}>'
                            f"\n      {pdfuaid_element}"
                            f"\n    </rdf:Description>"
                        )
                        # Insert after the last </rdf:Description>
                        close_end = insertion_point + len("</rdf:Description>")
                        xmp_str = xmp_str[:close_end] + new_block + xmp_str[close_end:]

            xmp_stream.write(xmp_str.encode("utf-8"))

    pdf.docinfo[Name("/Title")] = String(title)

    pdf.Root[Name("/ViewerPreferences")] = Dictionary({
        "/DisplayDocTitle": pikepdf.Boolean(True),
    })

    pdf.Root[Name("/MarkInfo")] = Dictionary({
        "/Marked": pikepdf.Boolean(True),
    })


def _build_structure_tree(
    pdf: pikepdf.Pdf,
    tag_assignments: list[dict],
    alt_texts: dict | None = None,
):
    """Build StructTreeRoot with Document -> heading/paragraph elements."""
    struct_elems = []

    # Build a lookup: page_number -> list of alt text descriptions
    page_alt_texts: dict[int, list[str]] = {}
    if alt_texts:
        for page_key, alt_list in alt_texts.items():
            page_num = int(page_key)
            page_alt_texts[page_num] = [
                item.get("description", "") for item in alt_list
            ]

    # Track how many Figure elements we've seen per page for alt text indexing
    figure_counters: dict[int, int] = defaultdict(int)

    for tag in tag_assignments:
        elem_dict = {
            "/Type": Name("/StructElem"),
            "/S": Name(f"/{tag['type']}"),
            "/Pg": pdf.pages[tag["page"]].obj,
            "/K": tag["mcid"],
        }

        # Set /Alt on Figure elements if alt text is available
        if tag["type"] == "Figure":
            page_num = tag["page"]
            fig_idx = figure_counters[page_num]
            figure_counters[page_num] += 1

            alts = page_alt_texts.get(page_num, [])
            if fig_idx < len(alts) and alts[fig_idx]:
                elem_dict["/Alt"] = String(alts[fig_idx])
            elif tag.get("alt_text"):
                # Fallback: alt_text directly on the tag assignment
                elem_dict["/Alt"] = String(tag["alt_text"])

        elem = pdf.make_indirect(Dictionary(elem_dict))
        struct_elems.append(elem)

    doc_elem = pdf.make_indirect(Dictionary({
        "/Type": Name("/StructElem"),
        "/S": Name("/Document"),
        "/K": Array(struct_elems),
    }))

    for elem in struct_elems:
        elem[Name("/P")] = doc_elem

    # Parent tree -- maps (page_num, MCID) -> struct element
    pages_mcid_map: dict[int, list[tuple[int, pikepdf.Object]]] = defaultdict(list)
    for i, tag in enumerate(tag_assignments):
        pages_mcid_map[tag["page"]].append((tag["mcid"], struct_elems[i]))

    nums_array = Array()
    for page_num in sorted(pages_mcid_map):
        nums_array.append(page_num)
        page_elems = sorted(pages_mcid_map[page_num], key=lambda x: x[0])
        mcid_array = Array([elem for _, elem in page_elems])
        nums_array.append(pdf.make_indirect(mcid_array))

    parent_tree = pdf.make_indirect(Dictionary({
        "/Type": Name("/ParentTree"),
        "/Nums": nums_array,
    }))

    struct_tree_root = pdf.make_indirect(Dictionary({
        "/Type": Name("/StructTreeRoot"),
        "/K": doc_elem,
        "/ParentTree": parent_tree,
    }))

    doc_elem[Name("/P")] = struct_tree_root
    pdf.Root[Name("/StructTreeRoot")] = struct_tree_root


def _inject_marked_content(pdf: pikepdf.Pdf, page_num: int, page_tags: list[dict]):
    """
    Inject per-block BDC/EMC marked content operators into the page content stream.

    For each tagged block we emit:
        /<TagType> <</MCID n>> BDC
    before the block's text operators and EMC after.

    This implementation parses the raw content stream, identifies text-drawing
    sequences (BT...ET), and wraps each one with the corresponding tag's
    marked-content operators in order.  If there are more BT/ET groups than
    tags, extra groups get a /Span wrapper.  If there are fewer, remaining
    tags still get empty BDC/EMC pairs so the structure tree stays consistent.
    """
    page = pdf.pages[page_num]
    if "/Contents" not in page:
        return

    contents = page["/Contents"]
    if isinstance(contents, pikepdf.Array):
        raw = b""
        for ref in contents:
            raw += ref.read_bytes()
    else:
        raw = contents.read_bytes()

    # Split stream into BT...ET groups and non-text segments
    segments = _split_content_stream(raw)

    # Match text groups to tags in order
    text_group_idx = 0
    new_parts: list[bytes] = []

    for seg_type, seg_bytes in segments:
        if seg_type == "text" and text_group_idx < len(page_tags):
            tag = page_tags[text_group_idx]
            marker_start = f"/{tag['type']} <</MCID {tag['mcid']}>> BDC\n".encode()
            marker_end = b"\nEMC\n"
            new_parts.append(marker_start + seg_bytes + marker_end)
            text_group_idx += 1
        else:
            new_parts.append(seg_bytes)

    # If there are remaining tags with no corresponding text group,
    # append empty marked-content pairs to keep the structure tree valid.
    while text_group_idx < len(page_tags):
        tag = page_tags[text_group_idx]
        empty = f"/{tag['type']} <</MCID {tag['mcid']}>> BDC\nEMC\n".encode()
        new_parts.append(empty)
        text_group_idx += 1

    page[Name("/Contents")] = pdf.make_stream(b"".join(new_parts))
    page[Name("/StructParents")] = page_num


def _split_content_stream(raw: bytes) -> list[tuple[str, bytes]]:
    """
    Split a PDF content stream into alternating (type, bytes) segments.
    type is either 'other' or 'text' (BT...ET block).

    This is a byte-level scan that respects string literals (parentheses)
    so we don't false-match BT/ET inside text strings.
    """
    segments: list[tuple[str, bytes]] = []
    pos = 0
    length = len(raw)
    current_start = 0
    in_text = False

    while pos < length:
        # Skip over string literals to avoid false BT/ET matches
        if raw[pos:pos + 1] == b"(":
            depth = 1
            pos += 1
            while pos < length and depth > 0:
                ch = raw[pos:pos + 1]
                if ch == b"\\":
                    pos += 1  # skip escaped char
                elif ch == b"(":
                    depth += 1
                elif ch == b")":
                    depth -= 1
                pos += 1
            continue

        if not in_text:
            # Look for BT (must be preceded by whitespace/start and followed by whitespace/end)
            if raw[pos:pos + 2] == b"BT" and _is_operator_boundary(raw, pos, 2):
                # Everything before BT is 'other'
                if pos > current_start:
                    segments.append(("other", raw[current_start:pos]))
                current_start = pos
                in_text = True
                pos += 2
                continue
        else:
            # Look for ET
            if raw[pos:pos + 2] == b"ET" and _is_operator_boundary(raw, pos, 2):
                end = pos + 2
                segments.append(("text", raw[current_start:end]))
                current_start = end
                in_text = False
                pos = end
                continue

        pos += 1

    # Remaining bytes
    if current_start < length:
        seg_type = "text" if in_text else "other"
        segments.append((seg_type, raw[current_start:]))

    return segments


def _is_operator_boundary(raw: bytes, pos: int, op_len: int) -> bool:
    """Check that the operator at raw[pos:pos+op_len] is delimited properly."""
    before_ok = (pos == 0) or raw[pos - 1:pos] in (
        b" ", b"\n", b"\r", b"\t", b"\x00",
    )
    end = pos + op_len
    after_ok = (end >= len(raw)) or raw[end:end + 1] in (
        b" ", b"\n", b"\r", b"\t", b"\x00",
    )
    return before_ok and after_ok


# ---------------------------------------------------------------------------
# 4. Public remediation entry point
# ---------------------------------------------------------------------------

async def remediate_pdf_async(
    file_path: str,
    output_path: str | None = None,
    verify: bool = True,
    *,
    gemini_provider: str = "standard",
    gcp_project: str = "",
    gcp_location: str = "us-central1",
) -> dict:
    """
    Full remediation pipeline (async, supports Gemini verification):
      1. Analyze the input PDF (before state).
      2. Extract content and auto-classify blocks by font size.
      2b. (Optional) Verify and correct via Gemini AI.
      3. Write tags, metadata, and marked content operators.
      4. Analyze the output PDF (after state).
      5. Return before/after comparison and output path.
    """
    file_path = str(file_path)
    if output_path is None:
        p = Path(file_path)
        output_path = str(p.parent / f"{p.stem}_remediated{p.suffix}")

    logger.info("Analyzing input PDF: %s",
                 sanitize_filename(Path(file_path).name, _HIPAA_MODE))
    before_analysis = analyze_pdf(file_path)

    logger.info("Extracting content for classification")
    content = extract_content(file_path)
    tag_assignments = _classify_blocks(content)

    if not tag_assignments:
        logger.warning("No text blocks found -- nothing to remediate")
        return {
            "before": before_analysis,
            "after": before_analysis,
            "tag_assignments": [],
            "output_path": file_path,
            "blocks_tagged": 0,
        }

    # ── Gemini AI verification step ──────────────────────────────────
    verification_info: dict | None = None
    if verify:
        logger.info("Running Gemini AI verification on %d tags", len(tag_assignments))
        verification_result = await verify_and_correct(
            pdf_path=file_path,
            tag_assignments=tag_assignments,
            content=content,
            gemini_provider=gemini_provider,
            gcp_project=gcp_project,
            gcp_location=gcp_location,
        )
        verification_info = {
            "issues_found": verification_result["issues_found"],
            "verification_score": verification_result["verification_score"],
            "alt_texts": verification_result["alt_texts"],
        }

        corrected = verification_result["corrected_tags"]
        if corrected:
            # Log changes
            original_types = {(t["page"], t["mcid"]): t["type"] for t in tag_assignments}
            changes = 0
            for ct in corrected:
                key = (ct["page"], ct["mcid"])
                old_type = original_types.get(key)
                if old_type and old_type != ct["type"]:
                    logger.info(
                        "Gemini corrected page %d mcid %d: %s -> %s (%s)",
                        ct["page"], ct["mcid"], old_type, ct["type"],
                        ct.get("reason", ""),
                    )
                    changes += 1
            logger.info("Gemini made %d tag corrections", changes)

            # Filter out artifacts
            tag_assignments = [
                t for t in corrected if not t.get("is_artifact", False)
            ]

            # Re-assign MCIDs sequentially per page after filtering
            mcid_counters: dict[int, int] = defaultdict(int)
            for t in tag_assignments:
                t["mcid"] = mcid_counters[t["page"]]
                mcid_counters[t["page"]] += 1

    # ── Add Figure tags for image blocks ─────────────────────────────
    # Images are not included by _classify_blocks, so we add them here.
    mcid_counters_fig: dict[int, int] = defaultdict(int)
    for t in tag_assignments:
        mcid_counters_fig[t["page"]] = max(
            mcid_counters_fig[t["page"]], t["mcid"] + 1
        )

    for page_data in content["pages"]:
        page_num = page_data["page"]
        for img in page_data["images"]:
            mcid = mcid_counters_fig[page_num]
            mcid_counters_fig[page_num] += 1
            tag_assignments.append({
                "type": "Figure",
                "page": page_num,
                "mcid": mcid,
                "text": "",
                "bbox": img["bbox"],
                "font_size": 0,
            })

    # Extract alt_texts from verification result
    alt_texts: dict | None = None
    if verification_info is not None:
        alt_texts = verification_info.get("alt_texts")

    # Derive title from first H1
    title = "Untitled Document"
    for tag in tag_assignments:
        if tag["type"] == "H1":
            title = tag["text"][:256]
            break

    logger.info("Writing tags: %d elements across %d pages",
                len(tag_assignments),
                len({t["page"] for t in tag_assignments}))

    pdf = pikepdf.open(file_path)

    _add_metadata(pdf, title)
    _build_structure_tree(pdf, tag_assignments, alt_texts=alt_texts)

    # Inject marked content per page
    pages_tags: dict[int, list[dict]] = defaultdict(list)
    for tag in tag_assignments:
        pages_tags[tag["page"]].append(tag)
    for page_num, ptags in pages_tags.items():
        ptags.sort(key=lambda t: t["mcid"])
        _inject_marked_content(pdf, page_num, ptags)

    pdf.save(output_path)
    pdf.close()

    logger.info("Saved remediated PDF: %s",
                 sanitize_filename(Path(output_path).name, _HIPAA_MODE))

    after_analysis = analyze_pdf(output_path)

    # Build tag summary
    tag_summary: dict[str, int] = defaultdict(int)
    for tag in tag_assignments:
        tag_summary[tag["type"]] += 1

    # Collect page dimensions for frontend coordinate mapping
    page_dimensions = [
        {"page": p["page"], "width": p["width"], "height": p["height"]}
        for p in content["pages"]
    ]

    result = {
        "before": before_analysis,
        "after": after_analysis,
        "tag_assignments": [
            {
                "type": t["type"],
                "page": t["page"],
                "mcid": t["mcid"],
                "text": t["text"][:120],
                "font_size": t["font_size"],
                "bbox": t["bbox"],
            }
            for t in tag_assignments
        ],
        "page_dimensions": page_dimensions,
        "tag_summary": dict(tag_summary),
        "output_path": output_path,
        "blocks_tagged": len(tag_assignments),
    }

    if verification_info is not None:
        result["verification"] = verification_info

    return result


def apply_tag_edits(
    pdf_path: str,
    output_path: str,
    tag_assignments: list[dict],
) -> dict:
    """
    Apply edited tag assignments to an existing PDF.

    Opens the PDF with pikepdf, removes any existing structure tree,
    rebuilds it with the new tag assignments (using _build_structure_tree
    and _inject_marked_content), and saves to output_path.

    Args:
        pdf_path: Path to the source PDF (typically a previously remediated file).
        output_path: Where to save the re-tagged PDF.
        tag_assignments: List of dicts, each with keys:
            type (str), text (str), page (int), mcid (int),
            font_size (float), bbox ([x0,y0,x1,y1]).
            Figure tags may also include alt_text (str).

    Returns:
        A dict with the analysis result of the newly saved PDF.
    """
    logger.info("Applying %d tag edits to %s", len(tag_assignments),
                 sanitize_filename(Path(pdf_path).name, _HIPAA_MODE))

    # Re-assign MCIDs sequentially per page to ensure consistency
    mcid_counters: dict[int, int] = defaultdict(int)
    for tag in tag_assignments:
        tag["mcid"] = mcid_counters[tag["page"]]
        mcid_counters[tag["page"]] += 1

    # Derive title from first H1
    title = "Untitled Document"
    for tag in tag_assignments:
        if tag["type"] == "H1":
            title = tag.get("text", "")[:256]
            break

    pdf = pikepdf.open(pdf_path)

    # Remove existing structure tree so we can rebuild cleanly
    if "/StructTreeRoot" in pdf.Root:
        del pdf.Root[Name("/StructTreeRoot")]
    if "/MarkInfo" in pdf.Root:
        del pdf.Root[Name("/MarkInfo")]

    # Clear existing StructParents and marked content from pages
    for page in pdf.pages:
        if "/StructParents" in page:
            del page[Name("/StructParents")]

    # Set metadata and rebuild structure
    _add_metadata(pdf, title)

    # Build alt_texts dict from tag assignments that have alt_text
    alt_texts_for_tree: dict[int, list[dict]] = defaultdict(list)
    for tag in tag_assignments:
        if tag["type"] == "Figure" and tag.get("alt_text"):
            alt_texts_for_tree[tag["page"]].append(
                {"description": tag["alt_text"]}
            )

    # Use alt_texts if any were provided
    alt_texts_param = (
        {str(k): v for k, v in alt_texts_for_tree.items()}
        if alt_texts_for_tree
        else None
    )

    _build_structure_tree(pdf, tag_assignments, alt_texts=alt_texts_param)

    # Inject marked content per page
    pages_tags: dict[int, list[dict]] = defaultdict(list)
    for tag in tag_assignments:
        pages_tags[tag["page"]].append(tag)
    for page_num, ptags in pages_tags.items():
        ptags.sort(key=lambda t: t["mcid"])
        _inject_marked_content(pdf, page_num, ptags)

    pdf.save(output_path)
    pdf.close()

    logger.info("Saved edited PDF: %s",
                 sanitize_filename(Path(output_path).name, _HIPAA_MODE))

    # Re-analyze the output
    after_analysis = analyze_pdf(output_path)
    return after_analysis


def remediate_pdf(
    file_path: str,
    output_path: str | None = None,
    verify: bool = True,
) -> dict:
    """
    Sync wrapper around remediate_pdf_async.

    If an event loop is already running (e.g. inside FastAPI) callers should
    use ``remediate_pdf_async`` directly.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        # We're already inside an async context -- should not happen if
        # callers use the async variant, but handle it gracefully.
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as pool:
            return pool.submit(
                asyncio.run,
                remediate_pdf_async(file_path, output_path, verify),
            ).result()
    else:
        return asyncio.run(
            remediate_pdf_async(file_path, output_path, verify)
        )
