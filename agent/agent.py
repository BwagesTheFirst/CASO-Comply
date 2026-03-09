"""
CASO Comply Docker Agent
========================
A lightweight, self-contained agent that crawls client websites for documents,
sends them to the CASO API for accessibility analysis/remediation, and serves
a local dashboard at http://localhost:9090.
"""

import asyncio
import csv
import io
import json
import logging
import os
import re
import sqlite3
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin, urlparse

import httpx
import uvicorn
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from bs4 import BeautifulSoup
from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CASO_API_KEY = os.environ.get("CASO_API_KEY", "")
CASO_API_URL = os.environ.get("CASO_API_URL", "https://caso-comply-api.onrender.com")
TARGET_DOMAINS = [
    d.strip()
    for d in os.environ.get("TARGET_DOMAINS", "example.gov").split(",")
    if d.strip()
]
SCAN_SCHEDULE = os.environ.get("SCAN_SCHEDULE", "0 2 * * *")
DASHBOARD_PORT = int(os.environ.get("DASHBOARD_PORT", "9090"))
MAX_PAGES_PER_DOMAIN = int(os.environ.get("MAX_PAGES_PER_DOMAIN", "50"))
MAX_DOCUMENTS_PER_SCAN = int(os.environ.get("MAX_DOCUMENTS_PER_SCAN", "100"))

DB_PATH = Path("/app/data/caso_agent.db")
USER_AGENT = "CASO-Comply-Scanner/1.0 (+https://caso-comply.vercel.app)"
DOCUMENT_EXTENSIONS = re.compile(r"\.(pdf|docx?|xlsx?)(\?.*)?$", re.IGNORECASE)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("caso-agent")

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

