package com.advanceautoparts.bluefletch

import android.app.Activity
import com.okta.authfoundation.AuthFoundationDefaults
import com.okta.authfoundation.client.OidcClient
import com.okta.authfoundation.client.OidcConfiguration
import com.okta.authfoundation.client.SharedPreferencesCache
import com.okta.authfoundation.credential.CredentialDataSource.Companion.createCredentialDataSource
import com.okta.authfoundation.credential.Token
import com.okta.authfoundationbootstrap.CredentialBootstrap
import com.okta.webauthenticationui.WebAuthenticationClient
import com.okta.webauthenticationui.WebAuthenticationClient.Companion.createWebAuthenticationClient
import okhttp3.HttpUrl.Companion.toHttpUrl

class OktaNativeSSOLogin(private val activity: Activity) {
    private val oidcClient: OidcClient
    private val webClient: WebAuthenticationClient

    init {
        AuthFoundationDefaults.cache = SharedPreferencesCache.create(activity.applicationContext)

        oidcClient = OidcClient.createFromDiscoveryUrl(
            OidcConfiguration(
                clientId = "0oayqvdqu0LnsoRWl0h7",
                defaultScope = "openid device_sso offline_access"
            ),
            "https://advanceauto.oktapreview.com/oauth2/aus1lqs5cuniao55d0h8/.well-known/openid-configuration".toHttpUrl()
        )

        CredentialBootstrap.initialize(oidcClient.createCredentialDataSource(activity.applicationContext))

        webClient = CredentialBootstrap.oidcClient.createWebAuthenticationClient()
    }

    suspend fun isAuthenticated() = defaultCredential().token != null

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
            credential.revokeAllTokens().getOrThrow()
        }

        credential.delete()
    }

    private suspend fun defaultCredential() = CredentialBootstrap.defaultCredential()
}