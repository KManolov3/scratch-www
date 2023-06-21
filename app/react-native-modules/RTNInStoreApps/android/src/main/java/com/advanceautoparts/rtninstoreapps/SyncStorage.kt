package com.advanceautoparts.rtninstoreapps

import android.content.Context
import android.content.SharedPreferences

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray

class SyncStorage(reactContext: ReactApplicationContext) {
    companion object {
        private const val PREF = "com.advanceautoparts.rtninstoreapps.PREFERENCE_FILE_KEY"
    }

    private val sharedPref: SharedPreferences = reactContext.getSharedPreferences(PREF, Context.MODE_PRIVATE)
    private val editor = sharedPref.edit()

    fun getItem(key: String): String? {
        return sharedPref.getString(key, null)
    }

    fun setItem(key: String, value: String) {
        editor.putString(key, value).apply()
    }

    fun removeItem(key: String) {
        editor.remove(key).apply()
    }

    fun clear() {
        editor.clear().apply()
    }

    fun getAllKeys(): WritableArray {
        val keys: WritableArray = WritableNativeArray()
        for (key in sharedPref.all.keys) {
            keys.pushString(key)
        }
        return keys
    }
}