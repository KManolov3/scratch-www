package com.advanceautoparts.rtninstoreapps

import android.util.Log
import com.advanceautoparts.rtninstoreapps.auth.AuthConfig
import com.advanceautoparts.rtninstoreapps.auth.AuthError
import com.advanceautoparts.rtninstoreapps.auth.Authentication
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.*

class AuthenticationNotConfigured : Exception("Authentication not configured - please call reloadAuthFromLauncher first")

class InStoreAppsModule(val reactContext: ReactApplicationContext) : NativeInStoreAppsSpec(reactContext) {
    companion object {
        const val NAME = "RTNInStoreApps"
    }

    override fun getName() = NAME

    private val eventEmitter = reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)

    // It's important that we use limited parallelism here so that we don't have any thread-safety issues
    // If we switch to a different dispatcher anywhere else - we'll need synchronization
    private val authCoroutineScope = CoroutineScope(
        SupervisorJob() + Dispatchers.Main.immediate.limitedParallelism(1)
    )

    private val launcher = BluefletchLauncher(reactContext)

    private var dataWedge: DataWedge? = null
    private var authentication: Authentication? = null

    override fun reloadAuthFromLauncher(config: ReadableMap, promise: Promise) = async(authCoroutineScope, promise) {
        val authConfig = AuthConfig(config.getString("clientId")!!, config.getString("authServerURL")!!)

        val auth = authentication ?: run {
            val instance = Authentication(launcher, authConfig)
            authentication = instance
            instance
        }

        val session = auth.requestTokens()

        Arguments.createMap().apply {
            putString("userId", session.userId)
            putString("userName", session.userName)
            putString("teamMemberId", session.teamMemberId)
            putString("storeNumber", session.location)
        }
    }

    override fun currentValidAccessToken(promise: Promise) = async(authCoroutineScope, promise) {
        val auth = authentication ?: throw AuthenticationNotConfigured()

        auth.currentValidAccessToken()
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

            eventEmitter.emit("scan", Arguments.createMap().apply {
                putString("code", it.code)
                putString("type", it.labelType)
            })
        }
    }

    override fun addListener(event: String) {
        // Nothing to do here, this is just a way for the NativeEventEmitter to notify us if we want to handle the subscription event
    }

    override fun removeListeners(count: Double) {
        // Nothing to do here, this is just a way for the NativeEventEmitter to notify us if we want to handle the unsubscription events
    }

    private fun <T> async(scope: CoroutineScope, promise: Promise, closure: suspend () -> T) {
        scope.launch {
            try {
                val result = closure()

                promise.resolve(result)
            } catch (error: AuthError) {
                promise.reject(error.name, error)
            } catch (error: BluefletchLauncherError) {
                promise.reject(error.name, error)
            } catch (throwable: Throwable) {
                promise.reject(throwable)
            }
        }
    }
}
