#!/usr/bin/env bash
# Publishes the six carousels on Instagram, the first at once and each of the others twenty
# minutes after the one before (asked by the owner on 2026-10-14). It waits first for the
# account's token to be in .secrets/instagram-token.txt, and stops at the first one that fails.
# One already published (its instagram.json is there) is skipped, so running it again resumes.
#
#   bash carousels/2026-10-14-ai-tools/publish.sh        (from the-market-hub-media)
set -u
cd "$(dirname "$0")/../.."
export UV_LINK_MODE=copy GOOGLE_CLOUD_PROJECT="${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project 2>/dev/null)}"
EVERY=${EVERY:-1200}

until [ -s .secrets/instagram-token.txt ]; do
  echo "$(date '+%H:%M:%S') waiting for .secrets/instagram-token.txt"
  sleep 30
done

first=1
for folder in carousels/2026-10-14-ai-tools/0*/; do
  if [ -f "$folder/instagram.json" ]; then
    echo "$(date '+%H:%M:%S') already on Instagram: $folder"
    continue
  fi
  [ "$first" = 1 ] || sleep "$EVERY"
  first=0
  echo "$(date '+%H:%M:%S') publishing $folder"
  if ! uv run python -m marketmedia carousel "$folder"; then
    echo "$(date '+%H:%M:%S') FAILED: $folder (nothing after it was published)"
    exit 1
  fi
done
echo "$(date '+%H:%M:%S') all published"
