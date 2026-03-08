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