def get_db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT UNIQUE NOT NULL,
            domain TEXT NOT NULL,
            filename TEXT NOT NULL,
            format TEXT NOT NULL,
            discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER REFERENCES documents(id),
            score INTEGER,
            grade TEXT,
            issues TEXT,
            page_count INTEGER,
            was_converted BOOLEAN DEFAULT FALSE,
            original_format TEXT,
            analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS scan_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            domain TEXT,
            documents_found INTEGER,
            documents_analyzed INTEGER,
            pages_used INTEGER,
            pages_remaining INTEGER,
            started_at TIMESTAMP,
            completed_at TIMESTAMP,
            status TEXT DEFAULT 'running'
        );
    """)
    conn.commit()
    conn.close()


# ---------------------------------------------------------------------------
# Agent State
# ---------------------------------------------------------------------------

class AgentState:
    def __init__(self):
        self.is_scanning = False
        self.last_scan_time: Optional[str] = None
        self.next_scan_time: Optional[str] = None
        self.pages_used: int = 0
        self.pages_remaining: Optional[int] = None
        self.current_domain: Optional[str] = None
        self.scan_progress: str = "idle"

state = AgentState()

# ---------------------------------------------------------------------------
# Crawler
# ---------------------------------------------------------------------------

async def crawl_domain(domain: str, client: httpx.AsyncClient) -> list[str]:
    """Crawl a domain 1-2 levels deep and return document URLs."""
    base_url = f"https://{domain}"
    visited: set[str] = set()
    document_urls: set[str] = set()
    to_visit: list[tuple[str, int]] = [(base_url, 0)]

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }

    while to_visit and len(visited) < MAX_PAGES_PER_DOMAIN:
        url, depth = to_visit.pop(0)

        if url in visited:
            continue
        visited.add(url)

        try:
            resp = await client.get(url, headers=headers, follow_redirects=True, timeout=30.0)
            if resp.status_code != 200:
                continue
            content_type = resp.headers.get("content-type", "")
            if "text/html" not in content_type:
                continue
        except Exception as e:
            log.warning(f"Failed to fetch {url}: {e}")
            continue

        soup = BeautifulSoup(resp.text, "html.parser")

        for tag in soup.find_all("a", href=True):
            href = tag["href"].strip()
            if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
                continue

            absolute = urljoin(url, href)
            parsed = urlparse(absolute)

            # Remove fragment
            clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
            if parsed.query:
                clean_url += f"?{parsed.query}"

            # Check if it's a document link
            if DOCUMENT_EXTENSIONS.search(parsed.path):
                document_urls.add(clean_url)
                continue

            # Only follow internal links up to depth 2
            if depth < 2 and parsed.netloc and domain in parsed.netloc:
                if clean_url not in visited:
                    to_visit.append((clean_url, depth + 1))

    log.info(f"Crawled {domain}: visited {len(visited)} pages, found {len(document_urls)} documents")
    return list(document_urls)


# ---------------------------------------------------------------------------
# Analyzer
# ---------------------------------------------------------------------------

async def analyze_document(
    url: str,
    doc_id: int,
    client: httpx.AsyncClient,
) -> Optional[dict]:
    """Download a document and send it to the CASO API for analysis."""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,"
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,"
                  "application/msword,application/vnd.ms-excel,*/*;q=0.8",
    }

    # Download the document
    try:
        resp = await client.get(url, headers=headers, follow_redirects=True, timeout=60.0)
        if resp.status_code != 200:
            log.warning(f"Failed to download {url}: HTTP {resp.status_code}")
            return None
    except Exception as e:
        log.warning(f"Failed to download {url}: {e}")
        return None

    content = resp.content
    if len(content) < 100:
        log.warning(f"Document too small, skipping: {url}")
        return None

    # Determine filename and content type
    parsed = urlparse(url)
    filename = Path(parsed.path).name or "document.pdf"
    content_type_map = {
        ".pdf": "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc": "application/msword",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls": "application/vnd.ms-excel",
    }
    ext = Path(filename).suffix.lower()
    mime = content_type_map.get(ext, "application/octet-stream")

    # Send to CASO API
    try:
        api_resp = await client.post(
            f"{CASO_API_URL}/api/analyze",
            headers={"Authorization": f"Bearer {CASO_API_KEY}"},
            files={"file": (filename, content, mime)},
            timeout=120.0,
        )
    except Exception as e:
        log.warning(f"API request failed for {filename}: {e}")
        return None

    # Track usage from response headers
    pages_used_header = api_resp.headers.get("X-CASO-Pages-Used")
    pages_remaining_header = api_resp.headers.get("X-CASO-Pages-Remaining")
    if pages_used_header:
        state.pages_used = int(pages_used_header)
    if pages_remaining_header:
        state.pages_remaining = int(pages_remaining_header)

    if api_resp.status_code != 200:
        log.warning(f"API returned {api_resp.status_code} for {filename}: {api_resp.text[:200]}")
        return None

    try:
        result = api_resp.json()
    except Exception:
        log.warning(f"Invalid JSON response for {filename}")
        return None

    # Store result
    conn = get_db()
    issues_json = json.dumps(result.get("issues", []))
    conn.execute(
        """INSERT INTO results (document_id, score, grade, issues, page_count, was_converted, original_format)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (
            doc_id,
            result.get("score"),
            result.get("grade"),
            issues_json,
            result.get("page_count"),
            result.get("was_converted", False),
            result.get("original_format", ext.lstrip(".")),
        ),
    )
    conn.commit()
    conn.close()

    return {
        "pages_used": int(pages_used_header) if pages_used_header else None,
        "pages_remaining": int(pages_remaining_header) if pages_remaining_header else None,
    }


# ---------------------------------------------------------------------------
# Scan Orchestrator
# ---------------------------------------------------------------------------

