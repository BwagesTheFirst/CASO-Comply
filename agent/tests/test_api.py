# agent/tests/test_api.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from agent.api import create_app
from agent.config import AgentConfig
from agent.db import Database

@pytest_asyncio.fixture
async def app_client(tmp_path):
    db = Database(str(tmp_path / "test.db"))
    await db.init()
    config = AgentConfig(license_key="test", scan_paths=[str(tmp_path)])
    app = create_app(config, db)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    await db.close()

@pytest.mark.asyncio
async def test_health(app_client):
    resp = await app_client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"

@pytest.mark.asyncio
async def test_stats_empty(app_client):
    resp = await app_client.get("/api/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 0

@pytest.mark.asyncio
async def test_config_endpoint(app_client):
    resp = await app_client.get("/api/config")
    assert resp.status_code == 200
    data = resp.json()
    assert data["mode"] == "hybrid"
    assert "license_key" not in data

@pytest.mark.asyncio
async def test_pdfs_list_empty(app_client):
    resp = await app_client.get("/api/pdfs")
    assert resp.status_code == 200
    assert resp.json() == []
