package com.advanceautoparts.bluefletch

import android.app.Application

class MainApplication: Application() {
    companion object {
        lateinit var current: MainApplication
            private set
    }

    lateinit var okta: OktaNativeSSOLogin
        private set

    override fun onCreate() {
        current = this
        okta = OktaNativeSSOLogin(applicationContext)

        super.onCreate()
    }
}