package com.advanceautoparts.rtninstoreapps

import android.content.Context
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

open class BluefletchLauncherError(message: String) : Exception(message)
class LauncherContentProviderError : BluefletchLauncherError("Could not find the launcher content provider or it crashed")
class MissingLauncherSession : BluefletchLauncherError("Missing launcher session - maybe the app is run outside of launcher?")

@Serializable
data class LauncherSession(
    val userId: String?,
    val userName: String?,
    val location: String?,
    val extendedAttributes: LauncherSessionExtendedAttributes
)

@Serializable
data class LauncherSessionExtendedAttributes(
    val idToken: String,
    val accessToken: String,
    val refreshToken: String,
    val deviceSecret: String
)

class BluefletchLauncher(
    private val context: Context
) {
    var currentSession: LauncherSession? = null
        private set

    suspend fun readSession() = withContext(Dispatchers.IO) {
        context.contentResolver.query(
            Uri.parse("content://com.bluefletch.launcherprovider/session"),
            arrayOf("DATA"),
            null, null, null
        ).use { cursor ->
            if (cursor == null) {
                currentSession = null
                throw LauncherContentProviderError()
            }

            cursor.moveToPosition(0)
            val json = cursor.getString(0)

            if (json == null || json == "null") {
                currentSession = null
                throw MissingLauncherSession()
            }

            return@use Json.decodeFromString<LauncherSession>(json)
                .also { currentSession = it }
        }
    }
}