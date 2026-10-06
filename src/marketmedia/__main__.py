"""The channel from the command line. Everything is started by hand (see the Makefile).

    python -m marketmedia new "The title of the idea"   a new video's folder, from the template
    python -m marketmedia status                        every video and how far along it is
    python -m marketmedia check [video]                 what stops a video from being published
    python -m marketmedia frames <video> [--all]        draw the frames and the thumbnail
    python -m marketmedia render <video>                frames, then the film and its captions
    python -m marketmedia preview <video>               what would go up: title, description, tags
    python -m marketmedia auth                          sign in to YouTube, once
    python -m marketmedia upload <video> [--privacy p]  publish it (private unless said otherwise)

<video> is the folder's name, or a part of it that only one video has.
"""

from __future__ import annotations

import argparse
import sys

from . import channel as channels
from . import frames, render, videos, youtube
from . import script as scripts


def _new(args, channel) -> int:
    video = videos.new(args.title)
    print(f"videos/{video.name}")
    return 0


def _status(args, channel) -> int:
    for video in videos.every():
        line = f"{video.name:<72} {video.stage():<10}"
        if video.script.is_file():
            try:
                script = scripts.load(video.script)
                seconds = int(sum(c.seconds for c in render.plan(video, script, channel)))
                line += f" {len(script.scenes):>3} scenes {script.words:>5} words {seconds // 60}:{seconds % 60:02d}"
            except (scripts.Invalid, ValueError):
                line += " script cannot be read"
        record = video.record()
        if record:
            line += f"  {record['url']} ({record['privacy']})"
        print(line)
    return 0


def _check(args, channel) -> int:
    wanted = [videos.find(args.video)] if args.video else [v for v in videos.every() if v.stage() != "brief"]
    bad = 0
    for video in wanted:
        found = videos.check(video, channel)
        bad += bool(found)
        print(f"{video.name}: {'ok' if not found else ''}")
        for problem in found:
            print(f"  - {problem}")
    return 1 if bad else 0


def _frames(args, channel) -> int:
    video = videos.find(args.video)
    drawn = frames.draw(video, scripts.load(video.script), channel, everything=args.all)
    print(f"{drawn} drawn" if drawn else "Every frame is up to date.")
    return 0


def _render(args, channel) -> int:
    video = videos.find(args.video)
    script = scripts.load(video.script)
    frames.draw(video, script, channel)
    film = render.film(video, script, channel)
    seconds = int(sum(c.seconds for c in render.plan(video, script, channel)))
    print(f"{film.relative_to(channels.ROOT).as_posix()}  {seconds // 60}:{seconds % 60:02d}")
    return 0


def _preview(args, channel) -> int:
    video = videos.find(args.video)
    script = scripts.load(video.script)
    seconds = int(sum(c.seconds for c in render.plan(video, script, channel)))
    voiced = sum(1 for s in script.scenes if video.voice(s.name))
    print(f"Title:    {script.title}")
    print(f"Privacy:  {channel.privacy}")
    print(f"Length:   {seconds // 60}:{seconds % 60:02d}  ({voiced} of {len(script.scenes)} scenes have their voice)")
    print(f"Tags:     {', '.join(script.tags)}")
    print()
    print(youtube.description(script, channel))
    return 0


def _auth(args, channel) -> int:
    print(f"Signed in. The token is in {youtube.sign_in()}")
    return 0


def _upload(args, channel) -> int:
    video = videos.find(args.video)
    if video.record() and not args.again:
        print(f"{video.name} is already on YouTube: {video.record()['url']}  (--again to upload it once more)")
        return 1
    found = videos.check(video, channel)
    if found:
        print(f"{video.name} is not fit to publish:")
        for problem in found:
            print(f"  - {problem}")
        return 1
    if not video.film.is_file() or video.film.stat().st_mtime < video.script.stat().st_mtime:
        print("The film is missing or older than its script: run 'make render' first.")
        return 1
    script = scripts.load(video.script)
    record = youtube.upload(video.film, video.thumbnail, script, channel, args.privacy)
    youtube.remember(video.published, record)
    print(f"{record['url']}  ({record['privacy']})" + ("" if record["thumbnail"] else "  thumbnail NOT set"))
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="marketmedia", description="The Market Hub's YouTube channel.")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("new").add_argument("title")
    commands.add_parser("status")
    commands.add_parser("check").add_argument("video", nargs="?")
    drawing = commands.add_parser("frames")
    drawing.add_argument("video")
    drawing.add_argument("--all", action="store_true")
    commands.add_parser("render").add_argument("video")
    commands.add_parser("preview").add_argument("video")
    commands.add_parser("auth")
    uploading = commands.add_parser("upload")
    uploading.add_argument("video")
    uploading.add_argument("--privacy", choices=["private", "unlisted", "public"])
    uploading.add_argument("--again", action="store_true")
    args = parser.parse_args(argv)
    run = {"new": _new, "status": _status, "check": _check, "frames": _frames, "render": _render,
           "preview": _preview, "auth": _auth, "upload": _upload}[args.command]
    try:
        return run(args, channels.load())
    except (LookupError, ValueError, FileNotFoundError, RuntimeError, scripts.Invalid) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
