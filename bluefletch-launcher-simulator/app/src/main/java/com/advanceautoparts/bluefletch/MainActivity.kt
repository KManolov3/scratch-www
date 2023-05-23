package com.advanceautoparts.bluefletch

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.advanceautoparts.bluefletch.ui.theme.BlueFletchLauncherSimulatorTheme
import com.okta.oidc.AuthorizationStatus
import com.okta.oidc.ResultCallback
import com.okta.oidc.util.AuthorizationException

class MainActivity : ComponentActivity() {
    private lateinit var okta: OktaNativeSSOLogin

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        okta = OktaNativeSSOLogin(this)

        setContent {
            BlueFletchLauncherSimulatorTheme {
                // A surface container using the 'background' color from the theme
                Surface(modifier = Modifier.fillMaxSize(), color = Color.Transparent) {
//                    Greeting("Android")

                    Navigator(okta)
                }
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        okta.onActivityResult(requestCode, resultCode, data)

        super.onActivityResult(requestCode, resultCode, data)
    }
}

@Composable
fun Navigator(okta: OktaNativeSSOLogin) {
    val controller = rememberNavController()
    val context = rememberUpdatedState(LocalContext.current)

    DisposableEffect(okta) {
        okta.registerCallback(object : ResultCallback<AuthorizationStatus, AuthorizationException> {
            override fun onSuccess(result: AuthorizationStatus) {
                // TODO: Use scaffold for this?
                Toast.makeText(context.value, "Logged in", Toast.LENGTH_SHORT).show()

                controller.navigate("home")
            }

            override fun onCancel() {
                Toast.makeText(context.value, "Cancelled logging in", Toast.LENGTH_SHORT).show()

                controller.navigate("require-login")
            }

            override fun onError(message: String?, exception: AuthorizationException?) {
                Toast.makeText(context.value, "Error logging in: $message", Toast.LENGTH_SHORT).show()

                controller.navigate("require-login")
            }
        })

        onDispose { okta.unregisterCallback() }
    }

    val initialRoute =
        if (okta.isAuthenticated()) "home"
        else "require-login"

    NavHost(navController = controller, startDestination = initialRoute, modifier = Modifier.fillMaxSize()) {
        composable("require-login") {
            LoginScreen { okta.login() }
        }

        composable("home") {
            HomeScreen(
                onLogout = {
                    okta.logout()
                    controller.navigate("require-login")
                }
            )
        }
    }
}

@Composable
fun LoginScreen(onLogin: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Button(onClick = onLogin) {
            Text("Login")
        }
    }
}

@Composable
fun HomeScreen(onLogout: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Text("Hello, World!")

        Spacer(modifier = Modifier.weight(1f))

        Button(onClick = onLogout) {
            Text("Logout")
        }
    }
}

//@Preview(showBackground = true)
//@Composable
//fun DefaultPreview() {
//    BlueFletchLauncherSimulatorTheme {
//        Greeting("Android")
//    }
//}