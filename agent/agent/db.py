# agent/agent/db.py
from __future__ import annotations

import os

import aiosqlite

SCHEMA = """
CREATE TABLE IF NOT EXISTS documents (
    path TEXT PRIMARY KEY,
    sha256 TEXT NOT NULL,
    format TEXT DEFAULT 'pdf',
    page_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    before_score INTEGER,
    after_score INTEGER,
    source TEXT DEFAULT 'folder',
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

MIGRATION_V2 = """
-- Migrate from pdfs table to documents table if needed
CREATE TABLE IF NOT EXISTS documents (
    path TEXT PRIMARY KEY,
    sha256 TEXT NOT NULL,
    format TEXT DEFAULT 'pdf',
    page_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    before_score INTEGER,
    after_score INTEGER,
    source TEXT DEFAULT 'folder',
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    error_message TEXT
);

INSERT OR IGNORE INTO documents (path, sha256, format, page_count, status, before_score, after_score, source, discovered_at, processed_at, error_message)
SELECT path, sha256, 'pdf', page_count, status, before_score, after_score, source, discovered_at, processed_at, error_message
FROM pdfs;

DROP TABLE IF EXISTS pdfs;
"""

class Database:
    def __init__(self, db_path: str = "/data/caso-agent.db"):
        self._path = db_path
        self._db: aiosqlite.Connection | None = None

    async def init(self):
        self._db = await aiosqlite.connect(self._path)
        os.chmod(str(self._path), 0o600)
        self._db.row_factory = aiosqlite.Row
        # Check if old 'pdfs' table exists and migrate
        cursor = await self._db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='pdfs'"
        )
        old_table = await cursor.fetchone()
        if old_table:
            await self._db.executescript(MIGRATION_V2)
            await self._db.commit()
        else:
            await self._db.executescript(SCHEMA)
            await self._db.commit()

    async def close(self):
        if self._db:
            await self._db.close()

    async def upsert_document(self, path: str, sha256: str, page_count: int = 0, source: str = "folder", format: str = "pdf"):
        await self._db.execute(
            """INSERT INTO documents (path, sha256, format, page_count, source)
               VALUES (?, ?, ?, ?, ?)
               ON CONFLICT(path) DO UPDATE SET
                 sha256=excluded.sha256,
                 format=excluded.format,
                 page_count=excluded.page_count,
                 status=CASE WHEN documents.sha256 != excluded.sha256 THEN 'pending' ELSE documents.status END
            """,
            (path, sha256, format, page_count, source),
        )
        await self._db.commit()

    async def needs_processing(self, path: str, current_hash: str) -> bool:
        cursor = await self._db.execute(
            "SELECT sha256, status FROM documents WHERE path = ?", (path,)
        )
        row = await cursor.fetchone()
        if row is None:
            return True
        return row["sha256"] != current_hash

    async def get_document(self, path: str) -> dict | None:
        cursor = await self._db.execute("SELECT * FROM documents WHERE path = ?", (path,))
        row = await cursor.fetchone()
        return dict(row) if row else None

    async def update_result(self, path: str, status: str, before_score: int = 0, after_score: int = 0, page_count: int = 0, error_message: str = ""):
        await self._db.execute(
            """UPDATE documents SET status=?, before_score=?, after_score=?,
               page_count=?, processed_at=CURRENT_TIMESTAMP, error_message=?
               WHERE path=?""",
            (status, before_score, after_score, page_count, error_message, path),
        )
        await self._db.commit()

    async def get_pending(self, limit: int = 100) -> list[dict]:
        cursor = await self._db.execute(
            "SELECT * FROM documents WHERE status = 'pending' ORDER BY discovered_at LIMIT ?",
            (limit,),
        )
        return [dict(row) for row in await cursor.fetchall()]

    async def get_all(self, limit: int = 500, offset: int = 0) -> list[dict]:
        cursor = await self._db.execute(
            "SELECT * FROM documents ORDER BY discovered_at DESC LIMIT ? OFFSET ?",
            (limit, offset),
        )
        return [dict(row) for row in await cursor.fetchall()]

    async def add_audit_log(self, action: str, details: str = "", ip_address: str = ""):
        await self._db.execute(
            "INSERT INTO audit_log (action, details, ip_address) VALUES (?, ?, ?)",
            (action, details, ip_address),
        )
        await self._db.commit()

    async def get_audit_log(self, limit: int = 50) -> list[dict]:
        cursor = await self._db.execute(
            "SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?",
            (limit,),
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
            FROM documents
        """)
        row = await cursor.fetchone()
        return dict(row)
