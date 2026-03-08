# CASO Comply Agent — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Docker-based agent that scans local folders and websites for PDFs, remediates them automatically using three processing modes (cloud/hybrid/local), and provides a local web dashboard.

**Architecture:** A single Docker container runs a FastAPI backend with: a scanner (folder watcher + website crawler), the existing remediation engine, a SQLite state DB, and a React local dashboard. Processing mode is set via `MODE` env var. The agent phones home to the CASO cloud API for license validation and usage reporting.

**Tech Stack:** Python 3.12, FastAPI, SQLite, PyMuPDF, pikepdf, pdfplumber, google-genai, watchdog (file watching), httpx (async HTTP), APScheduler (cron), React (bundled SPA), Docker

---

## Project Structure

```
caso-comply/
  agent/                          # <-- NEW: the agent package
    Dockerfile
    docker-compose.yml
    requirements.txt
    config.example.yaml
    entrypoint.sh
    agent/
      __init__.py
      config.py                   # Config loading (YAML + env vars)
      db.py                       # SQLite schema + CRUD
      scanner.py                  # Folder scanner + file watcher
      crawler.py                  # Website PDF crawler
      processor.py                # Orchestrator: scan -> remediate -> store
      license.py                  # License validation + phone home
      api.py                      # FastAPI app (local dashboard API)
      web/                        # Built React SPA (static files)
        index.html
        ...
    tests/
      test_config.py
      test_db.py
      test_scanner.py
      test_processor.py
      test_license.py
      test_api.py
    remediation.py                # Copied from api-service (shared engine)
    gemini_verify.py              # Copied from api-service (shared engine)
```

> **Note on code sharing:** For the MVP, we copy `remediation.py` and `gemini_verify.py` into the agent directory. Post-MVP, extract them into a shared Python package. Don't over-engineer this now.

---

## Task 1: Project Scaffold + Config Loading

**Files:**
- Create: `agent/requirements.txt`
- Create: `agent/config.example.yaml`
- Create: `agent/agent/__init__.py`
- Create: `agent/agent/config.py`
- Create: `agent/tests/test_config.py`

**Step 1: Create requirements.txt**

```
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
pikepdf>=8.0.0
PyMuPDF>=1.24.0
pdfplumber>=0.11.0
google-genai>=1.0.0
python-multipart>=0.0.9
watchdog>=4.0.0
httpx>=0.27.0
apscheduler>=3.10.0
pyyaml>=6.0.0
aiosqlite>=0.20.0
pytest>=8.0.0
pytest-asyncio>=0.23.0
```

**Step 2: Create config.example.yaml**

```yaml
mode: hybrid
license_key: ""
scan_paths:
  - /data/documents
watch: true
cron: "0 * * * *"
website_urls: []
output_dir: /data/remediated
output_mode: suffix       # suffix | overwrite | directory
max_workers: 1
gemini_api_key: ""
phone_home: true
caso_api_url: https://caso-comply-api.onrender.com
local_port: 9090
```

**Step 3: Write the failing test**

