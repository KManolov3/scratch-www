package com.advanceautoparts.bluefletch

import android.app.Activity
import com.okta.authfoundation.AuthFoundationDefaults
import com.okta.authfoundation.claims.preferredUsername
import com.okta.authfoundation.claims.userId
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
import okhttp3.HttpUrl.Companion.toHttpUrl

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

class OktaNativeSSOLogin(private val activity: Activity) {
    companion object {
        private suspend fun defaultCredential() = CredentialBootstrap.defaultCredential()

        suspend fun isAuthenticated() = defaultCredential().token != null
        suspend fun session(location: String?): LauncherSession? {
            val credential = defaultCredential()
            val token = credential.token ?: return null
            val idToken = credential.idToken() ?: return null

            return LauncherSession(
                userId = idToken.userId,
                userName = idToken.preferredUsername,
                location = location,
                extendedAttributes = LauncherSessionExtendedAttributes(
                    idToken = token.idToken!!,
                    accessToken = token.accessToken,
                    refreshToken = token.refreshToken!!,
                    deviceSecret = token.deviceSecret!!,
                )
            )
        }
    }

    private val oidcClient: OidcClient
    private val webClient: WebAuthenticationClient

    init {
        AuthFoundationDefaults.cache = SharedPreferencesCache.create(activity.applicationContext)

        oidcClient = OidcClient.createFromDiscoveryUrl(
            OidcConfiguration(
                clientId = "0oayqvdqu0LnsoRWl0h7",
                defaultScope = "openid profile email device_sso offline_access"
            ),
            "https://advanceauto.oktapreview.com/oauth2/aus1lqs5cuniao55d0h8/.well-known/openid-configuration".toHttpUrl()
        )

        CredentialBootstrap.initialize(oidcClient.createCredentialDataSource(activity.applicationContext))

        webClient = CredentialBootstrap.oidcClient.createWebAuthenticationClient()
    }

    suspend fun login(): Token {
        val token = webClient.login(activity, "com.bluefletch.launcher:/callback").getOrThrow()

        defaultCredential().storeToken(token)

        return token
    }

    suspend fun logout(clearBrowserLogin: Boolean) {
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