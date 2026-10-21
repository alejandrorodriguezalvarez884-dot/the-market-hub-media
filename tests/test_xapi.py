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