```python
# agent/tests/test_config.py
import os
import pytest
from agent.config import load_config, AgentConfig

def test_load_config_from_yaml(tmp_path):
    cfg_file = tmp_path / "config.yaml"
    cfg_file.write_text("""
mode: local
license_key: "test-key-123"
scan_paths:
  - /tmp/docs
watch: false
cron: "*/30 * * * *"
website_urls:
  - https://example.gov
output_dir: /tmp/out
output_mode: suffix
max_workers: 2
gemini_api_key: ""
phone_home: false
caso_api_url: https://caso-comply-api.onrender.com
local_port: 9090
""")
    config = load_config(str(cfg_file))
    assert config.mode == "local"
    assert config.license_key == "test-key-123"
    assert config.scan_paths == ["/tmp/docs"]
    assert config.watch is False
    assert config.max_workers == 2
    assert config.phone_home is False

def test_env_vars_override_yaml(tmp_path):
    cfg_file = tmp_path / "config.yaml"
    cfg_file.write_text("mode: cloud\nlicense_key: yaml-key\n")
    os.environ["CASO_MODE"] = "local"
    os.environ["CASO_LICENSE_KEY"] = "env-key"
    try:
        config = load_config(str(cfg_file))
        assert config.mode == "local"
        assert config.license_key == "env-key"
    finally:
        del os.environ["CASO_MODE"]
        del os.environ["CASO_LICENSE_KEY"]

def test_invalid_mode_raises():
    with pytest.raises(ValueError, match="mode"):
        AgentConfig(mode="invalid", license_key="x", scan_paths=[])

def test_defaults_applied(tmp_path):
    cfg_file = tmp_path / "config.yaml"
    cfg_file.write_text("license_key: key123\n")
    config = load_config(str(cfg_file))
    assert config.mode == "hybrid"
    assert config.watch is True
    assert config.max_workers == 1
    assert config.local_port == 9090
```

**Step 4: Run tests to verify they fail**

Run: `cd agent && python -m pytest tests/test_config.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'agent.config'`

**Step 5: Implement config.py**

```python
# agent/agent/config.py
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml

VALID_MODES = ("cloud", "hybrid", "local")
VALID_OUTPUT_MODES = ("suffix", "overwrite", "directory")

@dataclass
class AgentConfig:
    mode: str = "hybrid"
    license_key: str = ""
    scan_paths: list[str] = field(default_factory=list)
    watch: bool = True
    cron: str = "0 * * * *"
    website_urls: list[str] = field(default_factory=list)
    output_dir: str = "/data/remediated"
    output_mode: str = "suffix"
    max_workers: int = 1
    gemini_api_key: str = ""
    phone_home: bool = True
    caso_api_url: str = "https://caso-comply-api.onrender.com"
    local_port: int = 9090

    def __post_init__(self):
        if self.mode not in VALID_MODES:
            raise ValueError(f"mode must be one of {VALID_MODES}, got '{self.mode}'")
        if self.output_mode not in VALID_OUTPUT_MODES:
            raise ValueError(f"output_mode must be one of {VALID_OUTPUT_MODES}")

def load_config(config_path: str = "/app/config.yaml") -> AgentConfig:
    """Load config from YAML file, then override with CASO_* env vars."""
    data: dict = {}
    path = Path(config_path)
    if path.exists():
        with open(path) as f:
            data = yaml.safe_load(f) or {}

    # Env var overrides (CASO_MODE, CASO_LICENSE_KEY, etc.)
    env_map = {
        "CASO_MODE": "mode",
        "CASO_LICENSE_KEY": "license_key",
        "CASO_SCAN_PATHS": "scan_paths",  # comma-separated
        "CASO_WATCH": "watch",
        "CASO_CRON": "cron",
        "CASO_OUTPUT_DIR": "output_dir",
        "CASO_OUTPUT_MODE": "output_mode",
        "CASO_MAX_WORKERS": "max_workers",
        "CASO_GEMINI_API_KEY": "gemini_api_key",
        "CASO_PHONE_HOME": "phone_home",
        "CASO_API_URL": "caso_api_url",
        "CASO_LOCAL_PORT": "local_port",
    }

    for env_key, cfg_key in env_map.items():
        val = os.environ.get(env_key)
        if val is not None:
            if cfg_key == "scan_paths":
                data[cfg_key] = [p.strip() for p in val.split(",")]
            elif cfg_key in ("watch", "phone_home"):
                data[cfg_key] = val.lower() in ("true", "1", "yes")
            elif cfg_key in ("max_workers", "local_port"):
                data[cfg_key] = int(val)
            else:
                data[cfg_key] = val

    return AgentConfig(**data)
```

**Step 6: Create `__init__.py`**

```python
# agent/agent/__init__.py
```

**Step 7: Run tests to verify they pass**

