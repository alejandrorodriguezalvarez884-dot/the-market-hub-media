import json
from datetime import datetime, timezone

from marketmedia import posts

NOW = datetime(2026, 10, 13, 19, 30, tzinfo=timezone.utc)


def jpeg(width, height):
    """As little of a JPEG as says its size."""
    return b"\xff\xd8\xff\xe0\x00\x04ab\xff\xc0\x00\x0b\x08" + height.to_bytes(2, "big") + width.to_bytes(2, "big") + b"\x01\x01\x11\x00"


REEL = {"id": "111111", "shortcode": "Creel", "media_type": "VIDEO", "media_product_type": "REELS", "permalink": "https://www.instagram.com/reel/Creel/",
        "media_url": "https://cdn/reel.mp4", "thumbnail_url": "https://cdn/reel-first-frame.jpg", "timestamp": "2026-10-13T18:58:35+0000",
        "caption": "\nThe whole market, on one page.\n\nToday's moves on one scale.\n#stocks"}
PHOTO = {"id": "222222", "shortcode": "Cphoto", "media_type": "IMAGE", "media_product_type": "FEED", "permalink": "https://www.instagram.com/p/Cphoto/",
         "media_url": "https://cdn/photo.jpg", "timestamp": "2026-10-12T08:00:00+0000", "caption": "word " * 60}
ALBUM = {"id": "333333", "shortcode": "Calbum", "media_type": "CAROUSEL_ALBUM", "media_product_type": "FEED", "permalink": "https://www.instagram.com/p/Calbum/",
         "timestamp": "2026-10-11T08:00:00+0000",
         "children": {"data": [{"media_type": "IMAGE", "media_url": "https://cdn/album-1.jpg"}, {"media_type": "IMAGE", "media_url": "https://cdn/album-2.jpg"}]}}
PHONE_REEL = {"id": "444444", "shortcode": "Cphone", "media_type": "VIDEO", "media_product_type": "REELS", "permalink": "https://www.instagram.com/reel/Cphone/",
              "media_url": "https://cdn/phone.mp4", "thumbnail_url": "https://cdn/phone-first-frame.jpg", "timestamp": "2026-10-10T08:00:00+0000"}


class Api:
    """Instagram's API as the posts are read from it."""

    def __init__(self, media):
        self.media, self.asked = media, []

    def __call__(self, method, path, key, **params):
        self.asked.append((method, path, params))
        if path == "me":
            return {"user_id": "178", "username": "the_market_hub_app"}
        return {"data": self.media[:params["limit"]]}


class Camera:
    """What makes a cover: it writes down what it was asked for."""

    def __init__(self, fails=()):
        self.taken, self.fails = [], set(fails)

    def __call__(self, address, at_ms):
        if address in self.fails:
            raise RuntimeError("no cover could be made")
        self.taken.append((address, at_ms))
        return jpeg(720, 1280) if address.endswith(".mp4") or "frame" in address else jpeg(720, 720)


def gather(media, kept=None, camera=None, moments=None, **more):
    camera = camera or Camera()
    front, covers = posts.gather("a-token", kept, call=Api(media), picture=camera, moments=moments or {}, now=lambda: NOW, log=more.pop("log", lambda line: None), **more)
    return front, covers, camera


def test_every_kind_of_post_is_a_card_newest_first_with_its_first_line():
    front, covers, _ = gather([REEL, PHOTO, ALBUM])
    assert front["handle"] == "the_market_hub_app" and front["read_utc"] == "2026-10-13T19:30:00+00:00"
    assert [(p["code"], p["kind"]) for p in front["posts"]] == [("Creel", "reel"), ("Cphoto", "photo"), ("Calbum", "album")]
    reel, photo, album = front["posts"]
    assert reel["text"] == "The whole market, on one page." and reel["url"].endswith("/reel/Creel/")
    assert reel["posted_utc"] == "2026-10-13T18:58:35+00:00"
    assert len(photo["text"]) <= posts.TEXT_MAX and photo["text"].endswith("word…")
    assert album["text"] == ""
    assert set(covers) == {"111111", "222222", "333333"}
    assert reel["cover"]["upright"] is True and photo["cover"]["upright"] is False and len(reel["cover"]["v"]) == 12


