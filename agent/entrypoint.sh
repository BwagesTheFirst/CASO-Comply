#!/bin/bash
set -e

# Secure config file permissions
if [ -f /app/config.yaml ]; then
    chmod 600 /app/config.yaml
fi

# Create data directories
mkdir -p /data/documents /data/output /data/remediated

echo "Starting CASO Comply Agent..."
exec python -m agent.main "$@"