Run: `cd agent && pip install pyyaml pytest && python -m pytest tests/test_config.py -v`
Expected: 4 tests PASS

**Step 8: Commit**

```bash
git add agent/
git commit -m "feat(agent): scaffold project with config loading (YAML + env vars)"
```

---

## Task 2: SQLite State Database

**Files:**
- Create: `agent/agent/db.py`
- Create: `agent/tests/test_db.py`

**Step 1: Write the failing test**

```python
# agent/tests/test_db.py
import pytest
import asyncio
from agent.db import Database

@pytest.fixture
async def db(tmp_path):
    database = Database(str(tmp_path / "test.db"))
    await database.init()
    yield database
    await database.close()

@pytest.mark.asyncio
async def test_record_pdf(db):
    await db.upsert_pdf(
        path="/docs/test.pdf",
        sha256="abc123",
        page_count=5,
    )
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
    await db.update_result(
        path="/docs/b.pdf",
        status="completed",
        before_score=15,
        after_score=94,
    )
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
```

**Step 2: Run tests to verify they fail**

Run: `cd agent && python -m pytest tests/test_db.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'agent.db'`

**Step 3: Implement db.py**

```python
# agent/agent/db.py
from __future__ import annotations

import aiosqlite

SCHEMA = """
CREATE TABLE IF NOT EXISTS pdfs (
    path TEXT PRIMARY KEY,
    sha256 TEXT NOT NULL,
    page_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    before_score INTEGER,
    after_score INTEGER,
    source TEXT DEFAULT 'folder',
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    error_message TEXT
);
"""

class Database:
    def __init__(self, db_path: str = "/data/caso-agent.db"):
        self._path = db_path
        self._db: aiosqlite.Connection | None = None

    async def init(self):
        self._db = await aiosqlite.connect(self._path)
        self._db.row_factory = aiosqlite.Row
        await self._db.executescript(SCHEMA)
        await self._db.commit()

    async def close(self):
        if self._db:
            await self._db.close()

    async def upsert_pdf(self, path: str, sha256: str, page_count: int = 0, source: str = "folder"):
        await self._db.execute(
            """INSERT INTO pdfs (path, sha256, page_count, source)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(path) DO UPDATE SET
                 sha256=excluded.sha256,
                 page_count=excluded.page_count,
                 status=CASE WHEN pdfs.sha256 != excluded.sha256 THEN 'pending' ELSE pdfs.status END
            """,
            (path, sha256, page_count, source),
        )
        await self._db.commit()

    async def needs_processing(self, path: str, current_hash: str) -> bool:
        cursor = await self._db.execute(
            "SELECT sha256, status FROM pdfs WHERE path = ?", (path,)
        )
        row = await cursor.fetchone()
        if row is None:
            return True
        return row["sha256"] != current_hash or row["status"] == "pending"

    async def get_pdf(self, path: str) -> dict | None:
        cursor = await self._db.execute("SELECT * FROM pdfs WHERE path = ?", (path,))
        row = await cursor.fetchone()
        return dict(row) if row else None

    async def update_result(self, path: str, status: str, before_score: int = 0, after_score: int = 0, error_message: str = ""):
        await self._db.execute(
            """UPDATE pdfs SET status=?, before_score=?, after_score=?,
               processed_at=CURRENT_TIMESTAMP, error_message=?
               WHERE path=?""",
            (status, before_score, after_score, error_message, path),
        )
        await self._db.commit()

    async def get_pending(self, limit: int = 100) -> list[dict]:
        cursor = await self._db.execute(
            "SELECT * FROM pdfs WHERE status = 'pending' ORDER BY discovered_at LIMIT ?",
            (limit,),
        )
        return [dict(row) for row in await cursor.fetchall()]

    async def get_all(self, limit: int = 500, offset: int = 0) -> list[dict]:
        cursor = await self._db.execute(
            "SELECT * FROM pdfs ORDER BY discovered_at DESC LIMIT ? OFFSET ?",
            (limit, offset),
        )
        return [dict(row) for row in await cursor.fetchall()]

    async def get_stats(self) -> dict:
        cursor = await self._db.execute("""
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) as failed,
                SUM(page_count) as total_pages,
                AVG(CASE WHEN before_score IS NOT NULL THEN before_score END) as avg_before,
                AVG(CASE WHEN after_score IS NOT NULL THEN after_score END) as avg_after
            FROM pdfs
        """)
        row = await cursor.fetchone()
        return dict(row)
```