async def run_scan():
    """Run a full scan across all target domains."""
    if state.is_scanning:
        log.warning("Scan already in progress, skipping")
        return

    if not CASO_API_KEY:
        log.error("CASO_API_KEY is not set. Skipping scan.")
        return

    state.is_scanning = True
    state.scan_progress = "starting"
    total_docs_found = 0
    total_docs_analyzed = 0

    log.info(f"Starting scan of {len(TARGET_DOMAINS)} domain(s): {', '.join(TARGET_DOMAINS)}")

    async with httpx.AsyncClient() as client:
        for domain in TARGET_DOMAINS:
            state.current_domain = domain
            state.scan_progress = f"crawling {domain}"

            conn = get_db()
            scan_id = conn.execute(
                "INSERT INTO scan_log (domain, started_at, status) VALUES (?, ?, 'running')",
                (domain, datetime.now(timezone.utc).isoformat()),
            ).lastrowid
            conn.commit()

            # Crawl
            doc_urls = await crawl_domain(domain, client)
            total_docs_found += len(doc_urls)

            # Store discovered documents
            new_docs = []
            for url in doc_urls:
                parsed = urlparse(url)
                filename = Path(parsed.path).name or "unknown"
                ext = Path(filename).suffix.lstrip(".").lower()
                fmt = ext if ext in ("pdf", "doc", "docx", "xls", "xlsx") else "pdf"
                try:
                    cursor = conn.execute(
                        "INSERT OR IGNORE INTO documents (url, domain, filename, format) VALUES (?, ?, ?, ?)",
                        (url, domain, filename, fmt),
                    )
                    if cursor.rowcount > 0:
                        new_docs.append((conn.execute("SELECT last_insert_rowid()").fetchone()[0], url))
                    else:
                        # Get existing doc id if it hasn't been analyzed yet
                        row = conn.execute(
                            """SELECT d.id FROM documents d
                               LEFT JOIN results r ON r.document_id = d.id
                               WHERE d.url = ? AND r.id IS NULL""",
                            (url,),
                        ).fetchone()
                        if row:
                            new_docs.append((row[0], url))
                except Exception:
                    pass
            conn.commit()

            # Analyze (up to limit)
            state.scan_progress = f"analyzing {domain}"
            docs_analyzed = 0
            pages_used_this_scan = 0

            for doc_id, url in new_docs:
                if total_docs_analyzed >= MAX_DOCUMENTS_PER_SCAN:
                    log.info("Reached MAX_DOCUMENTS_PER_SCAN limit")
                    break
                if state.pages_remaining is not None and state.pages_remaining <= 0:
                    log.warning("No pages remaining in quota. Stopping analysis.")
                    break

                state.scan_progress = f"analyzing {Path(urlparse(url).path).name}"
                result = await analyze_document(url, doc_id, client)
                if result:
                    docs_analyzed += 1
                    total_docs_analyzed += 1
                    if result.get("pages_used"):
                        pages_used_this_scan = result["pages_used"]

            # Update scan log
            conn.execute(
                """UPDATE scan_log SET
                   documents_found = ?, documents_analyzed = ?,
                   pages_used = ?, pages_remaining = ?,
                   completed_at = ?, status = 'completed'
                   WHERE id = ?""",
                (
                    len(doc_urls), docs_analyzed,
                    pages_used_this_scan, state.pages_remaining,
                    datetime.now(timezone.utc).isoformat(), scan_id,
                ),
            )
            conn.commit()
            conn.close()

    state.is_scanning = False
    state.current_domain = None
    state.last_scan_time = datetime.now(timezone.utc).isoformat()
    state.scan_progress = "idle"

    log.info(
        f"Scan complete. Found {total_docs_found} documents, "
        f"analyzed {total_docs_analyzed}."
    )


# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------

app = FastAPI(title="CASO Comply Agent", docs_url=None, redoc_url=None)
scheduler = AsyncIOScheduler()


@app.on_event("startup")
async def startup():
    init_db()
    log.info("CASO Comply Agent starting")
    log.info(f"  API URL: {CASO_API_URL}")
    log.info(f"  Domains: {', '.join(TARGET_DOMAINS)}")
    log.info(f"  Schedule: {SCAN_SCHEDULE}")
    log.info(f"  API Key: {'configured' if CASO_API_KEY else 'NOT SET'}")

    # Parse cron expression
    parts = SCAN_SCHEDULE.split()
    if len(parts) == 5:
        trigger = CronTrigger(
            minute=parts[0],
            hour=parts[1],
            day=parts[2],
            month=parts[3],
            day_of_week=parts[4],
        )
        scheduler.add_job(run_scan, trigger, id="scheduled_scan", replace_existing=True)
        scheduler.start()

        # Compute next run time for display
        next_run = scheduler.get_job("scheduled_scan")
        if next_run and next_run.next_run_time:
            state.next_scan_time = next_run.next_run_time.isoformat()

    # Run initial scan
    asyncio.create_task(run_scan())


@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown(wait=False)


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/status")
async def api_status():
    conn = get_db()
    total_docs = conn.execute("SELECT COUNT(*) FROM documents").fetchone()[0]
    total_analyzed = conn.execute("SELECT COUNT(*) FROM results").fetchone()[0]
    avg_score = conn.execute("SELECT AVG(score) FROM results WHERE score IS NOT NULL").fetchone()[0]
    last_scan = conn.execute(
        "SELECT * FROM scan_log ORDER BY id DESC LIMIT 1"
    ).fetchone()
    conn.close()

    # Update next scan time
    job = scheduler.get_job("scheduled_scan")
    if job and job.next_run_time:
        state.next_scan_time = job.next_run_time.isoformat()

    return {
        "status": "scanning" if state.is_scanning else "idle",
        "progress": state.scan_progress,
        "current_domain": state.current_domain,
        "last_scan_time": state.last_scan_time,
        "next_scan_time": state.next_scan_time,
        "domains": TARGET_DOMAINS,
        "pages_used": state.pages_used,
        "pages_remaining": state.pages_remaining,
        "total_documents": total_docs,
        "total_analyzed": total_analyzed,
        "average_score": round(avg_score, 1) if avg_score else None,
        "last_scan": dict(last_scan) if last_scan else None,
    }


