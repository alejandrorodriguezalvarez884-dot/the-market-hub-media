import base64
import json
import os

import pytest

from marketmedia import cloud


def test_a_service_account_key_in_the_environment_becomes_a_private_file(monkeypatch):
    key = json.dumps({"type": "service_account", "project_id": "p"})
    for given in (key, base64.b64encode(key.encode()).decode()):
        monkeypatch.delenv("GOOGLE_APPLICATION_CREDENTIALS", raising=False)
        monkeypatch.setenv("GOOGLE_SERVICE_ACCOUNT_JSON", given)
        path = cloud.credentials()
        assert os.environ["GOOGLE_APPLICATION_CREDENTIALS"] == path
        assert json.loads(open(path).read())["project_id"] == "p" and oct(os.stat(path).st_mode)[-3:] == "600"
        os.remove(path)


def test_nothing_is_done_without_a_key_or_with_credentials_already_set(monkeypatch):
    monkeypatch.delenv("GOOGLE_SERVICE_ACCOUNT_JSON", raising=False)
    assert cloud.credentials() is None
    monkeypatch.setenv("GOOGLE_SERVICE_ACCOUNT_JSON", "not json")
    monkeypatch.setenv("GOOGLE_APPLICATION_CREDENTIALS", "/somewhere.json")
    assert cloud.credentials() is None
    monkeypatch.delenv("GOOGLE_APPLICATION_CREDENTIALS")
    with pytest.raises(ValueError, match="neither JSON nor base64"):
        cloud.credentials()


def test_the_browser_is_chrome_unless_told(monkeypatch):
    monkeypatch.delenv("MEDIA_BROWSER", raising=False)
    assert cloud.browser_channel() == "chrome"
    monkeypatch.setenv("MEDIA_BROWSER", "chromium")
    assert cloud.browser_channel() is None


class Secrets:
    """Secret Manager as the token uses it."""

    def __init__(self, value, written):
        self.value, self.written, self.added = value, written, []

    class Answer:
        def __init__(self, body, code=200):
            self.body, self.status_code = body, code

        def json(self):
            return self.body

    def get(self, url, timeout):
        if url.endswith(":access"):
            return self.Answer({"payload": {"data": base64.b64encode(self.value.encode()).decode()}})
        return self.Answer({"createTime": self.written})

    def post(self, url, timeout, json):
        self.added.append(base64.b64decode(json["payload"]["data"]).decode())
        return self.Answer({})


def test_the_instagram_token_is_read_and_renewed_in_secret_manager(monkeypatch):
    from marketmedia import instagram
    store = Secrets("old-token", "2026-10-01T10:00:00.123456Z")
    monkeypatch.setattr(cloud, "_session", lambda: store)
    monkeypatch.setenv("INSTAGRAM_TOKEN_SECRET", "projects/p/secrets/instagram-token")
    asked = []

    def call(method, path, key, **params):
        asked.append((path, key))
        return {"access_token": "new-token"}

    assert instagram.token(call) == "new-token"
    assert asked == [("refresh_access_token", "old-token")] and store.added == ["new-token"]
    fresh = Secrets("token", "2999-01-01T00:00:00Z")
    monkeypatch.setattr(cloud, "_session", lambda: fresh)
    assert instagram.token(call) == "token" and fresh.added == []
