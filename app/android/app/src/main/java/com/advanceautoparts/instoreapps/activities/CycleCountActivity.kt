package com.advanceautoparts.instoreapps.activities

import com.advanceautoparts.instoreapps.InStoreAppActivity

class CycleCountActivity: InStoreAppActivity(
    "com.advanceautoparts.instoreapps.cyclecount.datawedge.SCAN"
) {
    override fun getMainComponentName() = "CycleCountApp"
}