**Step 4: Run tests**

Run: `cd agent && pip install aiosqlite pytest-asyncio && python -m pytest tests/test_db.py -v`
Expected: 5 tests PASS

**Step 5: Commit**

```bash
git add agent/agent/db.py agent/tests/test_db.py
git commit -m "feat(agent): add SQLite state database with hash-based dedup"
```

---

## Task 3: Folder Scanner

**Files:**
- Create: `agent/agent/scanner.py`
- Create: `agent/tests/test_scanner.py`

**Step 1: Write the failing test**

```python
# agent/tests/test_scanner.py
import pytest
from pathlib import Path
from agent.scanner import scan_folder, compute_file_hash

def test_scan_folder_finds_pdfs(tmp_path):
    (tmp_path / "doc1.pdf").write_bytes(b"%PDF-fake")
    (tmp_path / "doc2.pdf").write_bytes(b"%PDF-fake2")
    (tmp_path / "readme.txt").write_text("not a pdf")
    sub = tmp_path / "subdir"
    sub.mkdir()
    (sub / "nested.pdf").write_bytes(b"%PDF-nested")

    results = scan_folder(str(tmp_path))
    paths = [r["path"] for r in results]
    assert len(results) == 3
    assert str(tmp_path / "doc1.pdf") in paths
    assert str(sub / "nested.pdf") in paths

def test_scan_folder_includes_hash(tmp_path):
    (tmp_path / "test.pdf").write_bytes(b"%PDF-content")
    results = scan_folder(str(tmp_path))
    assert results[0]["sha256"]
    assert len(results[0]["sha256"]) == 64  # SHA-256 hex

def test_compute_file_hash_deterministic(tmp_path):
    f = tmp_path / "a.pdf"
    f.write_bytes(b"hello world")
    h1 = compute_file_hash(str(f))
    h2 = compute_file_hash(str(f))
    assert h1 == h2

def test_scan_empty_folder(tmp_path):
    results = scan_folder(str(tmp_path))
    assert results == []

def test_scan_nonexistent_folder():
    results = scan_folder("/nonexistent/path")
    assert results == []
```

**Step 2: Run tests — expect FAIL**

**Step 3: Implement scanner.py**

```python
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
```

**Step 4: Run tests — expect PASS**

**Step 5: Commit**

```bash
git add agent/agent/scanner.py agent/tests/test_scanner.py
git commit -m "feat(agent): add recursive folder scanner with SHA-256 hashing"
```

---

## Task 4: Processor (Orchestrator)

**Files:**
- Create: `agent/agent/processor.py`
- Create: `agent/tests/test_processor.py`
- Copy: `api-service/remediation.py` -> `agent/remediation.py`
- Copy: `api-service/gemini_verify.py` -> `agent/gemini_verify.py`

**Step 1: Copy the shared engine files**

```bash
cp api-service/remediation.py agent/remediation.py
cp api-service/gemini_verify.py agent/gemini_verify.py
```

**Step 2: Write the failing test**

```python
# agent/tests/test_processor.py
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from agent.config import AgentConfig
from agent.db import Database
from agent.processor import Processor

@pytest.fixture
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
    # Create a minimal test PDF
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Test Heading", fontsize=24)
    page.insert_text((72, 120), "Body text paragraph.", fontsize=12)
    pdf_path = str(tmp_path / "test.pdf")
    doc.save(pdf_path)
    doc.close()

    processor = Processor(config=config, db=db)

    with patch("agent.processor.remediate_pdf_async") as mock_rem:
        mock_rem.return_value = {
            "before": {"score": {"score": 15}},
            "after": {"score": {"score": 94}},
            "blocks_tagged": 2,
            "tag_assignments": [],
            "output_path": str(tmp_path / "output" / "test_remediated.pdf"),
        }
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

    result = await processor.process_one(pdf_path)
    assert result["status"] == "failed"
    assert result["error"]
```

