package com.advanceautoparts.rtninstoreapps

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class InStoreAppsModule(val reactContext: ReactApplicationContext) : NativeInStoreAppsSpec(reactContext) {
  companion object {
    const val NAME = "RTNInStoreApps"
  }

  override fun getName() = NAME

  private val eventEmitter = reactContext
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)

  private var dataWedge: DataWedge? = null

  override fun configureScanner(config: ReadableMap) {
    Log.d("InStoreAppsModule", "Configuring DataWedge scanner")

    this.dataWedge?.unsubscribe()

    val dataWedge = DataWedge(
      reactContext = reactContext,
      appConfig = AppConfig(
        dataWedgeProfileName = config.getString("profileName")!!,
        packageName = reactContext.packageName,
        activityList = listOf(reactContext.currentActivity!!.javaClass.name)
      ),
      intentConfig = IntentConfig(
        action = "com.advanceautoparts.instoreapps.SCAN",
        category = config.getString("scanIntentCategory")!!
      )
    )
    this.dataWedge = dataWedge

    dataWedge.configureProfile()
    dataWedge.subscribeForScans {
      Log.d("InStoreAppsModule", "Received DataWedge scan")

      eventEmitter.emit("scan", it.toJSObject())
    }
  }

  override fun addListener(event: String) {
    // Nothing to do here, this is just a way for the NativeEventEmitter to notify us if we want to handle the subscription event
  }

  override fun removeListeners(count: Double) {
    // Nothing to do here, this is just a way for the NativeEventEmitter to notify us if we want to handle the unsubscription events
  }
}
