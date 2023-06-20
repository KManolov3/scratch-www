package com.advanceautoparts.instoreapps

import android.os.Bundle
import com.advanceautoparts.rtninstoreapps.loadingscreen.ActivityWithLoadingScreen
import com.advanceautoparts.rtninstoreapps.loadingscreen.LoadingScreenController
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate

abstract class InStoreAppActivity: ReactActivity(), ActivityWithLoadingScreen {
    override lateinit var loadingScreen: LoadingScreenController

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(
            this,
            mainComponentName!!,
            DefaultNewArchitectureEntryPoint.fabricEnabled,
            DefaultNewArchitectureEntryPoint.concurrentReactEnabled
        )

    override fun onCreate(savedInstanceState: Bundle?) {
        loadingScreen = LoadingScreenController(this)
        loadingScreen.show()

        // Required by React Navigation (see https://reactnavigation.org/docs/getting-started/)
        super.onCreate(null)
    }
}
