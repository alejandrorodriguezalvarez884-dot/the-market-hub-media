#!/bin/bash
# A new key for the cloud routines' service account, on the clipboard as base64 (for the cloud
# environment's GOOGLE_SERVICE_ACCOUNT_JSON), after deleting its older keys: only one is ever alive.
# Run by the owner when the key is lost or has to change (docs/reels.md). Nothing secret is printed.
set -euo pipefail
PROJECT="${PROJECT:-arctic-robot-474306-g3}"
ACCOUNT="market-hub-reels@${PROJECT}.iam.gserviceaccount.com"
for old in $(gcloud iam service-accounts keys list --iam-account="$ACCOUNT" --project="$PROJECT" \
               --managed-by=user --format="value(name.basename())"); do
  gcloud iam service-accounts keys delete "$old" --iam-account="$ACCOUNT" --project="$PROJECT" --quiet
done
KEY="$(mktemp)"
gcloud iam service-accounts keys create "$KEY" --iam-account="$ACCOUNT" --project="$PROJECT" >/dev/null 2>&1
base64 < "$KEY" | tr -d '\n' | pbcopy
rm -f "$KEY"
echo "New key on the clipboard: paste it right after GOOGLE_SERVICE_ACCOUNT_JSON= in the cloud environment."
