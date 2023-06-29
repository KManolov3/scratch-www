package com.advanceautoparts.bluefletch

import android.app.Activity
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.advanceautoparts.bluefletch.provider.AuthProvider
import com.advanceautoparts.bluefletch.ui.screens.HomeScreen
import com.advanceautoparts.bluefletch.ui.screens.LoginScreen
import kotlinx.coroutines.launch

@Composable
fun Navigator(activity: Activity) {
    val controller = rememberNavController()

    LaunchedEffect(null) {
        if (AuthProvider.current.okta.isAuthenticated()) controller.navigate("home")
    }

    val scope = rememberCoroutineScope()

    val logout = { clearBrowser: Boolean ->
        scope.launch {
            AuthProvider.current.okta.logout(activity, clearBrowserLogin = clearBrowser)
            controller.navigate("require-login")
        }
    }

    NavHost(navController = controller, startDestination = "require-login", modifier = Modifier.fillMaxSize()) {
        composable("require-login") {
            LoginScreen {
                scope.launch {
                    AuthProvider.current.okta.login(activity)
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