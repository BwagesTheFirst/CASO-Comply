# CASO Comply Agent — Design Document

**Date:** 2026-03-08
**Authors:** Brance, Claude

## Problem

Government agencies, hospitals, and universities have thousands of PDFs spread across file servers, SharePoint, Laserfiche, and public websites. Asking them to manually upload each PDF through a web UI is a non-starter. They need software that runs inside their environment, integrates with their existing systems, and processes PDFs automatically.

## Solution

A Docker-based agent that customers install on their own infrastructure. One image, three operating modes (`cloud`, `hybrid`, `local`) configurable via environment variable. The mode maps to pricing tiers and security requirements.

## Architecture: Hybrid Agent

Single Docker container with all components. Customer picks their security/processing mode.

```
Customer's Network                         CASO Cloud
+---------------------------------+       +----------------+
|  Docker Agent                   |       |  CASO API      |
|  - Folder watcher / crawler     |       |  Dashboard     |
|  - Full remediation engine      |       |  Billing       |
|  - Gemini verifier              |       +----------------+
|  - Local web UI (:9090)         |
|  - SQLite state DB              |  MODE=cloud  -> sends PDFs to API
|                                 |  MODE=hybrid -> local fix, images to Gemini
|  CONFIG: MODE=cloud|hybrid|     |  MODE=local  -> everything on-prem
|          local                  |
+---------------------------------+
```

## Pricing Tier Mapping

| Tier         | Mode   | What Leaves Network          | Target Customer                    |
|--------------|--------|------------------------------|------------------------------------|
| Standard     | cloud  | Full PDFs                    | Small orgs, public website PDFs    |
| Professional | hybrid | Page images only (for Gemini)| Mid-size, doc-sensitive orgs       |
| Enterprise   | local  | Metadata only (or nothing)   | Hospitals, large gov, regulated    |

## Components Inside the Container

### 1. Scanner
- Watches local folders (configurable paths) recursively
- Crawls website URLs for PDFs
- Runs on cron schedule or triggered manually from local UI
- Future integrations: SharePoint (Microsoft Graph API), Laserfiche API, S3/Azure Blob/GCS

### 2. Remediation Engine
- Existing pipeline: PyMuPDF + pikepdf + font-size classification (`remediation.py`)
- Runs locally in `hybrid` and `local` modes
- Sends to CASO cloud API in `cloud` mode

### 3. Gemini Verifier
- Existing `gemini_verify.py` — Gemini 2.5 Flash multimodal verification
- `hybrid` mode: only page images leave the network (no text, no metadata, no PII)
- `local` mode: disabled unless customer provides their own Gemini API key

### 4. Local Web UI
FastAPI serving a React SPA on `localhost:9090`. No external CDN dependencies — works fully offline.

**Pages:**
1. **Dashboard** — total PDFs found, remediated, failed, average score improvement, next scan
2. **Scan Queue** — pending, processing, completed PDFs with status filters
3. **Results** — per-PDF detail with before/after scores, tag assignments, issues
4. **Settings** — edit scan paths, cron schedule, mode, website URLs
5. **Logs** — real-time scrolling log output

### 5. State DB (SQLite)
- Mounted as Docker volume for persistence
- Tracks every PDF: path, SHA-256 hash, scan date, before/after scores, status
- Hash-based deduplication — skip unchanged files on re-scan

### 6. Phone Home
- License key (UUID) as Bearer token over HTTPS
- Sends to CASO cloud API: usage counts, filenames, scores (for billing and dashboard)
- Customer can disable with `phone_home: false` (billing becomes manual)
- Air-gapped mode: stores locally, syncs when connectivity resumes

## Data Flow

```
PDF Discovered (folder watch or crawl)
    |
    v
Hash check --> Already processed? --> Skip
    |
    v (new or changed)
Analyze (before score)
    |
    v
+--- MODE? ---+
|             |              |
cloud       hybrid          local
|             |              |
v             v              v
Upload to   Remediate      Remediate
CASO API    locally        locally
|             |              |
v             v              v
Get back    Send images    Skip Gemini
fixed PDF   to Gemini      (or use own key)
|             |              |
v             v              v
+-------------+--------------+
    |
    v
Save remediated PDF
(same folder or output_dir)
    |
    v
Analyze (after score)
    |
    v
Store results in SQLite
    |
    v
Sync to CASO cloud dashboard
```

**Output options:** Overwrite original (with backup), save to output directory, or save alongside with `_remediated` suffix.

**Failure handling:** Log, mark as `failed` in SQLite, surface in local UI. Don't block queue.

**Concurrency:** Sequential by default, configurable `max_workers`.

## Configuration

Via `config.yaml` or environment variables:

```yaml
mode: hybrid              # cloud | hybrid | local
license_key: "abc-123"
scan_paths:
  - /mnt/shared/documents
  - /mnt/sharepoint/public
watch: true               # real-time file watching
cron: "0 * * * *"         # hourly full scan
website_urls:
  - https://springfield.gov
output_dir: /mnt/shared/remediated
output_mode: suffix       # suffix | overwrite | directory
max_workers: 1
gemini_api_key: ""        # optional, for local mode
phone_home: true
caso_api_url: https://caso-comply-api.onrender.com
```

## Security Model

### Data leaving the network by mode

| Data               | Cloud | Hybrid | Local |
|--------------------|-------|--------|-------|
| Full PDF files     | Yes   | No     | No    |
| Page images        | Yes   | Yes    | No    |
| PDF text/content   | Yes   | No     | No    |
| Filenames + scores | Yes   | Yes    | Yes*  |
| Usage counts       | Yes   | Yes    | Yes*  |

*Local mode with `phone_home: false` sends nothing.

### Authentication
- License key (UUID) issued at signup, scoped to organization
- Multiple agents per key (one per office location)
- HTTPS + Bearer token for all cloud communication

### At-rest security
- SQLite stores results, not PDF content
- Agent reads PDFs, processes, writes output — no caching of copies
- Config file permissions set to `chmod 600` by Docker entrypoint

### Audit trail
- Every scan/remediation logged with timestamp, file hash, before/after scores
- Logs exportable as CSV/JSON from local UI
- Compliance report: "All PDFs remediated, when, and their scores"

## Cloud Dashboard (Future — Not MVP)

Customer-facing:
- All agents under their license key with status/heartbeat
- Aggregate stats and compliance score trending
- Searchable remediation history
- Billing and usage
- Downloadable compliance reports

CASO admin:
- All organizations, usage, billing
- Active/stale agents
- Revenue per customer

The agent ships first with the local UI. Cloud dashboard built after paying customers validate the concept. Agent phones home from day one to collect data.

## MVP Scope (What We Build First)

1. Docker container with remediation engine + scanner + local UI
2. Local folder scanning (recursive) + website crawling
3. Three processing modes via `MODE` env var
4. SQLite state tracking with hash-based dedup
5. Local web dashboard on `:9090`
6. Phone-home for license validation and usage reporting

## Future Integrations (Post-MVP)

- SharePoint connector (Microsoft Graph API)
- Laserfiche connector (Laserfiche API)
- S3 / Azure Blob / GCS connectors
- Cloud dashboard for customers
- SOC 2 certification for cloud tier
- Auto-update mechanism (watchtower or similar)
