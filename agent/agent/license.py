"""License validation and usage reporting client."""
from __future__ import annotations

import logging
import platform

import httpx

logger = logging.getLogger(__name__)

class LicenseClient:
    def __init__(self, api_url: str, license_key: str, enabled: bool = True):
        self.api_url = api_url
        self.license_key = license_key
        self.enabled = enabled

    async def validate(self) -> bool:
        if not self.enabled:
            return True
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    f"{self.api_url}/api/license/validate",
                    json={"license_key": self.license_key, "hostname": platform.node()},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    logger.info("License valid for org: %s", data.get("org", "unknown"))
                    return data.get("valid", False)
                else:
                    logger.warning("License validation failed: %d", resp.status_code)
                    return False
        except Exception:
            logger.warning("Could not reach license server — running in offline mode")
            return True

    async def report_usage(self, pages_processed: int, pdfs_completed: int):
        if not self.enabled:
            return
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                await client.post(
                    f"{self.api_url}/api/license/usage",
                    json={
                        "license_key": self.license_key,
                        "hostname": platform.node(),
                        "pages_processed": pages_processed,
                        "pdfs_completed": pdfs_completed,
                    },
                )
        except Exception:
            logger.warning("Could not report usage — will retry next cycle")
