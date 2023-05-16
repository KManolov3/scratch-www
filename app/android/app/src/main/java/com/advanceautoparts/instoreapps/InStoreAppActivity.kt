package com.advanceautoparts.instoreapps

import android.os.Bundle
import com.advanceautoparts.rtninstoreapps.ActivityWithInStoreAppsContext
import com.advanceautoparts.rtninstoreapps.InStoreAppsContext
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate

abstract class InStoreAppActivity(
    val scannerCategory: String
): ReactActivity(), ActivityWithInStoreAppsContext {
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(
            this,
            mainComponentName!!,
            DefaultNewArchitectureEntryPoint.fabricEnabled,
            DefaultNewArchitectureEntryPoint.concurrentReactEnabled
        )

    // Required by React Navigation (see https://reactnavigation.org/docs/getting-started/)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
    }

    override val inStoreAppsContext = object: InStoreAppsContext {
        override val scanCategory = scannerCategory
    }
}
