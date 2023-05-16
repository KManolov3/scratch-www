package com.advanceautoparts.instoreapps.activities

import com.advanceautoparts.instoreapps.InStoreAppActivity

class BatchCountActivity: InStoreAppActivity(
    "com.advanceautoparts.instoreapps.batchcount.datawedge.SCAN"
) {
    override fun getMainComponentName() = "BatchCountApp"
}