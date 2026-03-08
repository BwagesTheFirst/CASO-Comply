import os
import pytest
from agent.config import load_config, AgentConfig


def test_load_config_from_yaml(tmp_path):
    cfg_file = tmp_path / "config.yaml"
    cfg_file.write_text("""
mode: local
license_key: "test-key-123"
scan_paths:
  - /tmp/docs
watch: false
cron: "*/30 * * * *"
website_urls:
  - https://example.gov
output_dir: /tmp/out
output_mode: suffix
max_workers: 2
gemini_api_key: ""
phone_home: false
caso_api_url: https://caso-comply-api.onrender.com
local_port: 9090
""")
    config = load_config(str(cfg_file))
    assert config.mode == "local"
    assert config.license_key == "test-key-123"
    assert config.scan_paths == ["/tmp/docs"]
    assert config.watch is False
    assert config.max_workers == 2
    assert config.phone_home is False


def test_env_vars_override_yaml(tmp_path):
    cfg_file = tmp_path / "config.yaml"
    cfg_file.write_text("mode: cloud\nlicense_key: yaml-key\n")
    os.environ["CASO_MODE"] = "local"
    os.environ["CASO_LICENSE_KEY"] = "env-key"
    try:
        config = load_config(str(cfg_file))
        assert config.mode == "local"
        assert config.license_key == "env-key"
    finally:
        del os.environ["CASO_MODE"]
        del os.environ["CASO_LICENSE_KEY"]


def test_invalid_mode_raises():
    with pytest.raises(ValueError, match="mode"):
        AgentConfig(mode="invalid", license_key="x", scan_paths=[])


def test_defaults_applied(tmp_path):
    cfg_file = tmp_path / "config.yaml"
    cfg_file.write_text("license_key: key123\n")
    config = load_config(str(cfg_file))
    assert config.mode == "hybrid"
    assert config.watch is True
    assert config.max_workers == 1
    assert config.local_port == 9090
