# agent/tests/test_db.py
import pytest
import pytest_asyncio
from agent.db import Database

@pytest_asyncio.fixture
async def db(tmp_path):
    database = Database(str(tmp_path / "test.db"))
    await database.init()
    yield database
    await database.close()

@pytest.mark.asyncio
async def test_record_pdf(db):
    await db.upsert_pdf(path="/docs/test.pdf", sha256="abc123", page_count=5)
    rec = await db.get_pdf("/docs/test.pdf")
    assert rec is not None
    assert rec["sha256"] == "abc123"
    assert rec["status"] == "pending"

@pytest.mark.asyncio
async def test_skip_unchanged_pdf(db):
    await db.upsert_pdf(path="/docs/a.pdf", sha256="hash1", page_count=3)
    assert await db.needs_processing("/docs/a.pdf", "hash1") is False

@pytest.mark.asyncio
async def test_reprocess_changed_pdf(db):
    await db.upsert_pdf(path="/docs/a.pdf", sha256="hash1", page_count=3)
    assert await db.needs_processing("/docs/a.pdf", "hash2") is True

@pytest.mark.asyncio
async def test_update_result(db):
    await db.upsert_pdf(path="/docs/b.pdf", sha256="h", page_count=1)
    await db.update_result(path="/docs/b.pdf", status="completed", before_score=15, after_score=94)
    rec = await db.get_pdf("/docs/b.pdf")
    assert rec["status"] == "completed"
    assert rec["before_score"] == 15
    assert rec["after_score"] == 94

@pytest.mark.asyncio
async def test_get_stats(db):
    await db.upsert_pdf(path="/a.pdf", sha256="1", page_count=2)
    await db.update_result(path="/a.pdf", status="completed", before_score=20, after_score=90)
    await db.upsert_pdf(path="/b.pdf", sha256="2", page_count=3)
    stats = await db.get_stats()
    assert stats["total"] == 2
    assert stats["completed"] == 1
    assert stats["pending"] == 1
    assert stats["total_pages"] == 5
