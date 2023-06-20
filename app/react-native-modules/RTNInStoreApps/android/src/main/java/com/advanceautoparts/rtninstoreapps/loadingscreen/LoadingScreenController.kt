package com.advanceautoparts.rtninstoreapps.loadingscreen

import android.app.Activity
import android.app.Dialog
import com.advanceautoparts.rtninstoreapps.R

class LoadingScreenController(private val activity: Activity) {
    private var dialog: Dialog? = null

    fun show() = activity.runOnUiThread {
        if (activity.isFinishing) {
            return@runOnUiThread
        }

        val dialog = Dialog(activity, R.style.SplashScreen_SplashTheme).apply {
            setContentView(R.layout.loading_screen)
            setCancelable(false)
        }

        dialog.show()

        this.dialog = dialog
    }

    fun hide() = activity.runOnUiThread {
        val dialog = this.dialog
        this.dialog = null

        if (dialog == null || !dialog.isShowing) return@runOnUiThread

        dialog.hide()
    }
}
