package com.advanceautoparts.bluefletch

import android.app.Activity
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.advanceautoparts.bluefletch.ui.screens.HomeScreen
import com.advanceautoparts.bluefletch.ui.screens.LoginScreen
import kotlinx.coroutines.launch

@Composable
fun Navigator(activity: Activity) {
    val controller = rememberNavController()
    val okta = remember { OktaNativeSSOLogin(activity) }

    LaunchedEffect(null) {
        if (OktaNativeSSOLogin.isAuthenticated()) controller.navigate("home")
    }

    val scope = rememberCoroutineScope()

    val logout = { clearBrowser: Boolean ->
        scope.launch {
            okta.logout(clearBrowserLogin = clearBrowser)
            controller.navigate("require-login")
        }
    }

    NavHost(navController = controller, startDestination = "require-login", modifier = Modifier.fillMaxSize()) {
        composable("require-login") {
            LoginScreen {
                scope.launch {
                    okta.login()
                    controller.navigate("home")
                }
            }
        }

        composable("home") {
            HomeScreen(
                onLogout = { logout(false) },
                onLogoutClearingBrowser = { logout(true) }
            )
        }
    }
}