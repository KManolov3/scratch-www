package com.advanceautoparts.bluefletch

import android.app.Application

class MainApplication: Application() {
    companion object {
        lateinit var current: MainApplication
    }

    lateinit var okta: OktaNativeSSOLogin

    init { current = this }
}