package com.advanceautoparts.instoreapps.activities

import com.advanceautoparts.instoreapps.InStoreAppActivity

class ItemLookupActivity: InStoreAppActivity(
    "com.advanceautoparts.instoreapps.itemlookup.SCANNER"
) {
    override fun getMainComponentName() = "ItemLookupApp"
}