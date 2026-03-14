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
        self._data: dict = {}

    @property
    def features(self) -> dict:
        """Return the plan features dict from the last validation response."""
        return self._data.get("features", {})

    @property
    def plan_name(self) -> str:
        """Return the plan name from the last validation response."""
        return self._data.get("plan", "unknown")

    @property
    def review_score_threshold(self) -> int:
        return self._data.get("review_score_threshold", 70)

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
                    self._data = data
                    logger.info(
                        "License valid for org: %s (plan: %s, features: %s)",
                        data.get("org", "unknown"),
                        data.get("plan", "unknown"),
                        data.get("features", {}),
                    )
                    return data.get("valid", False)
                elif resp.status_code in (401, 403):
                    logger.error(
                        "License explicitly rejected by server (HTTP %d) — "
                        "key is invalid, revoked, or account is inactive",
                        resp.status_code,
                    )
                    return False
                else:
                    logger.warning(
                        "License validation returned unexpected status %d — "
                        "treating as network issue, allowing grace period",
                        resp.status_code,
                    )
                    return True
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
