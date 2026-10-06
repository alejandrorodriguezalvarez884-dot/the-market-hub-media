# Everything is started from here, by hand. Nothing runs on a timer.
#
#   make new TITLE="..."      a new video's folder, from the template
#   make status               every video and how far along it is
#   make check [VIDEO=...]    what stops a video from being published
#   make frames VIDEO=...     draw the frames and the thumbnail (uses this machine's Chrome)
#   make render VIDEO=...     frames, then the film and its captions
#   make preview VIDEO=...    what would go up: title, description, tags, length
#   make auth                 sign in to YouTube, once
#   make upload VIDEO=...     publish the video (private unless PRIVACY says otherwise)
#
# VIDEO is the folder's name in videos/, or a part of it that only one video has.

SHELL := /bin/bash
.DEFAULT_GOAL := help
.PHONY: help install test new status check frames render preview auth upload

export UV_LINK_MODE ?= copy
RUN := uv run python -m marketmedia

help: ## List the targets
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk -F ':.*## ' '{printf "  make %-9s %s\n", $$1, $$2}'

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

render: ## Make the film and the captions of VIDEO=...
	$(RUN) render $(VIDEO)

preview: ## What would go up for VIDEO=...: title, description, tags, length
	$(RUN) preview $(VIDEO)

auth: ## Sign in to YouTube, once (needs .secrets/client_secret.json)
	$(RUN) auth

upload: ## Publish VIDEO=... on YouTube (PRIVACY=private|unlisted|public; private by default)
	$(RUN) upload $(VIDEO) $(if $(PRIVACY),--privacy $(PRIVACY))
