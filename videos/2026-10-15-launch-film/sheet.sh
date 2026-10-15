#!/bin/bash
# sheet.sh CLIP T1 T2 ... : those moments of a clip side by side (3 a row), in build/sheet.jpg
f=/c/dev/TechProjects/MarketHub/the-market-hub-media/.venv/Scripts/python.exe
ff=$(cd /c/dev/TechProjects/MarketHub/the-market-hub-media && UV_LINK_MODE=copy uv run python -c "from marketmedia import render; print(render.ffmpeg())")
clip=$1; shift; i=0; ins=()
for t in "$@"; do "$ff" -y -loglevel error -ss $t -i build/clips/$clip.mp4 -frames:v 1 -vf "scale=853:480,drawtext=text='$t':x=10:y=10:fontsize=28:fontcolor=yellow:box=1:boxcolor=black" build/sh-$i.jpg 2>/dev/null || "$ff" -y -loglevel error -ss $t -i build/clips/$clip.mp4 -frames:v 1 -vf scale=853:480 build/sh-$i.jpg; ins+=(-i build/sh-$i.jpg); i=$((i+1)); done
n=$i; cols=3; rows=$(( (n+cols-1)/cols )); layout=""
for ((k=0;k<n;k++)); do layout+="$(( (k%cols)*853 ))_$(( (k/cols)*480 ))|"; done
"$ff" -y -loglevel error "${ins[@]}" -filter_complex "xstack=inputs=$n:layout=${layout%|}:fill=black" -frames:v 1 build/sheet.jpg
rm -f build/sh-*.jpg
