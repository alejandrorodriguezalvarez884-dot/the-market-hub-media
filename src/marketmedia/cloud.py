"""What changes when this runs in a Claude cloud session instead of on the owner's computer: the
daily reels run there (docs/reels.md), on a machine with no gcloud session, no Chrome and no
.secrets/ folder.

- Google credentials come from GOOGLE_SERVICE_ACCOUNT_JSON (the key of a service account, as JSON
  or base64): written to a private temporary file for google.auth to find.
- The Instagram token lives in Secret Manager (INSTAGRAM_TOKEN_SECRET, the secret's full name):
  read from there, and renewed there, because nothing a cloud session writes to its disk lasts.
- The browser is the Chromium that Playwright installs (MEDIA_BROWSER=chromium).
"""

from __future__ import annotations

import base64
import binascii
import json
import os
import tempfile
from datetime import datetime, timezone

SECRETS = "https://secretmanager.googleapis.com/v1"


def credentials() -> str | None:
    """Make GOOGLE_SERVICE_ACCOUNT_JSON usable by google.auth: write it to a private file and point
    GOOGLE_APPLICATION_CREDENTIALS at it. Returns that file, or None when there is nothing to do."""
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
    if not raw or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        return None
    if not raw.startswith("{"):
        try:
            raw = base64.b64decode(raw).decode("utf-8")
        except (binascii.Error, UnicodeDecodeError):
            raise ValueError("GOOGLE_SERVICE_ACCOUNT_JSON is neither JSON nor base64 of JSON") from None
    json.loads(raw)   # refuse early what google.auth would refuse late
    handle, path = tempfile.mkstemp(prefix="market-hub-sa-", suffix=".json")
    with os.fdopen(handle, "w", encoding="utf-8") as file:
        file.write(raw)
    os.chmod(path, 0o600)
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path
    return path


def browser_channel() -> str | None:
    """The Chrome channel Playwright launches: the owner's Chrome unless MEDIA_BROWSER says
    otherwise; "chromium" (Playwright's own browser, in the cloud) is no channel at all."""
    wanted = os.environ.get("MEDIA_BROWSER", "chrome").strip()
    return None if wanted in ("", "chromium") else wanted


def _session():
    import google.auth
    from google.auth.transport.requests import AuthorizedSession
    found, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
    return AuthorizedSession(found)


def secret(name: str, session=None) -> tuple[str, datetime]:
    """The latest version of the secret ``name`` (projects/<p>/secrets/<s>): its value and when it
    was written."""
    session = session or _session()
    meta = session.get(f"{SECRETS}/{name}/versions/latest", timeout=60)
    value = session.get(f"{SECRETS}/{name}/versions/latest:access", timeout=60)
    for answer in (meta, value):
        if answer.status_code != 200:
            raise RuntimeError(f"Secret Manager answered {answer.status_code} for {name}")
    written = datetime.fromisoformat(meta.json()["createTime"].replace("Z", "+00:00"))
    return base64.b64decode(value.json()["payload"]["data"]).decode("utf-8").strip(), written


def value(name: str, session=None) -> str:
    """Only the value of the secret's latest version (what an account that may only read it can ask)."""
    session = session or _session()
    answer = session.get(f"{SECRETS}/{name}/versions/latest:access", timeout=60)
    if answer.status_code != 200:
        raise RuntimeError(f"Secret Manager answered {answer.status_code} for {name}")
    return base64.b64decode(answer.json()["payload"]["data"]).decode("utf-8").strip()


def store(name: str, value: str, session=None) -> None:
    """Write ``value`` as the secret's new latest version."""
    session = session or _session()
    answer = session.post(f"{SECRETS}/{name}:addVersion", timeout=60,
                          json={"payload": {"data": base64.b64encode(value.encode()).decode()}})
    if answer.status_code != 200:
        raise RuntimeError(f"Secret Manager answered {answer.status_code} when keeping a new version of {name}")


def age_days(written: datetime) -> float:
    return (datetime.now(timezone.utc) - written).total_seconds() / 86400
