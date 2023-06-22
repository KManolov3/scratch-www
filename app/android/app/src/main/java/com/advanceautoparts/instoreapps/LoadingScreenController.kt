package com.advanceautoparts.instoreapps

import android.app.Activity
import android.app.Dialog

class LoadingScreenController(
    private val activity: Activity
) {
    private var dialog: Dialog? = null

    fun show() = activity.runOnUiThread {
        if (activity.isFinishing) {
            return@runOnUiThread
        }

        val dialog = Dialog(activity, R.style.LoadingScreenTheme).apply {
            setContentView(R.layout.loading_screen)
            setCancelable(false)
        }

        dialog.show()
        activity.setTheme(R.style.AppTheme)

        this.dialog = dialog
    }

    fun hide() = activity.runOnUiThread {
        val dialog = this.dialog
        this.dialog = null

        if (dialog == null || !dialog.isShowing) return@runOnUiThread

        dialog.hide()
    }
}
