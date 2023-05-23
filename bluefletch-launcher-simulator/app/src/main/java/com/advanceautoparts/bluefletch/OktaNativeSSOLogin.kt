package com.advanceautoparts.bluefletch

import android.app.Activity
import android.content.Intent
import com.okta.oidc.AuthorizationStatus
import com.okta.oidc.OIDCConfig
import com.okta.oidc.Okta
import com.okta.oidc.ResultCallback
import com.okta.oidc.storage.SharedPreferenceStorage
import com.okta.oidc.util.AuthorizationException

class OktaNativeSSOLogin(private val activity: Activity) {
    private val config = OIDCConfig.Builder()
        .clientId("0oayqvdqu0LnsoRWl0h7")
        .redirectUri("com.bluefletch.launcher:/callback")
        .endSessionRedirectUri("com.bluefletch.launcher:/logout")
        .scopes("openid", "device_sso", "offline_access")
        .discoveryUri("https://advanceauto.oktapreview.com/oauth2/aus1lqs5cuniao55d0h8")
        .create()

    private val webClient = Okta.WebAuthBuilder()
        .withConfig(config)
        .withContext(activity.applicationContext)
        .withStorage(SharedPreferenceStorage(activity))
        .setRequireHardwareBackedKeyStore(false)
        .create()

    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        webClient.handleActivityResult(requestCode, resultCode, data)
    }

    fun registerCallback(callback: ResultCallback<AuthorizationStatus, AuthorizationException>) {
        webClient.registerCallback(callback, activity)
    }

    fun isAuthenticated() = webClient.sessionClient.isAuthenticated
    fun tokens() = webClient.sessionClient.tokens

    fun unregisterCallback() {
        webClient.unregisterCallback()
    }

    fun login() {
        webClient.signIn(activity, null)
    }

    fun logout() {
        // TODO: Sign out of Okta
        // TODO: Revoke tokens

        webClient.sessionClient.clear()
    }
}