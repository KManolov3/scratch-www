package com.advanceautoparts.bluefletch.provider

import android.content.ContentProvider
import android.content.ContentValues
import android.content.UriMatcher
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import com.advanceautoparts.bluefletch.OktaNativeSSOLogin
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class AuthProvider: ContentProvider() {
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

    override fun onCreate(): Boolean {
        // Intentionally blank

        return true
    }

    override fun query(uri: Uri, projection: Array<out String>?, selection: String?, selectionArgs: Array<out String>?, sortOrder: String?): Cursor? {
        if (uriMatcher.match(uri) != UriMatch.BluefletchSession.ordinal) throw java.lang.IllegalArgumentException("Invalid URI")

        return MatrixCursor(arrayOf("DATA")).apply {
            val token = runBlocking { OktaNativeSSOLogin.token() }
            val tokenJSON = Json.encodeToString(token)

            addRow(arrayOf(tokenJSON))
        }

//        return StaticDataCursor(
//            listOf(
//                ColumnDefinition("DATA", Cursor.FIELD_TYPE_STRING)
//            ),
//            listOf(
//                listOf("{\"userId\":\"1234\"}")
//            )
//        )
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