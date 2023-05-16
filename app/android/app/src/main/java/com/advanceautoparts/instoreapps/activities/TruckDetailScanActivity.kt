package com.advanceautoparts.instoreapps.activities

import com.advanceautoparts.instoreapps.InStoreAppActivity

class TruckDetailScanActivity: InStoreAppActivity(
    "com.advanceautoparts.instoreapps.truckscan.datawedge.SCAN"
) {
    override fun getMainComponentName() = "TruckDetailScanApp"
}