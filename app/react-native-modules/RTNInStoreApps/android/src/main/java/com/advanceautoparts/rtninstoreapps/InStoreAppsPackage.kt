package com.advanceautoparts.rtninstoreapps;

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class InStoreAppsPackage : TurboReactPackage() {
  override fun getModule(name: String?, reactContext: ReactApplicationContext): NativeModule? =
    if (name == InStoreAppsModule.NAME) {
      InStoreAppsModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      InStoreAppsModule.NAME to ReactModuleInfo(
        InStoreAppsModule.NAME,
        InStoreAppsModule.NAME,
        false, // canOverrideExistingModule
        true, // needsEagerInit
        true, // hasConstants
        false, // isCxxModule
        true // isTurboModule
      )
    )
  }
}