@app.get("/api/results")
async def api_results():
    conn = get_db()
    rows = conn.execute("""
        SELECT d.url, d.domain, d.filename, d.format, d.discovered_at,
               r.score, r.grade, r.issues, r.page_count, r.was_converted,
               r.original_format, r.analyzed_at
        FROM documents d
        LEFT JOIN results r ON r.document_id = d.id
        ORDER BY r.analyzed_at DESC NULLS LAST, d.discovered_at DESC
    """).fetchall()
    conn.close()

    results = []
    for row in rows:
        r = dict(row)
        if r.get("issues"):
            try:
                r["issues"] = json.loads(r["issues"])
            except Exception:
                pass
        results.append(r)

    return results


@app.post("/api/scan")
async def api_scan(background_tasks: BackgroundTasks):
    if state.is_scanning:
        return JSONResponse(
            {"status": "error", "message": "Scan already in progress"},
            status_code=409,
        )
    background_tasks.add_task(run_scan)
    return {"status": "ok", "message": "Scan started"}


@app.get("/api/export")
async def api_export():
    conn = get_db()
    rows = conn.execute("""
        SELECT d.url, d.domain, d.filename, d.format,
               r.score, r.grade, r.issues, r.page_count,
               r.was_converted, r.original_format, r.analyzed_at
        FROM documents d
        JOIN results r ON r.document_id = d.id
        ORDER BY r.analyzed_at DESC
    """).fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "URL", "Domain", "Filename", "Format", "Score", "Grade",
        "Issues Count", "Page Count", "Was Converted", "Original Format",
        "Analyzed At",
    ])
    for row in rows:
        r = dict(row)
        issues_count = 0
        if r.get("issues"):
            try:
                issues_count = len(json.loads(r["issues"]))
            except Exception:
                pass
        writer.writerow([
            r["url"], r["domain"], r["filename"], r["format"],
            r["score"], r["grade"], issues_count, r["page_count"],
            r["was_converted"], r["original_format"], r["analyzed_at"],
        ])

    output.seek(0)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=caso_results_{timestamp}.csv"},
    )


# ---------------------------------------------------------------------------
# Dashboard HTML
# ---------------------------------------------------------------------------

