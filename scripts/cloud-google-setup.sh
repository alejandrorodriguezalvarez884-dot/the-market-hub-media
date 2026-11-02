#!/bin/bash
# Once, by the owner, from the root of the-market-hub-media on a computer with the gcloud session:
# what the cloud routines of the daily reels need on Google Cloud (docs/reels.md, "En la nube").
#
#   1. A service account only for the reels, market-hub-reels@<project>.
#   2. It may write to the bucket the reels pass through, and to the portal's Firestore (the Media
#      page is told what was posted).
#   3. The Instagram token goes to Secret Manager (market-hub-instagram-token), where the cloud
#      runs read it and renew it; the account may read it and add versions, nothing else.
#   4. A key of the account, put on the clipboard as base64 for the cloud environment's
#      GOOGLE_SERVICE_ACCOUNT_JSON, and the key file deleted.
#
# Nothing secret is printed. Run it again and it only does what is missing (step 4 makes a new key).
set -euo pipefail
PROJECT="${PROJECT:-arctic-robot-474306-g3}"
BUCKET="${BUCKET:-arctic-robot-474306-g3-market-hub-reels}"
ACCOUNT="market-hub-reels@${PROJECT}.iam.gserviceaccount.com"
SECRET="market-hub-instagram-token"

echo "1. Service account $ACCOUNT"
gcloud iam service-accounts describe "$ACCOUNT" --project="$PROJECT" >/dev/null 2>&1 ||
  gcloud iam service-accounts create market-hub-reels --project="$PROJECT" \
    --display-name="Market Hub reels (Claude cloud routines)"

echo "2. It may write to gs://$BUCKET and to Firestore"
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
  --member="serviceAccount:$ACCOUNT" --role=roles/storage.objectAdmin >/dev/null
gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:$ACCOUNT" --role=roles/datastore.user --condition=None >/dev/null

echo "3. The Instagram token in Secret Manager ($SECRET)"
gcloud services enable secretmanager.googleapis.com --project="$PROJECT"
if ! gcloud secrets describe "$SECRET" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud secrets create "$SECRET" --project="$PROJECT" --replication-policy=automatic \
    --data-file=.secrets/instagram-token.txt
fi
for role in roles/secretmanager.secretAccessor roles/secretmanager.secretVersionAdder roles/secretmanager.viewer; do
  gcloud secrets add-iam-policy-binding "$SECRET" --project="$PROJECT" \
    --member="serviceAccount:$ACCOUNT" --role="$role" >/dev/null
done

echo "4. A key of the account, on the clipboard (base64) for GOOGLE_SERVICE_ACCOUNT_JSON"
KEY="$(mktemp -t market-hub-reels-key).json"
gcloud iam service-accounts keys create "$KEY" --iam-account="$ACCOUNT" --project="$PROJECT" >/dev/null
base64 < "$KEY" | tr -d '\n' | pbcopy
rm -f "$KEY"

echo
echo "Done. The key is on the clipboard: paste it as GOOGLE_SERVICE_ACCOUNT_JSON in the cloud environment."
echo "INSTAGRAM_TOKEN_SECRET=projects/$PROJECT/secrets/$SECRET"
