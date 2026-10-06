"""The channel from the command line. Everything is started by hand (see the Makefile).

    python -m marketmedia new "The title of the idea"    a new video's folder, from the template
    python -m marketmedia status                         every video and how far along it is
    python -m marketmedia check [video]                  what stops a video from being published
    python -m marketmedia frames <video> [--all]         draw the frames and the thumbnail
    python -m marketmedia voice <video>                  speak the scenes that need it (Text-to-Speech)
    python -m marketmedia render <video>                 frames, then the video, the Short and their captions
    python -m marketmedia kit <video>                    what to paste into YouTube Studio
    python -m marketmedia published <video> <url> [--short <url>]   remember where it was published
    python -m marketmedia auth                           sign in to YouTube, once (for uploads through the API)
    python -m marketmedia upload <video> [--privacy p]   upload through the API (private unless said otherwise)

<video> is the folder's name, or a part of it that only one video has.
"""

from __future__ import annotations

import argparse
import sys

from . import channel as channels
from . import check, frames, render, videos, voice, youtube
from . import script as scripts


def _clock(seconds: float) -> str:
    return f"{int(seconds) // 60}:{int(seconds) % 60:02d}"


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
                seconds = sum(c.seconds for c in render.plan(video, script, channel))
                short = sum(c.seconds for c in render.plan(video, script, channel, short=True))
                line += f" {len(script.scenes):>3} scenes {script.words:>5} words {_clock(seconds)}  short {_clock(short)}"
            except (scripts.Invalid, ValueError):
                line += " script cannot be read"
        record = video.record()
        if record:
            line += f"  {record['url']}"
        print(line)
    return 0


def _check(args, channel) -> int:
    wanted = [videos.find(args.video)] if args.video else [v for v in videos.every() if v.stage() != "brief"]
    bad = 0
    for video in wanted:
        found = check.problems(video, channel)
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


def _voice(args, channel) -> int:
    video = videos.find(args.video)
    script = scripts.load(video.script)
    todo = voice.pending(video, script, channel)
    if not todo:
        print("Every scene has its voice.")
        return 0
    characters = sum(len(s.narration) for s in todo)
    print(f"{len(todo)} scenes to speak, {characters} characters, with {channel.voice_name}")
    if args.dry_run:
        return 0
    voice.make(video, script, channel)
    return 0


def _render(args, channel) -> int:
    video = videos.find(args.video)
    script = scripts.load(video.script)
    frames.draw(video, script, channel)
    for short in (False, True):
        if short and not script.cut(short=True):
            continue
        print("Short:" if short else "Video:")
        film = render.film(video, script, channel, short)
        seconds = sum(c.seconds for c in render.plan(video, script, channel, short))
        print(f"  {film.relative_to(channels.ROOT).as_posix()}  {_clock(seconds)}")
    return 0


def _unfit(video, channel) -> bool:
    """Say why a video cannot be published yet, if it cannot."""
    found = check.problems(video, channel)
    if found:
        print(f"{video.name} is not fit to publish:")
        for problem in found:
            print(f"  - {problem}")
        return True
    if not video.film().is_file() or video.film().stat().st_mtime < video.script.stat().st_mtime:
        print("The film is missing or older than its script: run 'make render' first.")
        return True
    return False


def _kit(args, channel) -> int:
    video = videos.find(args.video)
    if _unfit(video, channel):
        return 1
    script = scripts.load(video.script)
    silent = [s.name for s in script.scenes if s.narration and not video.voice(s.name)]
    video.kit.write_text(youtube.kit(script, channel), encoding="utf-8", newline="\n")
    print(f"{video.kit.relative_to(channels.ROOT).as_posix()}")
    if silent:
        print(f"Note: {len(silent)} scenes have no voice yet; the film holds them in silence.")
    return 0


def _published(args, channel) -> int:
    video = videos.find(args.video)
    youtube.remember(video.published, youtube.by_hand(args.url, args.short))
    print(f"{video.name}: {args.url}")
    return 0


def _auth(args, channel) -> int:
    print(f"Signed in. The token is in {youtube.sign_in()}")
    return 0


def _upload(args, channel) -> int:
    video = videos.find(args.video)
    if video.record() and not args.again:
        print(f"{video.name} is already on YouTube: {video.record()['url']}  (--again to upload it once more)")
        return 1
    if _unfit(video, channel):
        return 1
    script = scripts.load(video.script)
    record = youtube.upload(video.film(), video.thumbnail, script, channel, args.privacy)
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
    speaking = commands.add_parser("voice")
    speaking.add_argument("video")
    speaking.add_argument("--dry-run", action="store_true", help="say what would be spoken, and spend nothing")
    commands.add_parser("render").add_argument("video")
    commands.add_parser("kit").add_argument("video")
    remembering = commands.add_parser("published")
    remembering.add_argument("video")
    remembering.add_argument("url")
    remembering.add_argument("--short")
    commands.add_parser("auth")
    uploading = commands.add_parser("upload")
    uploading.add_argument("video")
    uploading.add_argument("--privacy", choices=["private", "unlisted", "public"])
    uploading.add_argument("--again", action="store_true")
    args = parser.parse_args(argv)
    run = {"new": _new, "status": _status, "check": _check, "frames": _frames, "voice": _voice, "render": _render,
           "kit": _kit, "published": _published, "auth": _auth, "upload": _upload}[args.command]
    try:
        return run(args, channels.load())
    except (LookupError, ValueError, FileNotFoundError, RuntimeError, scripts.Invalid) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
