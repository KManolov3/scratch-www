package com.advanceautoparts.rtninstoreapps

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.advanceautoparts.rtninstoreapps.NativeInStoreAppsSpec
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Callback

class InStoreAppsModule(val reactContext: ReactApplicationContext) : NativeInStoreAppsSpec(reactContext), ActivityEventListener {
  companion object {
    const val NAME = "RTNInStoreApps"
  }

  override fun getName() = NAME

  private var scanListener: (() -> Int?)? = null

  init {
      reactContext.addActivityEventListener(this)
  }

  override fun initializeScanner(promise: Promise) {
    Log.d("InStoreAppsModule", "initializeScanner")

    promise.resolve(null)
  }

  override fun setScanListener(callback: Callback?) {
    Log.d("InStoreAppsModule", "setScanListener")
  }

  override fun onActivityResult(activity: Activity?, startCode: Int, resultCode: Int, intent: Intent?) {
    // Nothing to do here, needs to be implemented because of ActivityEventListener
  }

  override fun onNewIntent(intent: Intent) {
    if (intent.action == "com.advanceautoparts.instoreapps.SCAN") {
      Log.d("InStoreAppsModule", "Received datawedge scan intent")
    }
  }

  // TODO: We don't need it currently, should we keep it for later or remove it and recreate if needed?
  private fun inStoreAppsContext() = (reactContext.currentActivity as ActivityWithInStoreAppsContext).inStoreAppsContext
}
