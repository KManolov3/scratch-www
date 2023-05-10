package com.advanceautoparts.rtninstoreapps

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.advanceautoparts.rtninstoreapps.NativeInStoreAppsSpec

class InStoreAppsModule(reactContext: ReactApplicationContext) : NativeInStoreAppsSpec(reactContext) {

  override fun getName() = NAME

  override fun add(a: Double, b: Double, promise: Promise) {
    promise.resolve(a + b)
  }

  companion object {
    const val NAME = "RTNInStoreApps"
  }
}
