package com.advanceautoparts.bluefletch

import android.app.Activity
import android.content.ComponentName
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager.ApplicationInfoFlags
import android.content.pm.PackageManager.ResolveInfoFlags
import android.content.pm.ResolveInfo
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.advanceautoparts.bluefletch.ui.theme.BlueFletchLauncherSimulatorTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            BlueFletchLauncherSimulatorTheme {
                // A surface container using the 'background' color from the theme
                Surface(modifier = Modifier.fillMaxSize(), color = Color.Transparent) {
                    Navigator(this)
                }
            }
        }
    }
}

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

@Composable
fun LoginScreen(onLogin: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Button(onClick = onLogin) {
            Text("Login")
        }
    }
}

data class LauncherActivity(
    val label: String,
    val resolveInfo: ResolveInfo
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onLogout: () -> Unit,
    onLogoutClearingBrowser: () -> Unit,
) {
    val context = LocalContext.current
    var activities by remember { mutableStateOf(emptyList<LauncherActivity>()) }

    LaunchedEffect(null) {
        val mainActivities = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }

        val queriedActivities = context.packageManager.queryIntentActivities(mainActivities, 0)
        activities = queriedActivities.map {
            val label = it.loadLabel(context.packageManager).toString()

            LauncherActivity(label, it)
        }
    }

    val launchActivity = { activity: LauncherActivity ->
        val componentName = ComponentName(
            activity.resolveInfo.activityInfo.packageName,
            activity.resolveInfo.activityInfo.name
        )

        context.startActivity(Intent(Intent.ACTION_MAIN).also {
            it.addCategory(Intent.CATEGORY_LAUNCHER)
            it.component = componentName
//            it.flags = Intent.FLAG_ACTIVITY_NEW_TASK.or(Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
        })
    }

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Hello, World!")

        LazyColumn(modifier = Modifier.weight(1f)) {
            items(activities) { activity ->
                Card(
                    modifier = Modifier
                        .padding(vertical = 4.dp, horizontal = 8.dp)
                        .clickable { launchActivity(activity) }
                ) {
                    Row(modifier = Modifier
                        .padding(12.dp)
                        .fillMaxWidth()) {
                        Text(activity.label)
                    }
                }
            }
        }

        Row(
            modifier = Modifier
                .padding(10.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            Button(onClick = onLogout) {
                Text("Logout")
            }

            Button(onClick = onLogoutClearingBrowser) {
                Text("Logout (with browser)")
            }
        }
    }
}

fun Context.getActivity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.getActivity()
    else -> null
}

//@Preview(showBackground = true)
//@Composable
//fun DefaultPreview() {
//    BlueFletchLauncherSimulatorTheme {
//        Greeting("Android")
//    }
//}