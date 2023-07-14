#!/bin/bash -e

if [[ $# != 1 && $# != 2 ]]; then
    # See https://techdocs.zebra.com/datawedge/latest/guide/output/intent/ for the available barcode types
    echo "Usage: $0 <barcode> [<barcode-type (default 'LABEL-TYPE-CODE128')>]"
    exit -1
fi

BARCODE="$1"
BARCODE_TYPE="${2:-'LABEL-TYPE-CODE128'}"

# Example output: "    mResumedActivity: ActivityRecord{b365d00 u0 com.advanceautoparts.instoreapps/.activities.ItemLookupActivity t60}"
# Example output: "    mResumedActivity: ActivityRecord{b365d00 u0 com.advanceautoparts.instoreapps.local/.activities.ItemLookupActivity t60}"
CURRENT_ACTIVITY_OUTPUT="$(adb shell dumpsys activity activities | grep mResumedActivity)"

case "$CURRENT_ACTIVITY_OUTPUT" in
    *ItemLookupActivity*)
        CATEGORY="com.advanceautoparts.instoreapps.itemlookup.SCANNER"
        ;;
    *CycleCountActivity*)
        CATEGORY="com.advanceautoparts.instoreapps.cyclecount.SCANNER"
        ;;
    *BatchCountActivity*)
        CATEGORY="com.advanceautoparts.instoreapps.batchcount.SCANNER"
        ;;
    *OutageActivity*)
        CATEGORY="com.advanceautoparts.instoreapps.outage.SCANNER"
        ;;
    *TruckDetailScanActivity*)
        CATEGORY="com.advanceautoparts.instoreapps.truckscan.SCANNER"
        ;;
    *)
        echo "Unknown activity is in the foreground"
        exit 1
        ;;
esac

SUFFIX=$(echo "$CURRENT_ACTIVITY_OUTPUT" | sed -n 's/^.* com\.advanceautoparts\.instoreapps\(\.[^\/]*\)\/\([^ ]*\) .*$/\1/p')
ACTION="com.advanceautoparts.instoreapps$SUFFIX.SCAN"

adb shell \
    am start \
        -a "$ACTION" \
        -c "$CATEGORY" \
        --es com.symbol.datawedge.label_type "$BARCODE_TYPE" \
        --es com.symbol.datawedge.data_string "$BARCODE" \
        --activity-single-top
