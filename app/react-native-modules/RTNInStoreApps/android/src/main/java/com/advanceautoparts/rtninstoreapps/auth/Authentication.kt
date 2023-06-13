package com.advanceautoparts.rtninstoreapps.auth

import com.advanceautoparts.rtninstoreapps.BluefletchLauncher
import com.advanceautoparts.rtninstoreapps.LauncherSession
import com.okta.authfoundation.AuthFoundationDefaults
import com.okta.authfoundation.client.*
import com.okta.authfoundation.credential.Credential
import com.okta.authfoundation.credential.CredentialDataSource.Companion.createCredentialDataSource
import com.okta.authfoundation.credential.Token
import com.okta.authfoundation.jwt.JwtParser
import com.okta.authfoundationbootstrap.CredentialBootstrap
import com.okta.oauth2.TokenExchangeFlow.Companion.createTokenExchangeFlow
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import okhttp3.HttpUrl.Companion.toHttpUrl

data class AuthConfig(
    val clientId: String,
    val authServerURL: String
)

open class AuthError(val name: String, message: String) : Exception(message)
class MissingRefreshToken : AuthError("MissingRefreshToken", "Missing refresh token when obtaining tokens")

class Authentication(
    val launcher: BluefletchLauncher,
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

    suspend fun requestTokens(): LauncherSession {
        val session = launcher.readSession()
        val token = performTokenExchange(session.extendedAttributes.idToken, session.extendedAttributes.deviceSecret)

        if (token.refreshToken == null) throw MissingRefreshToken()

        return session
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