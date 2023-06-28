package com.advanceautoparts.rtninstoreapps

import com.facebook.react.bridge.ReactApplicationContext
import com.tencent.mmkv.MMKV

class SyncStorage(reactContext: ReactApplicationContext) {
    init {
        MMKV.initialize(reactContext)
    }

    private val storage = MMKV.mmkvWithID("com.advanceautoparts.rtninstoreapps.PREFERENCE_FILE_KEY", MMKV.MULTI_PROCESS_MODE)

    fun getItem(key: String): String? {
        return storage.getString(key, null)
    }

    fun setItem(key: String, value: String) {
        storage.putString(key, value)
    }

    fun removeItem(key: String) {
        storage.remove(key)
    }

    fun clear() {
        storage.clear()
    }
}