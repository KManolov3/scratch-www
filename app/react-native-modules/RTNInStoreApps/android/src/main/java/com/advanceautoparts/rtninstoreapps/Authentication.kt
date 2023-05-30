package com.advanceautoparts.rtninstoreapps

import android.content.Context
import android.net.Uri
import com.okta.authfoundation.AuthFoundationDefaults
import com.okta.authfoundation.client.*
import com.okta.authfoundation.credential.Credential
import com.okta.authfoundation.credential.CredentialDataSource
import com.okta.authfoundation.credential.CredentialDataSource.Companion.createCredentialDataSource
import com.okta.authfoundation.credential.Token
import com.okta.authfoundationbootstrap.CredentialBootstrap
import com.okta.oauth2.TokenExchangeFlow
import com.okta.oauth2.TokenExchangeFlow.Companion.createTokenExchangeFlow
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import okhttp3.HttpUrl.Companion.toHttpUrl

@Serializable
data class LauncherTokens(
    val userId: String?,
    val userName: String?,
    val idToken: String,
    val accessToken: String,
    val refreshToken: String,
    val deviceSecret: String
)

data class AppTokens(
    val accessToken: String,
    val refreshToken: String
)

data class AuthConfig(
    val clientId: String,
    val authServerURL: String
)

class Authentication(
    val context: Context,
    val config: AuthConfig
) {
    init {
        AuthFoundationDefaults.cache = SharedPreferencesCache.create(context.applicationContext)
        val oidcConfiguration = OidcConfiguration(
            clientId = config.clientId,
            defaultScope = "openid email profile offline_access",
        )
        val client = OidcClient.createFromDiscoveryUrl(
            oidcConfiguration,
            "${config.authServerURL.trimEnd('/')}/.well-known/openid-configuration".toHttpUrl(),
        )
        CredentialBootstrap.initialize(client.createCredentialDataSource(context.applicationContext))
    }

    suspend fun obtainToken(): AppTokens? {
        val launcherTokens = readLauncherTokens() ?: return null

        // TODO: Confirm these don't expire
        val appToken = performTokenExchange(launcherTokens.idToken, launcherTokens.deviceSecret)

        return AppTokens(
            accessToken = appToken.accessToken,

            // TODO: Throw error if not present
            refreshToken = appToken.refreshToken ?: return null
        )
    }

    private suspend fun performTokenExchange(idToken: String, deviceSecret: String): Token {
        val credentialDataSource: CredentialDataSource = CredentialBootstrap.credentialDataSource
        val tokenExchangeCredential: Credential = credentialDataSource.createCredential()
        val tokenExchangeFlow: TokenExchangeFlow = CredentialBootstrap.oidcClient.createTokenExchangeFlow()
        val token = tokenExchangeFlow.start(idToken, deviceSecret, "MobileDevice", "base offline_access").getOrThrow()

        tokenExchangeCredential.storeToken(token)

        return token
    }

    // TODO: Make this a suspend function and do this asynchronously
    private fun readLauncherTokens(): LauncherTokens? {
        context.contentResolver.query(
            Uri.parse("content://com.bluefletch.launcherprovider/session"),
            arrayOf("DATA"),
            null, null, null
        ).use { cursor ->
            // TODO: Error here that the launcher is not configured
            if (cursor == null) return null

            cursor.moveToPosition(0)
            val json = cursor.getString(0)

            // TODO: Error here that tokens don't exist
            if (json == null || json == "null") return null

            return Json.decodeFromString<LauncherTokens>(json)
        }
    }
}