def test_a_reels_cover_is_the_frame_it_was_published_with_not_the_first_one():
    _, _, camera = gather([REEL, PHONE_REEL, PHOTO, ALBUM], moments={"Creel": 2200})
    assert camera.taken == [("https://cdn/reel.mp4", 2200),                # the film, at its cover's moment
                            ("https://cdn/phone-first-frame.jpg", 0),      # nobody recorded this one: Instagram's frame
                            ("https://cdn/photo.jpg", 0), ("https://cdn/album-1.jpg", 0)]


def test_a_cover_the_portal_already_has_is_not_made_again():
    first, _, _ = gather([REEL, PHOTO], moments={"Creel": 2200})
    again, covers, camera = gather([REEL, PHOTO], kept=first, moments={"Creel": 2200})
    assert covers == {} and camera.taken == []
    assert again["posts"] == first["posts"]
    moved, covers, camera = gather([REEL, PHOTO], kept=first, moments={"Creel": 5000})   # its cover was named again
    assert set(covers) == {"111111"} and camera.taken == [("https://cdn/reel.mp4", 5000)]
    assert moved["posts"][0]["cover"]["at_ms"] == 5000


def test_a_post_whose_cover_cannot_be_made_is_left_out_and_said():
    said = []
    front, covers, _ = gather([REEL, PHOTO], camera=Camera(fails={"https://cdn/photo.jpg"}), log=said.append)
    assert [p["code"] for p in front["posts"]] == ["Creel"] and set(covers) == {"111111"}
    assert "Cphoto is left out" in said[0]


def test_only_the_latest_are_asked_for():
    api = Api([REEL, PHOTO, ALBUM])
    front, _ = posts.gather("a-token", call=api, picture=Camera(), moments={}, limit=2, log=lambda line: None)
    assert len(front["posts"]) == 2 and api.asked[-1][2]["limit"] == 2


def test_the_moment_of_a_cover_is_read_from_the_records_and_from_the_list_kept_by_hand(tmp_path):
    (tmp_path / "channel").mkdir()
    (tmp_path / "channel" / "instagram-covers.json").write_text(json.dumps({"Cfilm": 58200}), encoding="utf-8")
    for folder, name, part in (("2026-10-13-debt", "published.json", {"code": "Cdebt", "cover_ms": 9160}),
                               ("2026-10-13-web-teaser", "instagram.json", {"code": "Cteaser", "cover_ms": 2200}),
                               ("2026-10-06-old", "published.json", {"code": "Cold"})):
        (tmp_path / "videos" / folder).mkdir(parents=True)
        (tmp_path / "videos" / folder / name).write_text(json.dumps({"url": "https://youtu.be/x", "instagram": part}), encoding="utf-8")
    (tmp_path / "videos" / "2026-10-07-youtube-only").mkdir()
    (tmp_path / "videos" / "2026-10-07-youtube-only" / "published.json").write_text(json.dumps({"url": "https://youtu.be/y"}), encoding="utf-8")
    assert posts.moments(tmp_path) == {"Cfilm": 58200, "Cdebt": 9160, "Cteaser": 2200}


def test_a_local_portals_folder_gets_the_front_and_the_covers_and_loses_those_no_longer_shown(tmp_path):
    store = posts.Folder(tmp_path / "instagram")
    assert store.front() == {}
    first = posts.sync("a-token", store, call=Api([PHOTO, ALBUM]), picture=Camera(), moments={}, now=lambda: NOW, log=lambda line: None)
    assert sorted(p.name for p in (tmp_path / "instagram" / "covers").iterdir()) == ["222222.jpg", "333333.jpg"]
    assert store.front() == first

    camera = Camera()
    second = posts.sync("a-token", store, call=Api([REEL, PHOTO]), picture=camera, moments={"Creel": 2200}, now=lambda: NOW, log=lambda line: None)
    assert [p["code"] for p in second["posts"]] == ["Creel", "Cphoto"]
    assert camera.taken == [("https://cdn/reel.mp4", 2200)]                                   # the photo's was there
    assert sorted(p.name for p in (tmp_path / "instagram" / "covers").iterdir()) == ["111111.jpg", "222222.jpg"]


def test_a_jpeg_says_which_way_up_it_is():
    assert posts._upright(jpeg(720, 1280)) is True
    assert posts._upright(jpeg(1280, 720)) is False
    assert posts._upright(b"not a picture") is False