DASHBOARD_HTML = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CASO Comply Agent</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0B1426; color: #F1F5F9; min-height: 100vh;
  }
  .header {
    background: #111D35; border-bottom: 1px solid #1E3A5F;
    padding: 16px 24px; display: flex; align-items: center;
    justify-content: space-between;
  }
  .header h1 { font-size: 20px; font-weight: 600; }
  .header h1 span { color: #3B82F6; }
  .header-actions { display: flex; gap: 10px; }
  .btn {
    background: #3B82F6; color: #fff; border: none; padding: 8px 16px;
    border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;
    transition: background 0.2s;
  }
  .btn:hover { background: #2563EB; }
  .btn:disabled { background: #334155; cursor: not-allowed; color: #94A3B8; }
  .btn-outline {
    background: transparent; border: 1px solid #3B82F6; color: #3B82F6;
  }
  .btn-outline:hover { background: rgba(59, 130, 246, 0.1); }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .card {
    background: #111D35; border: 1px solid #1E3A5F; border-radius: 10px;
    padding: 20px;
  }
  .card-label { font-size: 12px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .card-value { font-size: 24px; font-weight: 700; }
  .card-sub { font-size: 12px; color: #94A3B8; margin-top: 4px; }
  .status-dot {
    display: inline-block; width: 8px; height: 8px; border-radius: 50%;
    margin-right: 6px; vertical-align: middle;
  }
  .status-idle { background: #22C55E; }
  .status-scanning { background: #F59E0B; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .grade-A { color: #22C55E; } .grade-B { color: #84CC16; }
  .grade-C { color: #F59E0B; } .grade-D { color: #F97316; }
  .grade-F { color: #EF4444; }
  .domains {
    background: #111D35; border: 1px solid #1E3A5F; border-radius: 10px;
    padding: 20px; margin-bottom: 24px;
  }
  .domains h2 { font-size: 14px; color: #94A3B8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .domain-tag {
    display: inline-block; background: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3); color: #93C5FD;
    padding: 4px 12px; border-radius: 20px; font-size: 13px; margin: 4px 4px 4px 0;
  }
  .table-container {
    background: #111D35; border: 1px solid #1E3A5F; border-radius: 10px;
    overflow: hidden;
  }
  .table-header {
    padding: 16px 20px; border-bottom: 1px solid #1E3A5F;
    display: flex; justify-content: space-between; align-items: center;
  }
  .table-header h2 { font-size: 16px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left; padding: 10px 16px; font-size: 11px;
    color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em;
    border-bottom: 1px solid #1E3A5F; background: #0F1729;
  }
  td {
    padding: 12px 16px; font-size: 13px; border-bottom: 1px solid rgba(30, 58, 95, 0.3);
    max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  tr:hover td { background: rgba(59, 130, 246, 0.05); }
  .score-badge {
    display: inline-block; padding: 2px 10px; border-radius: 12px;
    font-weight: 600; font-size: 12px;
  }
  .score-high { background: rgba(34,197,94,0.15); color: #22C55E; }
  .score-mid { background: rgba(245,158,11,0.15); color: #F59E0B; }
  .score-low { background: rgba(239,68,68,0.15); color: #EF4444; }
  .empty-state {
    padding: 60px 20px; text-align: center; color: #94A3B8;
  }
  .empty-state p { margin-top: 8px; font-size: 14px; }
  .footer {
    text-align: center; padding: 24px; color: #475569; font-size: 12px;
  }
  .footer a { color: #3B82F6; text-decoration: none; }
  .footer a:hover { text-decoration: underline; }
</style>
</head>
<body>

<div class="header">
  <h1><span>CASO</span> Comply Agent</h1>
  <div class="header-actions">
    <button class="btn btn-outline" onclick="exportCSV()">Export CSV</button>
    <button class="btn" id="scanBtn" onclick="triggerScan()">Run Scan Now</button>
  </div>
</div>

<div class="container">
  <!-- Status Cards -->
  <div class="grid">
    <div class="card">
      <div class="card-label">Agent Status</div>
      <div class="card-value" id="statusValue">
        <span class="status-dot status-idle" id="statusDot"></span>
        <span id="statusText">Loading...</span>
      </div>
      <div class="card-sub" id="statusSub"></div>
    </div>
    <div class="card">
      <div class="card-label">Pages Used</div>
      <div class="card-value" id="pagesUsed">--</div>
      <div class="card-sub" id="pagesRemaining"></div>
    </div>
    <div class="card">
      <div class="card-label">Documents Found</div>
      <div class="card-value" id="totalDocs">--</div>
      <div class="card-sub" id="totalAnalyzed"></div>
    </div>
    <div class="card">
      <div class="card-label">Average Score</div>
      <div class="card-value" id="avgScore">--</div>
      <div class="card-sub">across all analyzed documents</div>
    </div>
  </div>

  <!-- Domains -->
  <div class="domains">
    <h2>Monitored Domains</h2>
    <div id="domainTags">Loading...</div>
  </div>

  <!-- Results Table -->
  <div class="table-container">
    <div class="table-header">
      <h2>Recent Results</h2>
      <span style="color: #94A3B8; font-size: 13px;" id="resultCount"></span>
    </div>
    <div id="tableBody">
      <div class="empty-state">
        <p>Loading results...</p>
      </div>
    </div>
  </div>
</div>

<div class="footer">
  CASO Comply Agent &middot; Powered by <a href="https://caso-comply.vercel.app">caso-comply.vercel.app</a>
</div>

<script>
function escapeHtml(text) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.textContent;
}

function formatDate(iso) {
  if (!iso) return '--';
  var d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function scoreClass(s) {
  if (s == null) return '';
  if (s >= 80) return 'score-high';
  if (s >= 50) return 'score-mid';
  return 'score-low';
}

function gradeClass(g) {
  if (!g) return '';
  return 'grade-' + g.charAt(0).toUpperCase();
}

async function loadStatus() {
  try {
    var resp = await fetch('/api/status');
    var data = await resp.json();

    var dot = document.getElementById('statusDot');
    var text = document.getElementById('statusText');
    var sub = document.getElementById('statusSub');

    if (data.status === 'scanning') {
      dot.className = 'status-dot status-scanning';
      text.textContent = 'Scanning';
      sub.textContent = data.progress || '';
      document.getElementById('scanBtn').disabled = true;
    } else {
      dot.className = 'status-dot status-idle';
      text.textContent = 'Idle';
      sub.textContent = data.last_scan_time
        ? 'Last scan: ' + formatDate(data.last_scan_time)
        : 'No scans yet';
      document.getElementById('scanBtn').disabled = false;
    }

    document.getElementById('pagesUsed').textContent = data.pages_used || '0';
    document.getElementById('pagesRemaining').textContent =
      data.pages_remaining != null ? data.pages_remaining + ' remaining' : 'Usage data pending';

    document.getElementById('totalDocs').textContent = data.total_documents || '0';
    document.getElementById('totalAnalyzed').textContent =
      (data.total_analyzed || '0') + ' analyzed';

    document.getElementById('avgScore').textContent =
      data.average_score != null ? data.average_score : '--';

    // Build domain tags safely
    var tagsEl = document.getElementById('domainTags');
    tagsEl.textContent = '';
    data.domains.forEach(function(d) {
      var span = document.createElement('span');
      span.className = 'domain-tag';
      span.textContent = d;
      tagsEl.appendChild(span);
    });

    if (data.next_scan_time) {
      sub.textContent = sub.textContent + ' | Next: ' + formatDate(data.next_scan_time);
    }
  } catch(e) {
    console.error('Failed to load status:', e);
  }
}

async function loadResults() {
  try {
    var resp = await fetch('/api/results');
    var data = await resp.json();

    document.getElementById('resultCount').textContent = data.length + ' documents';

    var container = document.getElementById('tableBody');

    if (data.length === 0) {
      container.textContent = '';
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      var p = document.createElement('p');
      p.textContent = 'No documents analyzed yet. Run a scan to get started.';
      empty.appendChild(p);
      container.appendChild(empty);
      return;
    }

    // Build table using DOM methods
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    ['Filename', 'Domain', 'Score', 'Grade', 'Issues', 'Pages', 'Analyzed'].forEach(function(h) {
      var th = document.createElement('th');
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    var items = data.slice(0, 100);
    items.forEach(function(r) {
      var tr = document.createElement('tr');

      var tdFile = document.createElement('td');
      tdFile.textContent = r.filename || '--';
      tdFile.title = r.url || '';
      tr.appendChild(tdFile);

      var tdDomain = document.createElement('td');
      tdDomain.textContent = r.domain || '--';
      tr.appendChild(tdDomain);

      var tdScore = document.createElement('td');
      var badge = document.createElement('span');
      badge.className = 'score-badge ' + scoreClass(r.score);
      badge.textContent = r.score != null ? r.score : '--';
      tdScore.appendChild(badge);
      tr.appendChild(tdScore);

      var tdGrade = document.createElement('td');
      tdGrade.className = gradeClass(r.grade);
      tdGrade.style.fontWeight = '700';
      tdGrade.textContent = r.grade || '--';
      tr.appendChild(tdGrade);

      var tdIssues = document.createElement('td');
      tdIssues.textContent = Array.isArray(r.issues) ? r.issues.length : '0';
      tr.appendChild(tdIssues);

      var tdPages = document.createElement('td');
      tdPages.textContent = r.page_count || '--';
      tr.appendChild(tdPages);

      var tdDate = document.createElement('td');
      tdDate.textContent = formatDate(r.analyzed_at);
      tr.appendChild(tdDate);

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.textContent = '';
    container.appendChild(table);
  } catch(e) {
    console.error('Failed to load results:', e);
  }
}

async function triggerScan() {
  var btn = document.getElementById('scanBtn');
  btn.disabled = true;
  btn.textContent = 'Starting...';
  try {
    var resp = await fetch('/api/scan', { method: 'POST' });
    if (resp.status === 409) {
      btn.textContent = 'Already Running';
    } else {
      btn.textContent = 'Scan Started';
    }
  } catch(e) {
    btn.textContent = 'Error';
  }
  setTimeout(function() {
    btn.textContent = 'Run Scan Now';
    refresh();
  }, 2000);
}

function exportCSV() {
  window.location.href = '/api/export';
}

function refresh() {
  loadStatus();
  loadResults();
}

// Initial load
refresh();
// Auto-refresh every 10 seconds
setInterval(refresh, 10000);
</script>
</body>
</html>"""


@app.get("/", response_class=HTMLResponse)
async def dashboard():
    return DASHBOARD_HTML


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    uvicorn.run(
        "agent:app",
        host="0.0.0.0",
        port=DASHBOARD_PORT,
        log_level="info",
    )
