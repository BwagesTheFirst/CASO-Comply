"""Tests for license validation and usage reporting."""
import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from agent.license import LicenseClient

@pytest.mark.asyncio
async def test_validate_license_success():
    client = LicenseClient(api_url="https://fake.com", license_key="valid-key")
    with patch("agent.license.httpx.AsyncClient") as mock_cls:
        mock_http = AsyncMock()
        mock_cls.return_value.__aenter__ = AsyncMock(return_value=mock_http)
        mock_cls.return_value.__aexit__ = AsyncMock(return_value=False)
        resp = MagicMock()
        resp.status_code = 200
        resp.json.return_value = {"valid": True, "org": "Springfield"}
        mock_http.post.return_value = resp
        result = await client.validate()
    assert result is True

@pytest.mark.asyncio
async def test_validate_license_failure():
    client = LicenseClient(api_url="https://fake.com", license_key="bad")
    with patch("agent.license.httpx.AsyncClient") as mock_cls:
        mock_http = AsyncMock()
        mock_cls.return_value.__aenter__ = AsyncMock(return_value=mock_http)
        mock_cls.return_value.__aexit__ = AsyncMock(return_value=False)
        resp = MagicMock()
        resp.status_code = 403
        mock_http.post.return_value = resp
        result = await client.validate()
    assert result is False

@pytest.mark.asyncio
async def test_report_usage():
    client = LicenseClient(api_url="https://fake.com", license_key="key")
    with patch("agent.license.httpx.AsyncClient") as mock_cls:
        mock_http = AsyncMock()
        mock_cls.return_value.__aenter__ = AsyncMock(return_value=mock_http)
        mock_cls.return_value.__aexit__ = AsyncMock(return_value=False)
        resp = MagicMock()
        resp.status_code = 200
        mock_http.post.return_value = resp
        await client.report_usage(pages_processed=50, pdfs_completed=10)
    mock_http.post.assert_called_once()

@pytest.mark.asyncio
async def test_phone_home_disabled():
    client = LicenseClient(api_url="", license_key="", enabled=False)
    result = await client.validate()
    assert result is True
