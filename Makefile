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
#   make xposted POST=... URL=...  write down where a post went on X (put there by hand), and tell the portal
#   make xfront [TO=...]        tell the portal's Media page what the account last posted on X
#
# Until YouTube has audited the API project, it keeps private whatever make upload sends.

SHELL := /bin/bash
.DEFAULT_GOAL := help
.PHONY: help install test new status check frames voice render kit published auth upload instagram story carousel posts xcheck xposted xfront

# The Google Cloud project that pays for the narration.
GCP_PROJECT ?= $(shell gcloud config get-value project 2>/dev/null)
export UV_LINK_MODE ?= copy
RUN := uv run python -m marketmedia

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

xposted: ## Write down where POST=... went on X (URL=https://x.com/<account>/status/<number>), and tell the portal (TO=<folder>: a local portal's)
	@[ -n "$(POST)" ] && [ -n "$(URL)" ] || { echo 'Which post and where? make xposted POST=... URL=https://x.com/...'; exit 1; }
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) xposted "$(POST)" "$(URL)" $(if $(TO),--to "$(TO)")

xfront: ## Leave the account's latest posts on X where the portal's Media page reads them (TO=<folder>: a local portal's)
	GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT) $(RUN) xfront $(if $(TO),--to "$(TO)")
