# CASO Comply Docker Agent

A self-contained Docker agent that runs on your infrastructure. It watches local folders for PDFs, remediates them for accessibility compliance (WCAG 2.1 AA, PDF/UA, Section 508), and serves a local dashboard with results.

## Quick Start

### 1. Get your license key

Sign in at [https://casocomply.com/dashboard/api-keys](https://casocomply.com/dashboard/api-keys) and generate an API key. Copy the full key — it is only shown once.

### 2. Create a project folder

```bash
mkdir caso-agent && cd caso-agent
```

### 3. Create `docker-compose.yml`

```yaml
version: "3.8"
services:
  caso-agent:
    image: caso/comply-agent:latest
    environment:
      # REQUIRED: Your license key from https://casocomply.com/dashboard/api-keys
      - CASO_LICENSE_KEY=caso_ak_your_key_here

      # REQUIRED: Set a strong password for the web dashboard
      - CASO_ADMIN_PASSWORD=your-secure-password

      # Processing mode: local | hybrid | cloud
      #   local  — Everything on-premise. Nothing leaves your network.
      #   hybrid — Local remediation + AI verification via Gemini (recommended).
      #   cloud  — Upload to CASO cloud for processing.
      - CASO_MODE=hybrid

      # Scan schedule (cron format). Default: every hour.
      - CASO_CRON=0 * * * *
    ports:
      - "9090:9090"
    volumes:
      # Mount your document folders here
      - ./documents:/data/documents
      # Where remediated (fixed) PDFs are saved
      - ./remediated:/data/output
      # Persistent data (scan history, settings)
      - caso-data:/app/data
    restart: unless-stopped

volumes:
  caso-data:
```

### 4. Create input/output folders and start

```bash
mkdir -p documents remediated
docker compose up -d
```

### 5. Open the dashboard

Go to [http://localhost:9090](http://localhost:9090) and log in with the admin password you set above.

### 6. Add documents

Drop PDF files into the `./documents` folder. The agent scans automatically on the schedule you configured (default: every hour), or click **Run Scan Now** in the dashboard.

## Processing Modes

| Mode | What happens | Data leaves network? | Best for |
|------|-------------|---------------------|----------|
| `local` | Full on-premise remediation | No | HIPAA, air-gapped environments |
| `hybrid` | Local remediation + Gemini AI verification | Page images only (no text/PDFs) | Recommended for most orgs |
| `cloud` | Upload to CASO cloud API | Yes | Fast setup, non-sensitive docs |

## Configuration

All settings can be configured via environment variables in `docker-compose.yml` or via a `config.yaml` file mounted at `/app/config.yaml`.

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `CASO_LICENSE_KEY` | **Yes** | — | Your license key from the CASO dashboard |
| `CASO_ADMIN_PASSWORD` | **Yes** | — | Password for the web dashboard |
| `CASO_MODE` | No | `hybrid` | Processing mode: `local`, `hybrid`, or `cloud` |
| `CASO_CRON` | No | `0 * * * *` | Cron schedule for automatic scans |
| `CASO_SCAN_PATHS` | No | `/data/documents` | Comma-separated folder paths to scan |
| `CASO_OUTPUT_DIR` | No | `/data/remediated` | Where remediated files are saved |
| `CASO_OUTPUT_MODE` | No | `suffix` | Output naming: `suffix`, `overwrite`, or `directory` |
| `CASO_MAX_WORKERS` | No | `1` | Number of PDFs to process simultaneously |
| `CASO_PHONE_HOME` | No | `true` | Send usage telemetry (required for license validation) |
| `CASO_HIPAA_MODE` | No | `false` | Enable HIPAA compliance mode (see below) |

### HIPAA Mode

For healthcare and sensitive document environments:

```yaml
environment:
  - CASO_HIPAA_MODE=true
  - CASO_MODE=local
  - CASO_PHONE_HOME=false
  - CASO_PURGE_ORIGINALS_HOURS=24
  - CASO_PURGE_REMEDIATED_HOURS=168
  - CASO_PURGE_DB_PATHS_DAYS=90
```

When HIPAA mode is enabled:
- No filenames, PDFs, or usage data are sent to CASO cloud
- Filenames are hashed in all log messages
- API endpoints require authentication
- CORS is restricted to localhost only

### Hybrid Mode with Gemini AI

For AI-powered quality verification in hybrid mode, you need a Gemini API key:

```yaml
environment:
  - CASO_MODE=hybrid
  - CASO_GEMINI_API_KEY=your-gemini-api-key
```

Get a free Gemini API key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey).

For Google Cloud environments, you can use Vertex AI instead:

```yaml
environment:
  - CASO_GEMINI_PROVIDER=vertex
  - CASO_GCP_PROJECT=your-gcp-project-id
  - CASO_GCP_LOCATION=us-central1
  - GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-credentials.json
volumes:
  - ./gcp-credentials.json:/app/gcp-credentials.json:ro
```

## Dashboard

The agent serves a local web dashboard at the configured port (default: 9090).

**Features:**
- Real-time agent status (running/idle, last scan, next scan)
- Document processing results with scores and grades
- One-click "Run Scan Now" button
- Usage tracking
- CSV export of all results

**API Endpoints:**

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Dashboard (HTML) |
| `/health` | GET | Health check |
| `/api/status` | GET | Agent status (JSON) |
| `/api/results` | GET | All scan results (JSON) |
| `/api/scan` | POST | Trigger an immediate scan |
| `/api/export` | GET | Download results as CSV |

## Troubleshooting

### Check agent health

```bash
curl http://localhost:9090/health
```

### View logs

```bash
docker compose logs -f caso-agent
```

### Common issues

**"License validation failed. Exiting."**
- Verify your `CASO_LICENSE_KEY` is correct and active
- Check that the agent can reach the internet (for license validation)
- Generate a new key at [https://casocomply.com/dashboard/api-keys](https://casocomply.com/dashboard/api-keys)

**Documents not being processed**
- Ensure your input directory is mounted correctly and contains PDF files
- Check that `CASO_SCAN_PATHS` matches your volume mount path
- Try triggering a manual scan: `curl -X POST http://localhost:9090/api/scan`

**Permission errors on output directory**
- Ensure the host directories have write permissions: `chmod 755 ./remediated`

**Port already in use**
- Change the port mapping in `docker-compose.yml`: `"8080:9090"`

## Data Persistence

Scan results are stored in a SQLite database inside the `caso-data` volume. Data persists across container restarts. To reset all data:

```bash
docker compose down -v
```

## Stopping

```bash
docker compose down
```

## Support

- Dashboard: [https://casocomply.com/dashboard](https://casocomply.com/dashboard)
- Documentation: [https://casocomply.com/dashboard/agent](https://casocomply.com/dashboard/agent)
- Email: support@casocomply.com
