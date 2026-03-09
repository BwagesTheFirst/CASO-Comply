# CASO Comply Docker Agent
# On-premise PDF accessibility remediation with folder watching,
# cron scheduling, and a local dashboard on port 9090.

FROM python:3.12-slim

# System deps for PDF and Office processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libmupdf-dev \
    libreoffice-writer-nogui \
    libreoffice-calc-nogui \
    libreoffice-impress-nogui \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r caso && useradd -r -g caso -m -s /bin/bash caso

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY agent/ ./agent/
COPY remediation.py .
COPY gemini_verify.py .
COPY entrypoint.sh .
COPY config.example.yaml ./config.yaml
# Keep legacy crawler available
COPY agent.py ./agent_crawler.py

# Create data directories
RUN mkdir -p /app/data /data/input /data/remediated /data/output && \
    chown -R caso:caso /app /data

RUN chmod +x /app/entrypoint.sh

USER caso

EXPOSE 9090

ENTRYPOINT ["/app/entrypoint.sh"]
