#!/bin/bash
# The setup script of the Claude cloud environment that runs the daily reels (docs/reels.md).
# Paste it into the environment's "Setup script". It runs as root on Ubuntu, before the session
# starts and before the environment variables are set, and its result is cached for about a week.
# It installs what the Mac has and the cloud does not: fonts for the slides (Inter, JetBrains Mono,
# a serif), Python 3.12, the Chromium that Playwright drives, at the version uv.lock pins, and
# Node.js 22 for Remotion (docs/remotion.md: `make reel` runs `npm ci` in remotion/ and Remotion
# downloads its own Chrome Headless Shell the first time; the libraries it needs are Chromium's).
set -u
export DEBIAN_FRONTEND=noninteractive
apt-get update -y || true
apt-get install -y fonts-inter fonts-jetbrains-mono fonts-noto-core fontconfig || true
fc-cache -f || true
command -v uv >/dev/null || pip install -q uv || true
uv python install 3.12 || true
# The browser, and the system libraries it needs, for the Playwright version in uv.lock.
uvx --python 3.12 --from playwright==1.63.0 playwright install --with-deps chromium || true
# Node.js for Remotion: kept if there is one of 18 or later, else 22 from NodeSource.
if ! command -v node >/dev/null || ! node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 18 ? 0 : 1)'; then
  apt-get install -y ca-certificates curl gnupg || true
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - || true
  apt-get install -y nodejs || true
fi
node --version || true
exit 0
