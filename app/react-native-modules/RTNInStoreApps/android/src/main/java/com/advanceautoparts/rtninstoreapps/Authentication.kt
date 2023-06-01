package com.advanceautoparts.rtninstoreapps

import android.content.Context
import android.net.Uri
import com.okta.authfoundation.AuthFoundationDefaults
import com.okta.authfoundation.client.*
import com.okta.authfoundation.credential.Credential
import com.okta.authfoundation.credential.CredentialDataSource.Companion.createCredentialDataSource
import com.okta.authfoundation.credential.Token
import com.okta.authfoundation.credential.TokenStorage
import com.okta.authfoundation.jwt.JwtParser
import com.okta.authfoundationbootstrap.CredentialBootstrap
import com.okta.oauth2.TokenExchangeFlow.Companion.createTokenExchangeFlow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.SerialName
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

data class AuthConfig(
    val clientId: String,
    val authServerURL: String
)

class InMemoryOktaTokenStorage : TokenStorage {
    private val tokens = mutableMapOf<String, TokenStorage.Entry>()

    override suspend fun add(id: String) {
        tokens[id] = TokenStorage.Entry(id, null, emptyMap())
    }

    override suspend fun entries() = tokens.values.toList()

    override suspend fun remove(id: String) {
        tokens.remove(id)
    }

    override suspend fun replace(updatedEntry: TokenStorage.Entry) {
        tokens[updatedEntry.identifier] = updatedEntry
    }
}

open class AuthError(message: String) : Exception(message)
class LauncherContentProviderError : AuthError("Could not find the launcher content provider or it crashed")
class MissingLauncherTokens : AuthError("Missing launcher tokens - maybe the app is run outside of launcher?")
class UnauthorizedForInventoryApps : AuthError("The user is not authorized to access the inventory applications")
class MissingRefreshToken : AuthError("Missing refresh token when obtaining tokens")

class Authentication(
    val context: Context,
    val config: AuthConfig
) {
    private val storage = InMemoryOktaTokenStorage()
    private var credential: Credential? = null
    private val client: OidcClient

    init {
        val oidcConfiguration = OidcConfiguration(
            clientId = config.clientId,
            defaultScope = "openid email profile offline_access",
        )

        client = OidcClient.createFromDiscoveryUrl(
            oidcConfiguration,
            "${config.authServerURL.trimEnd('/')}/.well-known/openid-configuration".toHttpUrl(),
        )
        CredentialBootstrap.initialize(client.createCredentialDataSource(storage))
    }

    suspend fun cleanTokens() {
        // TODO: Revoke or just forget?
        credential?.delete()
        credential = null
    }

    suspend fun requestTokens() {
        val launcherTokens = readLauncherTokens()
        val token = performTokenExchange(launcherTokens.idToken, launcherTokens.deviceSecret)

        if (token.refreshToken == null) throw MissingRefreshToken()
    }

    suspend fun currentValidAccessToken(): String? {
        return getValidAccessToken() ?: run {
            requestTokens()
            getValidAccessToken()
        }
    }

    @Serializable
    private class TokenExpiresAtPayload(
        @SerialName("exp") val expiresAt: Long,
    )

    private suspend fun currentCredential() = this.credential ?: run {
        val credential = CredentialBootstrap.credentialDataSource.createCredential()
        this.credential = credential
        credential
    }

    private suspend fun performTokenExchange(idToken: String, deviceSecret: String): Token {
        val tokenExchangeFlow = CredentialBootstrap.oidcClient.createTokenExchangeFlow()
        val token = tokenExchangeFlow.start(idToken, deviceSecret, "MobileDevice", "base offline_access").getOrThrow()

        currentCredential().storeToken(token)

        return token
    }

    private suspend fun readLauncherTokens() = withContext(Dispatchers.IO) {
        context.contentResolver.query(
            Uri.parse("content://com.bluefletch.launcherprovider/session"),
            arrayOf("DATA"),
            null, null, null
        ).use { cursor ->
            if (cursor == null) throw LauncherContentProviderError()

            cursor.moveToPosition(0)
            val json = cursor.getString(0)

            if (json == null || json == "null") throw MissingLauncherTokens()

            return@withContext Json.decodeFromString<LauncherTokens>(json)
        }
    }

    private suspend fun getValidAccessToken(): String? {
        val credential = this.credential ?: return null
        val token = credential.token ?: return null

        val accessToken = try {
            val parser = JwtParser.create()
            parser.parse(token.accessToken)
        } catch (e: Exception) {
            // The token was malformed.
            return null
        }

        val payload = try {
            accessToken.deserializeClaims(TokenExpiresAtPayload.serializer())
        } catch (e: Exception) {
            // Failed to parse access token JWT.
            return null
        }

        if (payload.expiresAt > AuthFoundationDefaults.clock.currentTimeEpochSecond()) {
            return token.accessToken
        }

        return credential.refreshToken().getOrThrow().accessToken
    }
}