# CASO Comply Docker Agent
# Lightweight client-side agent that crawls websites for documents,
# sends them to the CASO API for analysis, and serves a local dashboard.

FROM python:3.12-slim

# Minimal system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r caso && useradd -r -g caso -m -s /bin/bash caso

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY agent.py .

# Create data directory for SQLite
RUN mkdir -p /app/data && chown -R caso:caso /app /app/data

USER caso

EXPOSE 9090

CMD ["python", "agent.py"]
