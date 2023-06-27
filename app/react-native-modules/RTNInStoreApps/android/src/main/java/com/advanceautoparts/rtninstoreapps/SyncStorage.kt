package com.advanceautoparts.rtninstoreapps

import android.content.Context
import android.content.SharedPreferences

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray

class SyncStorage(reactContext: ReactApplicationContext) {
    private val preferences = reactContext.getSharedPreferences("com.advanceautoparts.rtninstoreapps.PREFERENCE_FILE_KEY", Context.MODE_PRIVATE)
    private val editor = preferences.edit()

    fun getItem(key: String): String? {
        return preferences.getString(key, null)
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
}