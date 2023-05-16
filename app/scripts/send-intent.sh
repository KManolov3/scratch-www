# Example output: "    mResumedActivity: ActivityRecord{b365d00 u0 com.advanceautoparts.instoreapps/.activities.ItemLookupActivity t60}"
CURRENT_ACTIVITY="$(adb shell dumpsys activity activities | grep mResumedActivity)"

case "$CURRENT_ACTIVITY" in
    *ItemLookupActivity*)
        INTENT="com.advanceautoparts.instoreapps.itemlookup.datawedge.SCAN"
        ;;
    *CycleCountActivity*)
        INTENT="com.advanceautoparts.instoreapps.cyclecount.datawedge.SCAN"
        ;;
    *BatchCountActivity*)
        INTENT="com.advanceautoparts.instoreapps.batchcount.datawedge.SCAN"
        ;;
    *TruckDetailScanActivity*)
        INTENT="com.advanceautoparts.instoreapps.truckscan.datawedge.SCAN"
        ;;
    *)
        echo "Unknown activity is in the foreground"
        exit -1
        ;;
esac

adb shell \
    am start \
        -a "$INTENT" \
        -c android.intent.category.DEFAULT \
        --activity-single-top
