package com.advanceautoparts.bluefletch.provider

import android.app.Application
import android.content.ContentProvider
import android.content.ContentValues
import android.content.SharedPreferences
import android.content.UriMatcher
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import androidx.core.content.edit
import com.advanceautoparts.bluefletch.OktaNativeSSOLogin
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class AuthProvider: ContentProvider() {
    companion object {
        lateinit var current: AuthProvider

        private const val DEFAULT_STORE_NUMBER = "501"
    }

    init { current = this }

    lateinit var okta: OktaNativeSSOLogin
    private lateinit var preferences: SharedPreferences

    enum class UriMatch {
        BluefletchSession
    }

    private val uriMatcher = UriMatcher(UriMatcher.NO_MATCH).apply {
        /*
         * The calls to addURI() go here for all the content URI patterns that the provider
         * recognizes. For this snippet, only the calls for table 3 are shown.
         */
        addURI("com.bluefletch.launcherprovider", "session", UriMatch.BluefletchSession.ordinal)
    }

    fun currentStoreNumber(): String = preferences.getString("storeNumber", DEFAULT_STORE_NUMBER)!!
    fun setCurrentStoreNumber(storeNumber: String) = preferences.edit { putString("storeNumber", storeNumber) }

    override fun onCreate(): Boolean {
        okta = OktaNativeSSOLogin(context!!.applicationContext)
        preferences = context!!.getSharedPreferences("com.advanceautoparts.bluefletch", Application.MODE_PRIVATE)

        // Intentionally blank
        return true
    }

    override fun query(uri: Uri, projection: Array<out String>?, selection: String?, selectionArgs: Array<out String>?, sortOrder: String?): Cursor? {
        if (uriMatcher.match(uri) != UriMatch.BluefletchSession.ordinal) throw java.lang.IllegalArgumentException("Invalid URI")

        return MatrixCursor(arrayOf("DATA")).apply {
            val token = runBlocking { okta.session(currentStoreNumber()) }

            if (token == null) {
                addRow(arrayOf(null))
            } else {
                val tokenJSON = Json.encodeToString(token)

                addRow(arrayOf(tokenJSON))
            }
        }
    }

    override fun getType(uri: Uri): String? {
        return null
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return null
    }

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<out String>?): Int {
        return 0
    }

    override fun update(uri: Uri, values: ContentValues?, selection: String?, selectionArgs: Array<out String>?): Int {
        return 0
    }
}