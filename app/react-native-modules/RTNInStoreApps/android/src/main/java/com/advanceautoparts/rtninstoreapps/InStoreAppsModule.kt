package com.advanceautoparts.rtninstoreapps

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.*

class InStoreAppsModule(val reactContext: ReactApplicationContext) : NativeInStoreAppsSpec(reactContext) {
  companion object {
    const val NAME = "RTNInStoreApps"
  }

  override fun getName() = NAME

  private val eventEmitter = reactContext
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)

  private val coroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

  private var dataWedge: DataWedge? = null
  private var authentication: Authentication? = null

  override fun reloadAuthFromLauncher(config: ReadableMap, promise: Promise) {
    val authConfig = AuthConfig(config.getString("clientId")!!, config.getString("authServerURL")!!)

    val auth = authentication ?: run {
      val instance = Authentication(reactContext, authConfig)
      authentication = instance
      instance
    }

    async(promise) {
      val token = auth.obtainToken()

      null
    }
  }

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

  private fun <T> async(promise: Promise, closure: suspend () -> T) {
    coroutineScope.launch {
      try {
        val result = withContext(Dispatchers.IO) {
          closure()
        }

        promise.resolve(result)
      } catch (throwable: Throwable) {
        // TODO: This receives OidcEndpointsNotAvailableException if it can't connect to Okta (`OIDC Endpoints not available`)
        promise.reject(throwable)
      }
    }
  }
}
