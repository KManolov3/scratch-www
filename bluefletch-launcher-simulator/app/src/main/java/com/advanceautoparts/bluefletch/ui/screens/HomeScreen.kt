package com.advanceautoparts.bluefletch.ui.screens

import android.content.ComponentName
import android.content.Intent
import android.content.pm.ResolveInfo
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.advanceautoparts.bluefletch.provider.AuthProvider

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
    var storeNumber by remember { mutableStateOf(AuthProvider.current.currentStoreNumber()) }

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
        })
    }

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Row(modifier = Modifier.padding(10.dp).fillMaxWidth()) {
            TextField(
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Store Number") },
                value = storeNumber,
                onValueChange = {
                    storeNumber = it
                    AuthProvider.current.setCurrentStoreNumber(it)
                }
            )
        }

        LazyColumn(modifier = Modifier.weight(1f)) {
            items(activities) { activity ->
                Card(
                    modifier = Modifier
                        .padding(vertical = 4.dp, horizontal = 8.dp)
                        .clickable { launchActivity(activity) }
                ) {
                    Row(
                        modifier = Modifier
                            .padding(12.dp)
                            .fillMaxWidth()
                    ) {
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