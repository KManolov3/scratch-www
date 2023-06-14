package com.advanceautoparts.bluefletch

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import com.okta.authfoundation.AuthFoundationDefaults
import com.okta.authfoundation.claims.*
import com.okta.authfoundation.client.OidcClient
import com.okta.authfoundation.client.OidcConfiguration
import com.okta.authfoundation.client.SharedPreferencesCache
import com.okta.authfoundation.credential.CredentialDataSource.Companion.createCredentialDataSource
import com.okta.authfoundation.credential.RevokeAllException
import com.okta.authfoundation.credential.Token
import com.okta.authfoundationbootstrap.CredentialBootstrap
import com.okta.webauthenticationui.WebAuthenticationClient
import com.okta.webauthenticationui.WebAuthenticationClient.Companion.createWebAuthenticationClient
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import okhttp3.HttpUrl.Companion.toHttpUrl

/**
 * If the user is not logged in, the format is `{"extension":"","role":"","groups":"*","location":"501","userName":"","userId":""}`
 */
@Serializable
data class InternalLauncherSession(
    // Seems to be an empty string
    val extension: String?,

    // Seems to be an empty string
    val role: String?,

    // The team-member id
    val teamId: String? = null,

    // Groups the user has access to (at time of development this was `DGG_Okta_OneRailNonProd_GM`)
    val groups: String?,

    // User identifier, e.g. `ivan.ivanov`
    val userId: String? = null,

    // User name such as `Ivan Ivanov`
    val userName: String? = null,

    // The store id
    val location: String? = null,

    // A JSON string with other attributes (see InternalLauncherSessionExtendedAttributes below)
    val extendedAttributes: String? = null
)

@Serializable
data class InternalLauncherSessionExtendedAttributes(
    val idToken: String,
    val accessToken: String,
    val refreshToken: String,
    val deviceSecret: String,
    val tokenExpirationTime: String,
)

class OktaNativeSSOLogin(appContext: Context) {
    private val oidcClient: OidcClient
    private val webClient: WebAuthenticationClient

    init {
        AuthFoundationDefaults.cache = SharedPreferencesCache.create(appContext)

        oidcClient = OidcClient.createFromDiscoveryUrl(
            OidcConfiguration(
                clientId = "0oayqvdqu0LnsoRWl0h7",
                defaultScope = "openid profile email device_sso offline_access"
            ),
            "https://advanceauto.oktapreview.com/oauth2/aus1lqs5cuniao55d0h8/.well-known/openid-configuration".toHttpUrl()
        )

        CredentialBootstrap.initialize(oidcClient.createCredentialDataSource(appContext))

        webClient = CredentialBootstrap.oidcClient.createWebAuthenticationClient()
    }

    private suspend fun defaultCredential() = CredentialBootstrap.defaultCredential()

    suspend fun isAuthenticated() = defaultCredential().token != null
    suspend fun session(location: String?): InternalLauncherSession? {
        val credential = defaultCredential()
        val token = credential.token ?: return null
        val idToken = credential.idToken() ?: return null

        return InternalLauncherSession(
            userId = idToken.email?.replace(Regex("@.*"), "")!!,
            userName = idToken.name,
            location = location,
            extension = "",
            groups = "DGG_Okta_OneRailNonProd_GM",
            role = "",
            teamId = "1234",
            extendedAttributes = Json.encodeToString(InternalLauncherSessionExtendedAttributes(
                idToken = token.idToken!!,
                accessToken = token.accessToken,
                refreshToken = token.refreshToken!!,
                deviceSecret = token.deviceSecret!!,
                tokenExpirationTime = idToken.expirationTime.toString()
            ))
        )
    }

    suspend fun login(activity: Activity): Token {
        val token = webClient.login(activity, "com.bluefletch.launcher:/callback").getOrThrow()

        defaultCredential().storeToken(token)

        return token
    }

    suspend fun logout(activity: Activity, clearBrowserLogin: Boolean) {
        val credential = defaultCredential()
        val idToken = credential.token?.idToken

        if (clearBrowserLogin && idToken != null) {
            webClient.logoutOfBrowser(activity, "com.bluefletch.launcher:/logout", idToken)
        } else {
            try {
                credential.revokeAllTokens().getOrThrow()
            } catch (error: RevokeAllException) {
                // Could not revoke tokens
            }
        }

        credential.delete()
    }
}