**Step 3: Run tests — expect FAIL**

**Step 4: Implement processor.py**

```python
# agent/agent/processor.py
from __future__ import annotations

import logging
import shutil
from pathlib import Path

import httpx

from agent.config import AgentConfig
from agent.db import Database

logger = logging.getLogger(__name__)

class Processor:
    def __init__(self, config: AgentConfig, db: Database):
        self.config = config
        self.db = db

    async def process_one(self, pdf_path: str) -> dict:
        """Process a single PDF. Returns {status, before_score, after_score, error}."""
        try:
            if self.config.mode == "cloud":
                return await self._process_cloud(pdf_path)
            else:
                return await self._process_local(pdf_path)
        except Exception as e:
            logger.exception("Failed to process %s", pdf_path)
            error_msg = str(e)
            await self.db.update_result(
                path=pdf_path, status="failed", error_message=error_msg,
            )
            return {"status": "failed", "error": error_msg}

    async def _process_local(self, pdf_path: str) -> dict:
        """Process locally (hybrid or local mode)."""
        from remediation import remediate_pdf_async

        output_path = self._output_path(pdf_path)
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        verify = self.config.mode == "hybrid"
        result = await remediate_pdf_async(
            pdf_path, output_path, verify=verify,
        )

        before_score = result["before"]["score"]["score"]
        after_score = result["after"]["score"]["score"]

        if self.config.output_mode == "overwrite":
            shutil.copy2(output_path, pdf_path)

        await self.db.update_result(
            path=pdf_path,
            status="completed",
            before_score=before_score,
            after_score=after_score,
        )

        return {
            "status": "completed",
            "before_score": before_score,
            "after_score": after_score,
        }

    async def _process_cloud(self, pdf_path: str) -> dict:
        """Send PDF to CASO cloud API for processing."""
        async with httpx.AsyncClient(timeout=300) as client:
            with open(pdf_path, "rb") as f:
                resp = await client.post(
                    f"{self.config.caso_api_url}/api/remediate?verify=false",
                    files={"file": (Path(pdf_path).name, f, "application/pdf")},
                    headers={"Authorization": f"Bearer {self.config.license_key}"},
                )

            if resp.status_code != 200:
                raise RuntimeError(f"Cloud API returned {resp.status_code}: {resp.text}")

            data = resp.json()
            before_score = data["before"]["score"]["score"]
            after_score = data["after"]["score"]["score"]

            # Download the remediated file
            download_url = data.get("download_url", "")
            if download_url:
                dl_resp = await client.get(
                    f"{self.config.caso_api_url}{download_url}",
                    headers={"Authorization": f"Bearer {self.config.license_key}"},
                )
                if dl_resp.status_code == 200:
                    output_path = self._output_path(pdf_path)
                    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
                    with open(output_path, "wb") as out:
                        out.write(dl_resp.content)

            await self.db.update_result(
                path=pdf_path,
                status="completed",
                before_score=before_score,
                after_score=after_score,
            )

            return {
                "status": "completed",
                "before_score": before_score,
                "after_score": after_score,
            }

    def _output_path(self, pdf_path: str) -> str:
        p = Path(pdf_path)
        if self.config.output_mode == "directory":
            return str(Path(self.config.output_dir) / p.name)
        elif self.config.output_mode == "overwrite":
            return str(p.parent / f"{p.stem}_tmp_remediated{p.suffix}")
        else:  # suffix
            return str(p.parent / f"{p.stem}_remediated{p.suffix}")
```

