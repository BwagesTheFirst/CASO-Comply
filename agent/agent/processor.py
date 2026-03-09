# agent/agent/processor.py
from __future__ import annotations

import logging
import platform
import shutil
from pathlib import Path

import httpx

from agent.config import AgentConfig
from agent.db import Database
from agent.license import LicenseClient

logger = logging.getLogger(__name__)


class Processor:
    def __init__(self, config: AgentConfig, db: Database, license_client: LicenseClient | None = None):
        self.config = config
        self.db = db
        self.license_client = license_client

    async def _report_usage(
        self, filename: str, page_count: int, remediation_type: str | None = None,
    ) -> None:
        """Report usage to the CASO cloud API (fire-and-forget).

        Always attempts to report — page counting is billing, not telemetry.
        Failures are logged as warnings and never block processing.
        """
        if not self.config.license_key:
            logger.debug("No license key configured — skipping usage report")
            return
        try:
            payload: dict = {
                "pages_processed": page_count,
                "pdfs_completed": 1,
                "hostname": platform.node(),
                "filename": filename,
            }
            if remediation_type is not None:
                payload["remediation_type"] = remediation_type
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    f"{self.config.caso_api_url}/api/license/usage",
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {self.config.license_key}",
                    },
                )
                if resp.status_code == 200:
                    data = resp.json()
                    logger.info(
                        "Usage reported for %s (%d pages). Pages remaining: %s",
                        filename, page_count, data.get("pages_remaining", "unknown"),
                    )
                else:
                    logger.warning(
                        "Usage report returned %d: %s", resp.status_code, resp.text,
                    )
        except Exception:
            logger.warning("Failed to report usage for %s — will continue", filename)

    async def _submit_for_review(
        self, pdf_path: str, output_path: str, ai_score: int, page_count: int,
    ) -> bool:
        """Upload a low-scoring file to CASO for human review. Returns True on success."""
        if not self.config.license_key:
            logger.debug("No license key — skipping review submission")
            return False
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                with open(output_path, "rb") as f:
                    resp = await client.post(
                        f"{self.config.caso_api_url}/api/review/submit",
                        files={"file": (Path(pdf_path).name, f, "application/pdf")},
                        params={
                            "filename": Path(pdf_path).name,
                            "original_path": pdf_path,
                            "output_path": output_path,
                            "ai_score": ai_score,
                            "page_count": page_count,
                        },
                        headers={"Authorization": f"Bearer {self.config.license_key}"},
                    )
                if resp.status_code == 200:
                    data = resp.json()
                    logger.info(
                        "Submitted %s for human review (score %d) → review_id=%s",
                        Path(pdf_path).name, ai_score, data.get("review_id"),
                    )
                    return True
                else:
                    logger.warning(
                        "Review submission failed for %s: %d %s",
                        Path(pdf_path).name, resp.status_code, resp.text,
                    )
                    return False
        except Exception:
            logger.warning("Failed to submit %s for review — will retry next cycle", Path(pdf_path).name)
            return False

    async def process_one(self, pdf_path: str) -> dict:
        """Process a single PDF. Returns {status, before_score, after_score, error}."""
        try:
            if self.config.mode == "cloud":
                return await self._process_cloud(pdf_path)
            else:
                return await self._process_local(pdf_path)
        except Exception as e:
            logger.exception("Failed to process %s", pdf_path)
            error_msg = str(e)
            await self.db.update_result(
                path=pdf_path, status="failed", error_message=error_msg,
            )
            return {"status": "failed", "error": error_msg}

    async def _process_local(self, pdf_path: str) -> dict:
        """Process locally (hybrid or local mode)."""
        from remediation import remediate_pdf_async

        output_path = self._output_path(pdf_path)
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        # Determine AI verification based on plan tier
        plan_name = self.license_client.plan_name if self.license_client else "Standard"
        verify = plan_name in ("AI Verified", "Human Review")

        if not verify:
            logger.info("Plan '%s' — standard remediation (no AI)", plan_name)

        result = await remediate_pdf_async(
            pdf_path, output_path, verify=verify,
        )

        before_score = result["before"]["score"]["score"]
        after_score = result["after"]["score"]["score"]
        page_count = result["before"]["structure"].get("page_count", 0)

        # Determine remediation type based on plan and score
        remediation_type = "ai_verified" if verify else "standard"
        needs_review = False

        # Get threshold from license (default 70)
        threshold = self.license_client.review_score_threshold if self.license_client else 70

        # Human Review plan: submit files scoring below threshold for human review
        if plan_name == "Human Review" and after_score < threshold:
            remediation_type = "human_review"
            needs_review = True
            logger.warning(
                "PDF %s flagged for human review: after_score=%d (below %d, plan: %s)",
                Path(pdf_path).name, after_score, threshold, plan_name,
            )
        elif after_score < threshold:
            logger.warning(
                "PDF %s has low score after remediation: after_score=%d (plan: %s)",
                Path(pdf_path).name, after_score, plan_name,
            )

        if self.config.output_mode == "overwrite":
            shutil.copy2(output_path, pdf_path)

        await self.db.update_result(
            path=pdf_path,
            status="completed",
            before_score=before_score,
            after_score=after_score,
            page_count=page_count,
        )

        await self._report_usage(Path(pdf_path).name, page_count, remediation_type)

        # Submit for human review if flagged
        if needs_review:
            submitted = await self._submit_for_review(
                pdf_path, output_path, after_score, page_count,
            )
            if submitted:
                await self.db.update_result(
                    path=pdf_path, status="review_pending",
                )

        return {
            "status": "completed",
            "before_score": before_score,
            "after_score": after_score,
            "remediation_type": remediation_type,
            "needs_review": needs_review,
        }

    async def _process_cloud(self, pdf_path: str) -> dict:
        """Send PDF to CASO cloud API for processing."""
        async with httpx.AsyncClient(timeout=300) as client:
            with open(pdf_path, "rb") as f:
                resp = await client.post(
                    f"{self.config.caso_api_url}/api/remediate?verify=false",
                    files={"file": (Path(pdf_path).name, f, "application/pdf")},
                    headers={"Authorization": f"Bearer {self.config.license_key}"},
                )

            if resp.status_code != 200:
                raise RuntimeError(f"Cloud API returned {resp.status_code}: {resp.text}")

            data = resp.json()
            before_score = data["before"]["score"]["score"]
            after_score = data["after"]["score"]["score"]

            download_url = data.get("download_url", "")
            if download_url:
                dl_resp = await client.get(
                    f"{self.config.caso_api_url}{download_url}",
                    headers={"Authorization": f"Bearer {self.config.license_key}"},
                )
                if dl_resp.status_code == 200:
                    output_path = self._output_path(pdf_path)
                    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
                    with open(output_path, "wb") as out:
                        out.write(dl_resp.content)

            await self.db.update_result(
                path=pdf_path,
                status="completed",
                before_score=before_score,
                after_score=after_score,
            )

            return {
                "status": "completed",
                "before_score": before_score,
                "after_score": after_score,
            }

    def _output_path(self, pdf_path: str) -> str:
        p = Path(pdf_path)
        if self.config.output_mode == "directory":
            return str(Path(self.config.output_dir) / p.name)
        elif self.config.output_mode == "overwrite":
            return str(p.parent / f"{p.stem}_tmp_remediated{p.suffix}")
        else:  # suffix
            return str(p.parent / f"{p.stem}_remediated{p.suffix}")
