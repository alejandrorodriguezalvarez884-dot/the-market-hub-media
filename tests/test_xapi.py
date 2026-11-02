import json

import pytest

from marketmedia import xapi

KEYS = {"api_key": "xvz1evFS4wEEPTGEFPHBog", "api_secret": "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw",
        "access_token": "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
        "access_secret": "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE"}


def test_the_signature_is_the_one_in_xs_own_example():
    # X's documentation, "Creating a signature": the same request gives the same signature.
    params = {"status": "Hello Ladies + Gentlemen, a signed OAuth request!", "include_entities": "true",
              "oauth_consumer_key": KEYS["api_key"], "oauth_nonce": "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",
              "oauth_signature_method": "HMAC-SHA1", "oauth_timestamp": "1318622958",
              "oauth_token": KEYS["access_token"], "oauth_version": "1.0"}
    assert xapi.signature("POST", "https://api.twitter.com/1.1/statuses/update.json", params,
                          KEYS["api_secret"], KEYS["access_secret"]) == "hCtSmYh+iHYCEqBWrE7C7hYmtUk="


def test_the_header_carries_the_oauth_fields_and_no_secret():
    header = xapi.authorization("POST", "https://api.x.com/2/tweets", KEYS, nonce="abc", timestamp=1700000000)
    assert header.startswith("OAuth ")
    for field in ("oauth_consumer_key", "oauth_nonce=\"abc\"", "oauth_signature=", "oauth_timestamp=\"1700000000\"", "oauth_token"):
        assert field in header
    assert KEYS["api_secret"] not in header and KEYS["access_secret"] not in header


def test_a_post_is_sent_as_its_text_and_gives_its_number():
    sent = []

    def call(method, url, keys, body):
        sent.append((method, url, body))
        return {"data": {"id": "2112790350125469806", "text": body["text"]}}

    assert xapi.create("Markets closed higher.", KEYS, call) == "2112790350125469806"
    assert sent == [("POST", "https://api.x.com/2/tweets", {"text": "Markets closed higher."})]


def test_an_answer_without_a_number_is_an_error():
    with pytest.raises(RuntimeError):
        xapi.create("Text", KEYS, lambda *a: {"errors": [{"message": "no"}]})


def test_the_keys_come_from_the_environment_or_the_file(tmp_path, monkeypatch):
    for variable in xapi.ENVIRONMENT.values():
        monkeypatch.delenv(variable, raising=False)
    file = tmp_path / "x-api.json"
    monkeypatch.setenv("X_API_KEYS", str(file))
    with pytest.raises(FileNotFoundError):
        xapi.keys()
    file.write_text(json.dumps({**KEYS, "access_secret": ""}), encoding="utf-8")
    with pytest.raises(FileNotFoundError, match="access_secret"):
        xapi.keys()
    file.write_text(json.dumps(KEYS), encoding="utf-8")
    assert xapi.keys() == KEYS
    for name, variable in xapi.ENVIRONMENT.items():
        monkeypatch.setenv(variable, name + "-from-env")
    assert xapi.keys()["api_key"] == "api_key-from-env"


def test_a_film_is_uploaded_in_pieces_then_posted_with_a_thread(tmp_path, monkeypatch):
    film = tmp_path / "reel.mp4"
    film.write_bytes(b"x" * 10)
    monkeypatch.setattr(xapi, "CHUNK", 4)
    asked = []
    states = iter([{"state": "in_progress", "check_after_secs": 1}, {"state": "succeeded"}])

    def call(method, url, keys, body):
        asked.append((method, url.replace(xapi.API, ""), body))
        if url.endswith("/initialize"):
            return {"data": {"id": "77"}}
        if url.endswith("/finalize"):
            return {"data": {"processing_info": next(states)}}
        if "command=STATUS" in url:
            return {"data": {"processing_info": next(states)}}
        if url.endswith("/tweets"):
            return {"data": {"id": str(100 + len([a for a in asked if a[1] == "/tweets"]))}}
        return {}

    numbers = xapi.thread(["Uno.", "Dos."], film, {}, call, wait=lambda s: None)
    assert numbers == ["101", "102"]
    paths = [a[1] for a in asked]
    assert paths[:5] == ["/media/upload/initialize", "/media/upload/77/append", "/media/upload/77/append",
                         "/media/upload/77/append", "/media/upload/77/finalize"]
    assert [a[2]["segment_index"] for a in asked if a[1].endswith("/append")] == ["0", "1", "2"]
    assert asked[0][2] == {"media_type": "video/mp4", "total_bytes": 10, "media_category": "tweet_video"}
    posts = [a[2] for a in asked if a[1] == "/tweets"]
    assert posts[0] == {"text": "Uno.", "media": {"media_ids": ["77"]}}
    assert posts[1] == {"text": "Dos.", "reply": {"in_reply_to_tweet_id": "101"}}


def test_a_query_string_is_signed_as_parameters():
    keys = {"api_key": "k", "api_secret": "s", "access_token": "t", "access_secret": "a"}
    with_query = xapi.authorization("GET", "https://api.x.com/2/media/upload?command=STATUS&media_id=1", keys, nonce="n", timestamp=1)
    without = xapi.authorization("GET", "https://api.x.com/2/media/upload", keys, nonce="n", timestamp=1)
    assert with_query != without


def test_in_the_cloud_the_x_keys_come_from_secret_manager(monkeypatch):
    import json
    from marketmedia import cloud
    monkeypatch.setenv("X_API_KEYS_SECRET", "projects/p/secrets/x")
    monkeypatch.setattr(cloud, "secret", lambda name: (json.dumps({"api_key": "k", "api_secret": "s", "access_token": "t", "access_secret": "a"}), None))
    assert xapi.keys() == {"api_key": "k", "api_secret": "s", "access_token": "t", "access_secret": "a"}
