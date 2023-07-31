#!/bin/bash

ALL_APPS="e2e:batch-count e2e:cycle-count e2e:item-lookup e2e:outage e2e:truck-detail-scan"
APPS_TO_RUN="${1:-$ALL_APPS}"
export REPORT_PATH="./reports-from-multiple-apps"

rm -rf "$REPORT_PATH"
mkdir "$REPORT_PATH"

for app in $APPS_TO_RUN; do
  npm run $app
done