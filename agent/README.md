# CASO Comply Docker Agent

A lightweight, self-contained Docker agent that runs on your infrastructure. It crawls your websites for documents (PDF, Word, Excel), sends them to the CASO Comply API for accessibility analysis, and serves a local dashboard with results.

## Quick Start

### 1. Get your API key

Sign in at [https://caso-comply.vercel.app/dashboard/api-keys](https://caso-comply.vercel.app/dashboard/api-keys) and generate an API key.

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env` with your API key and target domains:

```
CASO_API_KEY=caso_ak_your_key_here
TARGET_DOMAINS=cityofaustin.gov,austintexas.gov
SCAN_SCHEDULE=0 2 * * *
```

### 3. Run

```bash
docker-compose up -d
```

### 4. View Dashboard

Open [http://localhost:9090](http://localhost:9090) in your browser.

## Configuration

| Variable | Required | Default | Description |
|---|---|---|---|
| `CASO_API_KEY` | Yes | — | Your API key from the CASO Comply dashboard |
| `TARGET_DOMAINS` | No | `example.gov` | Comma-separated list of domains to crawl |
| `SCAN_SCHEDULE` | No | `0 2 * * *` | Cron expression for scan schedule (default: 2 AM daily) |
| `DASHBOARD_PORT` | No | `9090` | Port for the local dashboard |
| `MAX_PAGES_PER_DOMAIN` | No | `50` | Maximum pages to crawl per domain |
| `MAX_DOCUMENTS_PER_SCAN` | No | `100` | Maximum documents to analyze per scan |
| `CASO_API_URL` | No | `https://caso-comply-api.onrender.com` | API endpoint (for self-hosted API) |

## Dashboard Features

- Real-time agent status (running/idle, last scan, next scan)
- Usage tracking (pages used / pages remaining)
- Domain monitoring overview
- Document analysis results with scores and grades
- One-click "Run Scan Now" button
- CSV export of all results

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Dashboard HTML |
| `/api/status` | GET | Agent status as JSON |
| `/api/results` | GET | All scan results as JSON |
| `/api/scan` | POST | Trigger an immediate scan |
| `/api/export` | GET | Download results as CSV |

## Data Persistence

Scan results are stored in a SQLite database at `/app/data/caso_agent.db`. The `docker-compose.yml` mounts a named volume (`caso-data`) so data persists across container restarts.

## Stopping

```bash
docker-compose down
```

To remove all data:

```bash
docker-compose down -v
```
