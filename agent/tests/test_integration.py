# agent/tests/test_integration.py
"""
End-to-end integration test: scan folder -> detect PDF -> process locally -> verify in DB.
"""
import sys
import importlib
import pytest
import pytest_asyncio
import fitz  # PyMuPDF
from pathlib import Path
from agent.config import AgentConfig
from agent.db import Database
from agent.scanner import scan_folder
from agent.processor import Processor


@pytest.fixture(autouse=True)
def _ensure_real_remediation():
    """Ensure the real remediation module is loaded, not a mock from other tests."""
    prev = sys.modules.get("remediation")
    is_mock = prev is not None and not hasattr(prev, "__file__")
    if is_mock:
        del sys.modules["remediation"]
    import remediation  # noqa: F401
    yield
    # Restore previous state so other tests that mock remediation still work
    if is_mock and prev is not None:
        sys.modules["remediation"] = prev

def _create_test_pdf(path: str):
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Budget Report 2026", fontsize=24)
    page.insert_text((72, 120), "Body text paragraph.", fontsize=12)
    page.insert_text((72, 160), "Revenue Overview", fontsize=18)
    page.insert_text((72, 200), "Total revenue increased by 12% compared to last year.", fontsize=12)
    doc.save(path)
    doc.close()

@pytest.mark.asyncio
async def test_full_local_pipeline(tmp_path):
    # Setup
    docs_dir = tmp_path / "documents"
    docs_dir.mkdir()
    output_dir = tmp_path / "output"
    output_dir.mkdir()

    pdf_path = str(docs_dir / "budget.pdf")
    _create_test_pdf(pdf_path)

    config = AgentConfig(
        mode="local",
        license_key="test",
        scan_paths=[str(docs_dir)],
        output_dir=str(output_dir),
        output_mode="directory",
        phone_home=False,
    )
    db = Database(str(tmp_path / "test.db"))
    await db.init()

    # 1. Scan
    found = scan_folder(str(docs_dir))
    assert len(found) == 1
    assert found[0]["path"] == pdf_path

    # 2. Record in DB
    for item in found:
        if await db.needs_processing(item["path"], item["sha256"]):
            await db.upsert_pdf(path=item["path"], sha256=item["sha256"])

    pending = await db.get_pending()
    assert len(pending) == 1

    # 3. Process
    processor = Processor(config=config, db=db)
    result = await processor.process_one(pdf_path)
    assert result["status"] == "completed"
    assert result["before_score"] < result["after_score"]

    # 4. Verify DB updated
    rec = await db.get_pdf(pdf_path)
    assert rec["status"] == "completed"
    assert rec["after_score"] > rec["before_score"]

    # 5. Verify output file exists
    output_files = list(output_dir.glob("*.pdf"))
    assert len(output_files) >= 1

    # 6. Re-scan should skip (unchanged)
    assert await db.needs_processing(pdf_path, found[0]["sha256"]) is False

    # 7. Stats
    stats = await db.get_stats()
    assert stats["completed"] == 1
    assert stats["total"] == 1

    await db.close()
