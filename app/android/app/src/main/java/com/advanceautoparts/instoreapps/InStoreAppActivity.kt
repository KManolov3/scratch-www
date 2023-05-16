package com.advanceautoparts.instoreapps

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate

abstract class InStoreAppActivity(
    val datawedgeAction: String
): ReactActivity() {
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

    override fun onNewIntent(intent: Intent) {
        when (intent.action) {
            datawedgeAction -> handleDatawedgeScan(intent)
            else -> super.onNewIntent(intent)
        }
    }

    private fun handleDatawedgeScan(intent: Intent) {
        Log.d("InStoreAppActivity", "Received datawedge scan intent")
    }
}