**Step 5: Run tests — expect PASS**

**Step 6: Commit**

```bash
git add agent/agent/processor.py agent/tests/test_processor.py agent/remediation.py agent/gemini_verify.py
git commit -m "feat(agent): add processor orchestrator with cloud/hybrid/local modes"
```

---

## Task 5: License Validation + Phone Home

**Files:**
- Create: `agent/agent/license.py`
- Create: `agent/tests/test_license.py`

**Step 1: Write the failing test**

```python
# agent/tests/test_license.py
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from agent.license import LicenseClient

@pytest.mark.asyncio
async def test_validate_license_success():
    client = LicenseClient(
        api_url="https://fake.com",
        license_key="valid-key",
    )
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
    assert result is True  # skip validation when disabled
```

**Step 2: Run tests — expect FAIL**

**Step 3: Implement license.py**

```python
# agent/agent/license.py
from __future__ import annotations

import logging
import platform

import httpx

logger = logging.getLogger(__name__)

class LicenseClient:
    def __init__(self, api_url: str, license_key: str, enabled: bool = True):
        self.api_url = api_url
        self.license_key = license_key
        self.enabled = enabled

    async def validate(self) -> bool:
        if not self.enabled:
            return True
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    f"{self.api_url}/api/license/validate",
                    json={"license_key": self.license_key, "hostname": platform.node()},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    logger.info("License valid for org: %s", data.get("org", "unknown"))
                    return data.get("valid", False)
                else:
                    logger.warning("License validation failed: %d", resp.status_code)
                    return False
        except Exception:
            logger.warning("Could not reach license server — running in offline mode")
            return True  # graceful degradation

    async def report_usage(self, pages_processed: int, pdfs_completed: int):
        if not self.enabled:
            return
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                await client.post(
                    f"{self.api_url}/api/license/usage",
                    json={
                        "license_key": self.license_key,
                        "hostname": platform.node(),
                        "pages_processed": pages_processed,
                        "pdfs_completed": pdfs_completed,
                    },
                )
        except Exception:
            logger.warning("Could not report usage — will retry next cycle")
```

**Step 4: Run tests — expect PASS**

**Step 5: Commit**

```bash
git add agent/agent/license.py agent/tests/test_license.py
git commit -m "feat(agent): add license validation and usage reporting client"
```

---

## Task 6: Local Dashboard API

**Files:**
- Create: `agent/agent/api.py`
- Create: `agent/tests/test_api.py`

**Step 1: Write the failing test**

```python
# agent/tests/test_api.py
import pytest
from httpx import AsyncClient, ASGITransport
from agent.api import create_app
from agent.config import AgentConfig
from agent.db import Database

@pytest.fixture
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
    assert "license_key" not in data  # should be redacted

@pytest.mark.asyncio
async def test_pdfs_list_empty(app_client):
    resp = await app_client.get("/api/pdfs")
    assert resp.status_code == 200
    assert resp.json() == []
```

**Step 2: Run tests — expect FAIL**

**Step 3: Implement api.py**

```python
# agent/agent/api.py
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from agent.config import AgentConfig
from agent.db import Database

def create_app(config: AgentConfig, db: Database) -> FastAPI:
    app = FastAPI(title="CASO Comply Agent", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    async def health():
        return {"status": "ok", "mode": config.mode}

    @app.get("/api/stats")
    async def stats():
        return await db.get_stats()

    @app.get("/api/config")
    async def get_config():
        return {
            "mode": config.mode,
            "scan_paths": config.scan_paths,
            "watch": config.watch,
            "cron": config.cron,
            "website_urls": config.website_urls,
            "output_dir": config.output_dir,
            "output_mode": config.output_mode,
            "max_workers": config.max_workers,
            "phone_home": config.phone_home,
        }

    @app.get("/api/pdfs")
    async def list_pdfs(limit: int = 100, offset: int = 0):
        return await db.get_all(limit=limit, offset=offset)

    @app.get("/api/pdfs/pending")
    async def pending_pdfs():
        return await db.get_pending()

    @app.post("/api/scan/trigger")
    async def trigger_scan():
        # This will be wired up in Task 7
        return {"message": "Scan triggered"}

    # Serve React SPA for all non-API routes
    web_dir = Path(__file__).parent / "web"
    if web_dir.exists():
        app.mount("/", StaticFiles(directory=str(web_dir), html=True), name="web")

    return app
```

