package com.advanceautoparts.instoreapps.activities

import com.advanceautoparts.instoreapps.InStoreAppActivity

class TruckDetailScanActivity: InStoreAppActivity(
    "com.advanceautoparts.instoreapps.truckscan.SCANNER"
) {
    override fun getMainComponentName() = "TruckDetailScanApp"
}