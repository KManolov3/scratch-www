package com.advanceautoparts.rtninstoreapps

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap

data class DataWedgeScanInfo(
    val labelType: String,
    val code: String
)

data class AppConfig(
    val dataWedgeProfileName: String,
    val packageName: String,
    val activityList: List<String>
)

data class IntentConfig(
    val action: String,
    val category: String
)

class MissingRequiredIntentExtra(key: String): Error("Received malformed datawedge scan: missing $key")

class DataWedge(
    private val reactContext: ReactContext,
    private val appConfig: AppConfig,
    private val intentConfig: IntentConfig
) {
    private var currentListener: ActivityEventListener? = null

    // See https://techdocs.zebra.com/datawedge/latest/guide/api/setconfig/
    fun configureProfile() {
        val intent = profileConfigurationIntent()

        reactContext.sendBroadcast(intent)
    }

    fun subscribeForScans(onScan: (scan: DataWedgeScanInfo) -> Unit) {
        unsubscribe()

        this.currentListener = object: ActivityEventListener {
            override fun onActivityResult(activity: Activity?, startCode: Int, resultCode: Int, intent: Intent?) {
                // Nothing to do here, needs to be implemented because of ActivityEventListener
            }

            override fun onNewIntent(intent: Intent) {
                if (intent.action == intentConfig.action && intent.categories.contains(intentConfig.category)) {
                    try {
                        onScan(scanFromIntent(intent))
                    } catch (error: Exception) {
                        Log.e("DataWedge", "Could not handle intent ${intent.action} due to: ${error.message ?: "Unknown error"}")
                    }
                }
            }
        }.also {
            reactContext.addActivityEventListener(it)
        }
    }

    fun unsubscribe() {
        if (this.currentListener != null) {
            reactContext.removeActivityEventListener(this.currentListener)
            this.currentListener = null
        }
    }

    // See https://techdocs.zebra.com/datawedge/latest/guide/output/intent/
    private fun scanFromIntent(intent: Intent) = DataWedgeScanInfo(
        labelType = requireStringExtra(intent, "com.symbol.datawedge.label_type"),
        code = requireStringExtra(intent, "com.symbol.datawedge.data_string")
    )

    private fun requireStringExtra(intent: Intent, key: String): String {
        return intent.getStringExtra(key) ?: throw MissingRequiredIntentExtra(key)
    }

    private fun profileConfigurationIntent() = Intent().apply {
        action = "com.symbol.datawedge.api.ACTION"

        putExtra("com.symbol.datawedge.api.SET_CONFIG", Bundle().apply {
            putString("PROFILE_NAME", appConfig.dataWedgeProfileName)
            putString("CONFIG_MODE", "CREATE_IF_NOT_EXIST")
            putString("PROFILE_ENABLED", "true")

            putParcelableArray("APP_LIST", arrayOf(
                Bundle().apply {
                    putString("PACKAGE_NAME", appConfig.packageName)
                    putStringArray("ACTIVITY_LIST", appConfig.activityList.toTypedArray())
                }
            ))

            putParcelableArrayList("PLUGIN_CONFIG", arrayListOf(
                Bundle().apply {
                    putString("PLUGIN_NAME", "BARCODE")
                    putString("RESET_CONFIG", "true")
                    putBundle("PARAM_LIST", Bundle().apply {
                        putString("scanner_selection", "auto")
                    })
                },

                Bundle().apply {
                    putString("PLUGIN_NAME", "INTENT")
                    putString("RESET_CONFIG", "true")
                    putBundle("PARAM_LIST", Bundle().apply {
                        putString("intent_output_enabled", "true")
                        putString("intent_action", intentConfig.action)
                        putString("intent_category", intentConfig.category)
                        putString("intent_delivery", "0") // 0 is "Start Activity"
                    })
                },

                Bundle().apply {
                    putString("PLUGIN_NAME", "KEYSTROKE")
                    putString("RESET_CONFIG", "true")
                    putBundle("PARAM_LIST", Bundle().apply {
                        putString("keystroke_output_enabled", "false")
                    })
                }
            ))
        })
    }
}