**Step 4: Run tests — expect PASS**

**Step 5: Commit**

```bash
git add agent/agent/api.py agent/tests/test_api.py
git commit -m "feat(agent): add local dashboard FastAPI with stats/config/pdfs endpoints"
```

---

## Task 7: Main Entrypoint + Scheduler

**Files:**
- Create: `agent/agent/main.py`
- Create: `agent/entrypoint.sh`

**Step 1: Implement main.py (the glue)**

```python
# agent/agent/main.py
from __future__ import annotations

import asyncio
import logging
import sys
from pathlib import Path

import uvicorn
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from agent.config import load_config
from agent.db import Database
from agent.scanner import scan_folder
from agent.processor import Processor
from agent.license import LicenseClient
from agent.api import create_app

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("caso-agent")

async def run_scan_cycle(config, db: Database, processor: Processor):
    """One full scan + process cycle."""
    logger.info("Starting scan cycle")

    for scan_path in config.scan_paths:
        from agent.scanner import scan_folder
        found = scan_folder(scan_path)
        for item in found:
            if await db.needs_processing(item["path"], item["sha256"]):
                await db.upsert_pdf(
                    path=item["path"],
                    sha256=item["sha256"],
                    source="folder",
                )

    # Process pending
    pending = await db.get_pending()
    logger.info("Processing %d pending PDFs", len(pending))
    for pdf in pending:
        await processor.process_one(pdf["path"])

    # Report usage
    stats = await db.get_stats()
    logger.info(
        "Cycle complete: %d total, %d completed, %d failed",
        stats["total"], stats["completed"], stats["failed"],
    )

async def main():
    config_path = sys.argv[1] if len(sys.argv) > 1 else "/app/config.yaml"
    config = load_config(config_path)

    logger.info("CASO Comply Agent starting (mode=%s)", config.mode)

    # Init DB
    db = Database()
    await db.init()

    # Validate license
    license_client = LicenseClient(
        api_url=config.caso_api_url,
        license_key=config.license_key,
        enabled=config.phone_home,
    )
    if not await license_client.validate():
        logger.error("License validation failed. Exiting.")
        sys.exit(1)

    # Create processor
    processor = Processor(config=config, db=db)

    # Create API app
    app = create_app(config, db)

    # Schedule scans
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        run_scan_cycle,
        "cron",
        **_parse_cron(config.cron),
        args=[config, db, processor],
        id="scan_cycle",
        max_instances=1,
    )
    scheduler.start()

    # Run initial scan
    await run_scan_cycle(config, db, processor)

    # Start the web server
    server_config = uvicorn.Config(
        app, host="0.0.0.0", port=config.local_port, log_level="info",
    )
    server = uvicorn.Server(server_config)
    await server.serve()

def _parse_cron(cron_str: str) -> dict:
    """Parse a 5-field cron string into APScheduler kwargs."""
    parts = cron_str.strip().split()
    if len(parts) != 5:
        return {"minute": "0"}  # default: top of every hour
    return {
        "minute": parts[0],
        "hour": parts[1],
        "day": parts[2],
        "month": parts[3],
        "day_of_week": parts[4],
    }

if __name__ == "__main__":
    asyncio.run(main())
```

**Step 2: Create entrypoint.sh**

```bash
#!/bin/bash
set -e

# Secure config file permissions
if [ -f /app/config.yaml ]; then
    chmod 600 /app/config.yaml
fi

# Create data directories
mkdir -p /data/remediated

echo "Starting CASO Comply Agent..."
exec python -m agent.main "$@"
```

