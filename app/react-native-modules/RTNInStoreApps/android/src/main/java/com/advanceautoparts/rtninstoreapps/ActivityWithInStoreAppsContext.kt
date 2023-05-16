package com.advanceautoparts.rtninstoreapps

interface InStoreAppsContext {
    val scanCategory: String
}

interface ActivityWithInStoreAppsContext {
    val inStoreAppsContext: InStoreAppsContext
}