# CASO Comply Docker Agent
# On-premise PDF accessibility remediation with folder watching,
# cron scheduling, and a local dashboard on port 9090.

# Pin to specific digest for supply chain security
FROM python:3.12.8-slim@sha256:2199a62885a12290dc9c5be3ca0681d367576ab7bf037da120e564723292a2f0

# System deps for PDF processing and health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    libmupdf-dev \
    && rm -rf /var/lib/apt/lists/*

# SECURITY NOTE: LibreOffice is used for office document conversion from trusted local sources only.
# For environments processing untrusted documents, disable office conversion by building with --build-arg INSTALL_LIBREOFFICE=false
ARG INSTALL_LIBREOFFICE=true
RUN if [ "$INSTALL_LIBREOFFICE" = "true" ]; then \
      apt-get update && apt-get install -y --no-install-recommends \
      libreoffice-writer-nogui libreoffice-calc-nogui libreoffice-impress-nogui \
      && rm -rf /var/lib/apt/lists/*; \
    fi

# Create non-root user
RUN groupadd -r caso && useradd -r -g caso -m -s /bin/bash caso

WORKDIR /app

# Install Python dependencies
COPY --chown=caso:caso requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY --chown=caso:caso agent/ ./agent/
COPY --chown=caso:caso remediation.py .
COPY --chown=caso:caso remediation_docx.py .
COPY --chown=caso:caso remediation_xlsx.py .
COPY --chown=caso:caso remediation_pptx.py .
COPY --chown=caso:caso gemini_verify.py .
COPY --chown=caso:caso compliance_certificate.py .
COPY --chown=caso:caso entrypoint.sh .
COPY --chown=caso:caso config.example.yaml ./config.example.yaml
# Keep legacy crawler available
COPY --chown=caso:caso agent.py ./agent_crawler.py

# Create data directories
RUN mkdir -p /app/data /data/input /data/remediated /data/output && \
    chown -R caso:caso /data

RUN chmod +x /app/entrypoint.sh

USER caso

EXPOSE 9090

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=10s \
  CMD curl -f http://localhost:9090/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
