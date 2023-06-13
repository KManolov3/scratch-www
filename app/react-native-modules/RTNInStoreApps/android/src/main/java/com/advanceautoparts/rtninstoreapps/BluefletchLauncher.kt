package com.advanceautoparts.rtninstoreapps

import android.content.Context
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

open class BluefletchLauncherError(val name: String, message: String) : Exception(message)
class LauncherContentProviderError(message: String): BluefletchLauncherError("LauncherContentProviderError", message)
class MissingLauncherSession: BluefletchLauncherError("MissingLauncherSession", "Missing launcher session - maybe the app is run outside of launcher?")
class NotLoggedIn: BluefletchLauncherError("NotLoggedIn", "User is not logged in through the launcher")

@Serializable
data class LauncherSession(
    val userId: String,
    val userName: String,
    val teamMemberId: String,
    val location: String,
    val extendedAttributes: LauncherSessionExtendedAttributes
)

@Serializable
data class LauncherSessionExtendedAttributes(
    val idToken: String,
    val accessToken: String,
    val refreshToken: String,
    val deviceSecret: String
)

/**
 * If the user is not logged in, the format is `{"extension":"","role":"","groups":"*","location":"501","userName":"","userId":""}`
 */
@Serializable
internal data class InternalLauncherSession(
    // Seems to be an empty string
    // val extension: String?,

    // Seems to be an empty string
    // val role: String?,

    // The team-member id
    val teamId: String? = null,

    // Groups the user has access to (at time of development this was `DGG_Okta_OneRailNonProd_GM`)
    // val groups: String?,

    // User identifier, e.g. `ivan.ivanov`
    val userId: String? = null,

    // User name such as `Ivan Ivanov`
    val userName: String? = null,

    // Seems to be the email
    // val oauth: String?,

    // The store id
    val location: String? = null,

    // A JSON string with other attributes (see InternalLauncherSessionExtendedAttributes below)
    val extendedAttributes: String? = null
)

@Serializable
internal data class InternalLauncherSessionExtendedAttributes(
    val idToken: String,
    val accessToken: String,
    val refreshToken: String,
    val deviceSecret: String,
    val tokenExpirationTime: String,

    // val at_hash: String?,
    // val sub: String?,
    // val amr: String?,
    // val iss: String?,
    // val preferred_username: String?,
    // val sid: String?,
    // val uid: String?,
    // val auth_time: String?,
    // val exp: String?,
    // val iat: String?,
    // val jti: String?,
    // val email: String?,
    // val scp: String?,
    // val ver: String?,
    // val tokenRefreshClassName: String?,
    // val ds_hash: String?,
    // val groups: String?,
    // val nonce: String?,
    // val aud: String?,
    // val idp: String?,
    // val name: String?,
    // val clockInStatus: String?,
    // val cid: String?,
)

class BluefletchLauncher(
    private val context: Context
) {
    var currentSession: LauncherSession? = null
        private set

    private val jsonFormat = Json { ignoreUnknownKeys = true }

    suspend fun readSession() = withContext(Dispatchers.IO) {
        context.contentResolver.query(
            Uri.parse("content://com.bluefletch.launcherprovider/session"),
            arrayOf("DATA"),
            null, null, null
        ).use { cursor ->
            if (cursor == null) {
                currentSession = null
                throw LauncherContentProviderError("Could not find the launcher content provider or it crashed")
            }

            cursor.moveToPosition(0)

            val dataColumn = cursor.getColumnIndex("DATA")
            if (dataColumn == -1) {
                throw LauncherContentProviderError("No column named `DATA`")
            }

            val json = cursor.getString(dataColumn)
            if (json == null || json == "null") {
                currentSession = null
                throw MissingLauncherSession()
            }

            return@use parseSessionInfo(json)
                .also { currentSession = it }
        }
    }

    private fun parseSessionInfo(json: String): LauncherSession {
        val session = jsonFormat.decodeFromString<InternalLauncherSession>(json)

        if (session.userId.isNullOrEmpty()) {
            throw NotLoggedIn()
        }

        if (session.extendedAttributes == null) {
            throw LauncherContentProviderError("Missing extendedAttributes key")
        }

        val extendedAttributes = jsonFormat.decodeFromString<InternalLauncherSessionExtendedAttributes>(session.extendedAttributes)

        return LauncherSession(
            userId = session.userId,
            userName = session.userName ?: throw LauncherContentProviderError("Missing userName"),
            teamMemberId = session.teamId ?: throw LauncherContentProviderError("Missing teamId"),
            location = session.location ?: throw LauncherContentProviderError("Missing location"),
            extendedAttributes = LauncherSessionExtendedAttributes(
                idToken = extendedAttributes.idToken,
                accessToken = extendedAttributes.accessToken,
                refreshToken = extendedAttributes.refreshToken,
                deviceSecret = extendedAttributes.deviceSecret
            )
        )
    }
}