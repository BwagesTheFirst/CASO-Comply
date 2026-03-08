# agent/tests/test_processor.py
import sys
import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from agent.config import AgentConfig
from agent.db import Database
from agent.processor import Processor

# Pre-register a mock 'remediation' module so the lazy import inside
# Processor._process_local doesn't pull in fitz/pikepdf/etc.
_mock_remediation = MagicMock()
sys.modules.setdefault("remediation", _mock_remediation)


@pytest_asyncio.fixture
async def db(tmp_path):
    database = Database(str(tmp_path / "test.db"))
    await database.init()
    yield database
    await database.close()


@pytest.fixture
def config(tmp_path):
    return AgentConfig(
        mode="local",
        license_key="test",
        scan_paths=[],
        output_dir=str(tmp_path / "output"),
        phone_home=False,
    )


@pytest.mark.asyncio
async def test_process_pdf_local_mode(db, config, tmp_path):
    processor = Processor(config=config, db=db)

    pdf_path = str(tmp_path / "test.pdf")
    (tmp_path / "test.pdf").write_bytes(b"%PDF-fake")

    mock_rem = AsyncMock(return_value={
        "before": {"score": {"score": 15}},
        "after": {"score": {"score": 94}},
        "blocks_tagged": 2,
        "tag_assignments": [],
        "output_path": str(tmp_path / "output" / "test_remediated.pdf"),
    })
    _mock_remediation.remediate_pdf_async = mock_rem

    result = await processor.process_one(pdf_path)

    assert result["status"] == "completed"
    assert result["before_score"] == 15
    assert result["after_score"] == 94
    mock_rem.assert_called_once()


@pytest.mark.asyncio
async def test_process_pdf_cloud_mode(db, tmp_path):
    config = AgentConfig(
        mode="cloud",
        license_key="test",
        scan_paths=[],
        output_dir=str(tmp_path / "output"),
        caso_api_url="https://fake-api.com",
        phone_home=False,
    )
    processor = Processor(config=config, db=db)

    pdf_path = str(tmp_path / "test.pdf")
    (tmp_path / "test.pdf").write_bytes(b"%PDF-fake")

    with patch("agent.processor.httpx.AsyncClient") as mock_client_cls:
        mock_client = AsyncMock()
        mock_client_cls.return_value.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client_cls.return_value.__aexit__ = AsyncMock(return_value=False)
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "file_id": "abc",
            "download_url": "/api/download/abc",
            "before": {"score": {"score": 10, "grade": "F", "checks": {}}},
            "after": {"score": {"score": 90, "grade": "A", "checks": {}}},
            "blocks_tagged": 5,
            "tag_assignments": [],
        }
        mock_client.post.return_value = mock_response
        mock_download = MagicMock()
        mock_download.status_code = 200
        mock_download.content = b"%PDF-fixed"
        mock_client.get.return_value = mock_download

        result = await processor.process_one(pdf_path)

    assert result["status"] == "completed"


@pytest.mark.asyncio
async def test_process_failure_marks_failed(db, config, tmp_path):
    processor = Processor(config=config, db=db)
    pdf_path = str(tmp_path / "bad.pdf")
    (tmp_path / "bad.pdf").write_bytes(b"not a real pdf")

    _mock_remediation.remediate_pdf_async = AsyncMock(
        side_effect=RuntimeError("corrupt PDF")
    )

    result = await processor.process_one(pdf_path)
    assert result["status"] == "failed"
    assert result["error"]
