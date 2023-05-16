package com.advanceautoparts.instoreapps.activities

import com.advanceautoparts.instoreapps.InStoreAppActivity

class ItemLookupActivity: InStoreAppActivity(
    "com.advanceautoparts.instoreapps.itemlookup.datawedge.SCAN"
) {
    override fun getMainComponentName() = "ItemLookupApp"
}