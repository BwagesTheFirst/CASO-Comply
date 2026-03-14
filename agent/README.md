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
    image: bwages/caso-comply-agent:latest
    environment:
      # REQUIRED: Your license key from https://casocomply.com/dashboard/api-keys
      - CASO_LICENSE_KEY=caso_ak_PASTE_YOUR_KEY_HERE

      # REQUIRED: Set a strong password for the web dashboard
      - CASO_ADMIN_PASSWORD=CHANGE_ME_TO_A_SECURE_PASSWORD

      # Processing mode: local | hybrid | cloud
      #   local  — Everything on-premise. Nothing leaves your network.
      #   hybrid — Local remediation + AI verification powered by CASO cloud (recommended).
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
      - ./remediated:/data/remediated
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
| `local` | Full on-premise remediation | License check only (no document data) | HIPAA, air-gapped, Zero Trust environments |
| `hybrid` | Local remediation + CASO AI verification | Page images only (no full PDFs or text) | Recommended — balances quality + privacy |
| `cloud` | Upload to CASO cloud for processing | Yes (full documents) | Fast setup, non-sensitive documents |

## Network Requirements

The agent's network needs depend on the processing mode:

| Mode | Outbound connections required | Data sent externally |
|------|------------------------------|---------------------|
| `local` | `caso-comply-api.onrender.com` (license validation + usage telemetry only) | No documents or content. Only license check and page count telemetry. |
| `hybrid` | `caso-comply-api.onrender.com` (license + AI verification) | Page images sent to CASO cloud for AI quality verification. No full PDFs or extracted text. |
| `cloud` | `caso-comply-api.onrender.com` (full processing) | Full PDF documents uploaded for cloud processing. |

### Firewall Whitelist

If your network requires explicit egress rules, allow outbound HTTPS (port 443) to:

- `caso-comply-api.onrender.com` — CASO API (required for all modes except fully air-gapped)

### Air-Gapped / Zero Trust Environments

For networks with no outbound internet access, use local mode with telemetry disabled:

```yaml
environment:
  - CASO_MODE=local
  - CASO_PHONE_HOME=false
```

In this configuration:
- No network connections are made
- License validation is skipped (offline grace period)
- All processing happens entirely on-premise
- No usage data, metadata, or documents leave your network

**Note:** Air-gapped mode requires periodic online license validation (at least once every 30 days) or a pre-validated offline license. Contact sales@casocomply.com for offline licensing.

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
| `CASO_PHONE_HOME` | No | `true` | Send usage telemetry to CASO cloud. Reports page counts and processing status only — never document content. Set to `false` for air-gapped networks (requires offline license). |
| `CASO_HIPAA_MODE` | No | `false` | Enable HIPAA compliance mode (see below) |

### HIPAA & Compliance Mode

For healthcare, government, and environments handling sensitive documents (PII, PHI, FERPA data):

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
- **No data leaves your network** — all processing is 100% on-premise
- **No telemetry** — phone-home is automatically disabled
- **Filenames are hashed** in all log output (no PII in logs)
- **API endpoints require authentication** — no unauthenticated access
- **CORS restricted** to localhost only
- **Automatic data purge** — original and remediated files are deleted on schedule
- **Database paths scrubbed** — file path references removed after configured retention period

### Compliance Certifications

| Standard | Status | Notes |
|----------|--------|-------|
| HIPAA | Supported | Local mode + HIPAA config = no PHI exposure |
| Section 508 | Full compliance | Output PDFs meet Section 508 requirements |
| WCAG 2.1 AA | Full compliance | Remediated documents meet WCAG 2.1 AA |
| PDF/UA (ISO 14289) | Full compliance | Tagged structure meets PDF/UA standard |
| FERPA | Supported | Local mode keeps student records on-premise |
| FedRAMP | In progress | Contact sales@casocomply.com for status |

### Privacy Impact Assessment (PIA) Summary

For agencies requiring a PIA, key facts:
- In local/HIPAA mode, **zero document data** is transmitted externally
- Only license validation occurs over the network (can be disabled)
- No cloud storage of customer documents in local mode
- All processing uses open-source tools (veraPDF, pikepdf) running locally
- Audit trail maintained in local SQLite database

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

