#!/bin/sh

if [[ $# != 1 ]]; then
    echo "Usage: $0 <barcode>"
    exit -1
fi

BARCODE="$1"

# Example output: "    mResumedActivity: ActivityRecord{b365d00 u0 com.advanceautoparts.instoreapps/.activities.ItemLookupActivity t60}"
CURRENT_ACTIVITY="$(adb shell dumpsys activity activities | grep mResumedActivity)"

case "$CURRENT_ACTIVITY" in
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

adb shell \
    am start \
        -a "com.advanceautoparts.instoreapps.SCAN" \
        -c "$CATEGORY" \
        --es com.symbol.datawedge.label_type "LABEL-TYPE-CODE128" \
        --es com.symbol.datawedge.data_string "$BARCODE" \
        --activity-single-top
