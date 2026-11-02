# Everything is started from here, by hand. Nothing runs on a timer.
#
#   make new TITLE="..."        a new video's folder, from the template
#   make status                 every video and how far along it is
#   make check [VIDEO=...]      what stops a video from being published
#   make frames VIDEO=...       draw the frames and the thumbnail (uses this machine's Chrome)
#   make voice VIDEO=...        speak the scenes that need it (Google Cloud Text-to-Speech)
#   make render VIDEO=...       frames, then the video, the Short and their captions
#   make kit VIDEO=...          what to paste into YouTube Studio to publish it by hand
#   make published VIDEO=... URL=... [SHORT=...]   remember where it was published
#
# VIDEO is the folder's name in videos/, or a part of it that only one video has.
#   make auth                   sign in to YouTube, once, for uploads through the API
#   make upload VIDEO=... [PRIVACY=public|unlisted|private]   upload the video and its Short
#   make instagram VIDEO=...    publish the Short as a reel on Instagram
#   make instagram CHECK=1      say which account the Instagram token is for, and publish nothing
#   make story STORY=...        publish a picture (a page or a JPEG) as a story on Instagram (DRAW=1: only draw it)
#   make carousel CAROUSEL=...  publish a folder of slides as one post in the Instagram feed (DRAW=1: only draw them)
#   make posts [TO=...]         tell the portal's Media page what the account last posted on Instagram
#   make xcheck [POST=...]      what stops a post in x/ from going on X (every one not yet on it)
#   make xpost POST=...         put a post in x/ on X through its API (paid: $0.015, $0.20 with a link), and tell the portal
#   make xwho                   say which account the X API keys post as
#   make xkeys                  bring the X API keys from Secret Manager into .secrets/x-api.json (on a new machine)
#   make elevenkey              bring the ElevenLabs key (the reels' voices) from Secret Manager into .secrets/ (on a new machine)
#   make xposted POST=... URL=...  write down where a post went on X (put there by hand), and tell the portal
#   make xfront [TO=...]        tell the portal's Media page what the account last posted on X
#   make reelnew MOMENT=open|close [DATE=...]   a daily reel's folder in reels/, from the template
#   make reelcheck [REEL=...]   what stops a daily reel from going on Instagram
#   make reel REEL=... [DRY=1]  speak a daily reel, draw it and make its film
#   make reelpost REEL=...      publish a reel on Instagram, tell the portal, then its thread on X
#   make reelx REEL=...         post a reel's thread on X with its film (when reelpost could not)
#
# Until YouTube has audited the API project, it keeps private whatever make upload sends.

SHELL := /bin/bash
.DEFAULT_GOAL := help
.PHONY: help install test new status check frames voice render kit published auth upload instagram story carousel posts xcheck xpost xwho xkeys xposted xfront elevenkey reelnew reelcheck reel reelpost reelx

# The Google Cloud project that pays for the narration.
GCP_PROJECT ?= $(or $(GOOGLE_CLOUD_PROJECT),$(shell gcloud config get-value project 2>/dev/null))
export UV_LINK_MODE ?= copy
RUN := uv run python -m marketmedia
# Where the ElevenLabs key lives (the owner's account, shared with Llamazo).
ELEVEN_PROJECT ?= llamazo-prod
ELEVEN_SECRET ?= ELEVENLABS_API_KEY

help: ## List the targets
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk -F ':.*## ' '{printf "  make %-10s %s\n", $$1, $$2}'

install: ## Install the dependencies
	uv sync

test: ## Run the tests
	uv run pytest

new: ## A new video's folder: TITLE="the working title"
	@[ -n "$(TITLE)" ] || { echo 'Give it a title: make new TITLE="..."'; exit 1; }
	$(RUN) new "$(TITLE)"

status: ## Every video and how far along it is
	$(RUN) status

check: ## What stops a video from being published (every video past its brief, or VIDEO=...)
	$(RUN) check $(VIDEO)

frames: ## Draw the frames and the thumbnail of VIDEO=... (ALL=1 to draw them all again)
	$(RUN) frames $(VIDEO) $(if $(ALL),--all)

voice: ## Speak the scenes of VIDEO=... that need it (DRY=1 to see what it would send, and spend nothing)
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) voice $(VIDEO) $(if $(DRY),--dry-run)

render: ## Make the video, the Short and the captions of VIDEO=...
	$(RUN) render $(VIDEO)

kit: ## Write what to paste into YouTube Studio for VIDEO=... (build/youtube.txt)
	$(RUN) kit $(VIDEO)

published: ## Remember where VIDEO=... was published: URL=... and, for its Short, SHORT=...
	@[ -n "$(URL)" ] || { echo 'Give its address: make published VIDEO=... URL=https://...'; exit 1; }
	$(RUN) published $(VIDEO) "$(URL)" $(if $(SHORT),--short "$(SHORT)")

auth: ## Sign in to YouTube, once, for uploads through the API (needs .secrets/client_secret.json)
	$(RUN) auth

