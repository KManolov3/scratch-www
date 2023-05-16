package com.advanceautoparts.rtninstoreapps

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.advanceautoparts.rtninstoreapps.NativeInStoreAppsSpec
import com.facebook.react.bridge.Callback

class InStoreAppsModule(reactContext: ReactApplicationContext) : NativeInStoreAppsSpec(reactContext) {
  override fun getName() = NAME

  override fun initializeScanner(promise: Promise) {
    Log.d("InStoreAppsModule", "initializeScanner")

    promise.resolve(null)
  }

  override fun setScanListener(callback: Callback?) {
    Log.d("InStoreAppsModule", "setScanListener")
  }

  companion object {
    const val NAME = "RTNInStoreApps"
  }
}