**Step 3: Commit**

```bash
chmod +x agent/entrypoint.sh
git add agent/agent/main.py agent/entrypoint.sh
git commit -m "feat(agent): add main entrypoint with cron scheduler and scan loop"
```

---

## Task 8: Dockerfile + docker-compose

**Files:**
- Create: `agent/Dockerfile`
- Create: `agent/docker-compose.yml`

**Step 1: Create Dockerfile**

```dockerfile
# CASO Comply Agent
FROM python:3.12-slim

# System dependencies for pikepdf
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    libqpdf-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY agent/ agent/
COPY remediation.py gemini_verify.py ./
COPY entrypoint.sh .
COPY config.example.yaml /app/config.example.yaml

RUN chmod +x /app/entrypoint.sh

# Create data volume mount point
RUN mkdir -p /data

EXPOSE 9090

ENTRYPOINT ["/app/entrypoint.sh"]
```

**Step 2: Create docker-compose.yml**

```yaml
# CASO Comply Agent -- Quick Start
# Usage:
#   1. Copy config.example.yaml to config.yaml and edit
#   2. Run: docker compose up -d
#   3. Open http://localhost:9090

services:
  caso-agent:
    build: .
    container_name: caso-comply-agent
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./config.yaml:/app/config.yaml:ro
      - agent-data:/data
      # Mount your PDF directories here:
      # - /path/to/your/documents:/mnt/documents:ro
    environment:
      - CASO_MODE=${CASO_MODE:-hybrid}
      - CASO_LICENSE_KEY=${CASO_LICENSE_KEY:-}
      - GEMINI_API_KEY=${GEMINI_API_KEY:-}

volumes:
  agent-data:
```

**Step 3: Commit**

```bash
git add agent/Dockerfile agent/docker-compose.yml
git commit -m "feat(agent): add Dockerfile and docker-compose for easy deployment"
```

---

## Task 9: Integration Test (End-to-End)

**Files:**
- Create: `agent/tests/test_integration.py`

**Step 1: Write integration test**

```python
# agent/tests/test_integration.py
"""
End-to-end integration test: scan folder -> detect PDF -> process locally -> verify in DB.
"""
import pytest
import fitz  # PyMuPDF
from pathlib import Path
from agent.config import AgentConfig
from agent.db import Database
from agent.scanner import scan_folder
from agent.processor import Processor

def _create_test_pdf(path: str):
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Budget Report 2026", fontsize=24)
    page.insert_text((72, 120), "This is the executive summary of the annual budget.", fontsize=12)
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
```

**Step 2: Run integration test**

Run: `cd agent && python -m pytest tests/test_integration.py -v`
Expected: PASS (uses real remediation engine, no mocks)

**Step 3: Commit**

```bash
git add agent/tests/test_integration.py
git commit -m "test(agent): add end-to-end integration test for local pipeline"
```

---

## Task Summary

| # | Task | Description | Est. |
|---|------|-------------|------|
| 1 | Config | YAML + env var loading with validation | 15 min |
| 2 | Database | SQLite state tracking with hash dedup | 15 min |
| 3 | Scanner | Recursive folder scanner | 10 min |
| 4 | Processor | Orchestrator with cloud/hybrid/local modes | 20 min |
| 5 | License | License validation + usage reporting | 10 min |
| 6 | Dashboard API | FastAPI endpoints for local UI | 15 min |
| 7 | Main + Scheduler | Entrypoint, cron, scan loop | 15 min |
| 8 | Docker | Dockerfile + docker-compose | 10 min |
| 9 | Integration Test | End-to-end pipeline test | 15 min |

**Not in MVP (future tasks):**
- Website crawler (reuse ClawBot/Crawl4AI)
- File watcher (watchdog for real-time detection)
- React local dashboard SPA
- License endpoints on CASO cloud API
- Cloud dashboard organization views
- SharePoint / Laserfiche connectors