upload: ## Upload VIDEO=... and its Short through the API (PRIVACY=private|unlisted|public; channel.toml's if not said)
	$(RUN) upload $(VIDEO) $(if $(PRIVACY),--privacy $(PRIVACY))

instagram: ## Publish the Short of VIDEO=... as a reel on Instagram (CHECK=1: only say whose the token is)
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) instagram $(VIDEO) $(if $(CHECK),--check)

story: ## Publish STORY=... (a page drawn for 1080x1920, or a JPEG) as a story on Instagram (DRAW=1: only draw it)
	@[ -n "$(STORY)" ] || { echo 'Which one? make story STORY=stories/<name>/story.html'; exit 1; }
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) story "$(STORY)" $(if $(DRAW),--draw)

carousel: ## Publish CAROUSEL=... (a folder of slides drawn for 1080x1350, and its caption.txt) as one post in the Instagram feed (DRAW=1: only draw them)
	@[ -n "$(CAROUSEL)" ] || { echo 'Which one? make carousel CAROUSEL=carousels/<name>'; exit 1; }
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) carousel "$(CAROUSEL)" $(if $(DRAW),--draw)

posts: ## Read the account's latest Instagram posts and leave them where the portal's Media page reads them (TO=<folder>: a local portal's)
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) posts $(if $(TO),--to "$(TO)")

xcheck: ## What stops a post in x/ from going on X (POST=...; every one not yet on it if not said)
	$(RUN) xcheck $(POST)

xpost: ## Put POST=... on X through its API (paid: $0.015, $0.20 with a link), write it down and tell the portal (TO=<folder>: a local portal's)
	@[ -n "$(POST)" ] || { echo 'Which post? make xpost POST=...'; exit 1; }
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) xpost "$(POST)" $(if $(TO),--to "$(TO)")

xwho: ## Say which account the X API keys post as
	$(RUN) xwho

elevenkey: ## Bring the ElevenLabs key from Secret Manager (ELEVENLABS_API_KEY of llamazo-prod) into .secrets/elevenlabs-key.txt (AGAIN=1: over one already there)
	@[ ! -e .secrets/elevenlabs-key.txt ] || [ -n "$(AGAIN)" ] || { echo '.secrets/elevenlabs-key.txt is already here (AGAIN=1 to replace it with the one in Secret Manager)'; exit 1; }
	mkdir -p .secrets
	gcloud secrets versions access latest --secret=$(ELEVEN_SECRET) --project=$(ELEVEN_PROJECT) --out-file=.secrets/elevenlabs-key.txt
	@chmod 600 .secrets/elevenlabs-key.txt; echo 'ElevenLabs key in .secrets/elevenlabs-key.txt'

xkeys: ## Bring the X API keys from Secret Manager (market-hub-x-api-keys) into .secrets/x-api.json (AGAIN=1: over one already there)
	@[ ! -e .secrets/x-api.json ] || [ -n "$(AGAIN)" ] || { echo '.secrets/x-api.json is already here (AGAIN=1 to replace it with the one in Secret Manager)'; exit 1; }
	mkdir -p .secrets
	gcloud secrets versions access latest --secret=market-hub-x-api-keys --project=$(GCP_PROJECT) --out-file=.secrets/x-api.json
	$(RUN) xwho

xposted: ## Write down where POST=... went on X (URL=https://x.com/<account>/status/<number>), and tell the portal (TO=<folder>: a local portal's)
	@[ -n "$(POST)" ] && [ -n "$(URL)" ] || { echo 'Which post and where? make xposted POST=... URL=https://x.com/...'; exit 1; }
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) xposted "$(POST)" "$(URL)" $(if $(TO),--to "$(TO)")

xfront: ## Leave the account's latest posts on X where the portal's Media page reads them (TO=<folder>: a local portal's)
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) xfront $(if $(TO),--to "$(TO)")

reelnew: ## A daily reel's folder: MOMENT=open|close [DATE=2026-11-02]
	@[ -n "$(MOMENT)" ] || { echo 'Which one? make reelnew MOMENT=open|close'; exit 1; }
	$(RUN) reelnew $(MOMENT) $(if $(DATE),--date $(DATE))

reelcheck: ## What stops a daily reel from going on Instagram (every one not yet up, or REEL=...)
	$(RUN) reelcheck $(REEL)

reel: ## Speak REEL=..., draw it and make its film (DRY=1: say what would be spoken, and spend nothing)
	@[ -n "$(REEL)" ] || { echo 'Which one? make reel REEL=2026-11-02-open'; exit 1; }
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) reel $(REEL) $(if $(DRY),--dry-run)

reelpost: ## Publish REEL=... on Instagram, write it down and tell the portal (AGAIN=1: once more, when the first was deleted)
	@[ -n "$(REEL)" ] || { echo 'Which one? make reelpost REEL=2026-11-02-open'; exit 1; }
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) reelpost $(REEL) $(if $(AGAIN),--again)

reelx: ## Post the thread of REEL=... on X with its film (paid: about $0.015 a post), when reelpost could not
	@[ -n "$(REEL)" ] || { echo 'Which one? make reelx REEL=2026-11-02-open'; exit 1; }
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) reelx $(REEL)
