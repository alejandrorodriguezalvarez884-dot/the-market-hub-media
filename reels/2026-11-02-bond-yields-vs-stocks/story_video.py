"""This reel's story: its opening scenes, up to a scene boundary within a minute, playing in the
card of story-frame.html (drawn first with `make story STORY=<this folder>/story-frame.html DRAW=1`).
The owner, 2026-11-02: "quiero que la historia sea el reel resubido con algo más". Run from the
repository root:  uv run python reels/2026-11-02-bond-yields-vs-stocks/story_video.py <reel folder> <scenes>
then publish build/story-video.mp4 with `make story STORY=...`."""
import re, subprocess, sys
from pathlib import Path
from marketmedia.render import ffmpeg

reel = Path(sys.argv[1]); scenes = int(sys.argv[2])
build = reel / "build"
def length(p):
    out = subprocess.run([ffmpeg(), "-hide_banner", "-i", str(p)], capture_output=True, text=True).stderr
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).groups(); return int(h)*3600+int(m)*60+float(s)
parts = sorted((build / "short-parts").glob("*.mp4"))
ends = []; t = 0
for p in parts: t += length(p); ends.append(round(t, 2))
cut = ends[scenes - 1]
print("parts:", ends, "cut at", cut, "of", length(build / "reel.mp4"))
W, H, X, Y, R = 612, 1088, 234, 440, 36
inside = (f"if(lte(pow(max(max({R}-X,X-(W-1-{R})),0),2)+pow(max(max({R}-Y,Y-(H-1-{R})),0),2),{R*R}),255,0)")
subprocess.run([ffmpeg(), "-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", f"color=black:s={W}x{H}",
                "-vf", f"format=gray,geq=lum='{inside}'", "-frames:v", "1", str(build / "story-mask.png")], check=True)
out = build / "story-video.mp4"
fade = cut - 0.6
graph = (f"[1:v]trim=0:{cut},setpts=PTS-STARTPTS,scale={W}:{H},format=rgba[v];"
         f"[2:v]format=gray[m];[v][m]alphamerge[r];"
         f"[0:v][r]overlay={X}:{Y}:shortest=1,fade=t=out:st={fade}:d=0.6,format=yuv420p[o];"
         f"[1:a]atrim=0:{cut},asetpts=PTS-STARTPTS,afade=t=out:st={fade}:d=0.6[a]")
subprocess.run([ffmpeg(), "-hide_banner", "-loglevel", "error", "-y",
                "-loop", "1", "-framerate", "30", "-i", str(reel / "story-frame.jpg"),
                "-i", str(build / "reel.mp4"),
                "-loop", "1", "-i", str(build / "story-mask.png"),
                "-filter_complex", graph, "-map", "[o]", "-map", "[a]", "-t", str(cut),
                "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-profile:v", "high",
                "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart", str(out)], check=True)
print(out, round(length(out), 2), "s,", out.stat().st_size // 1024, "KB")
for s in (2, 20, cut - 1):
    subprocess.run([ffmpeg(), "-hide_banner", "-loglevel", "error", "-y", "-ss", str(s), "-i", str(out), "-frames:v", "1", str(build / f"story-at-{int(s)}.png")], check=True)
