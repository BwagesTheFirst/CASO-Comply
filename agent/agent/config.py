from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml

VALID_MODES = ("cloud", "hybrid", "local")
VALID_OUTPUT_MODES = ("suffix", "overwrite", "directory")


@dataclass
class AgentConfig:
    mode: str = "hybrid"
    license_key: str = ""
    scan_paths: list[str] = field(default_factory=list)
    watch: bool = True
    cron: str = "0 * * * *"
    website_urls: list[str] = field(default_factory=list)
    output_dir: str = "/data/remediated"
    output_mode: str = "suffix"
    max_workers: int = 1
    gemini_api_key: str = ""
    phone_home: bool = True
    caso_api_url: str = "https://caso-comply-api.onrender.com"
    local_port: int = 9090
    admin_password: str = "caso-admin"

    def __post_init__(self):
        if self.mode not in VALID_MODES:
            raise ValueError(f"mode must be one of {VALID_MODES}, got '{self.mode}'")
        if self.output_mode not in VALID_OUTPUT_MODES:
            raise ValueError(f"output_mode must be one of {VALID_OUTPUT_MODES}")


def load_config(config_path: str = "/app/config.yaml") -> AgentConfig:
    """Load config from YAML file, then override with CASO_* env vars."""
    data: dict = {}
    path = Path(config_path)
    if path.exists():
        with open(path) as f:
            data = yaml.safe_load(f) or {}

    env_map = {
        "CASO_MODE": "mode",
        "CASO_LICENSE_KEY": "license_key",
        "CASO_SCAN_PATHS": "scan_paths",
        "CASO_WATCH": "watch",
        "CASO_CRON": "cron",
        "CASO_OUTPUT_DIR": "output_dir",
        "CASO_OUTPUT_MODE": "output_mode",
        "CASO_MAX_WORKERS": "max_workers",
        "CASO_GEMINI_API_KEY": "gemini_api_key",
        "CASO_PHONE_HOME": "phone_home",
        "CASO_API_URL": "caso_api_url",
        "CASO_LOCAL_PORT": "local_port",
        "CASO_ADMIN_PASSWORD": "admin_password",
    }

    for env_key, cfg_key in env_map.items():
        val = os.environ.get(env_key)
        if val is not None:
            if cfg_key == "scan_paths":
                data[cfg_key] = [p.strip() for p in val.split(",")]
            elif cfg_key in ("watch", "phone_home"):
                data[cfg_key] = val.lower() in ("true", "1", "yes")
            elif cfg_key in ("max_workers", "local_port"):
                data[cfg_key] = int(val)
            else:
                data[cfg_key] = val

    return AgentConfig(**data)
