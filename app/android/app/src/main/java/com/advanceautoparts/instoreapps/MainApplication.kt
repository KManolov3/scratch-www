package com.advanceautoparts.instoreapps

import android.app.Application
import android.content.ComponentName
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.startup.AppInitializer
import androidx.startup.InitializationProvider
import androidx.startup.Initializer
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {
    private val mReactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport() = BuildConfig.DEBUG

        override fun getPackages(): List<ReactPackage> {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            return PackageList(this).packages
        }

        override fun getJSMainModuleName() = "index"

        override val isNewArchEnabled = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled = BuildConfig.IS_HERMES_ENABLED
    }

    override fun getReactNativeHost() = mReactNativeHost

    override fun onCreate() {
        manuallyTriggerAndroidXInitializers()

        super.onCreate()

        SoLoader.init(this,  /* native exopackage */false)

        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
        }

        ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
    }

    /**
     * # Short story
     *
     * Okta and a couple of other libraries (androidx stuff) use this initialization method.
     * However, our setup doesn't support it so we have to initialize manually.
     *
     * # Long story
     *
     * The <provider> element in AndroidManifest.xml is used to define content providers. These are classes which allow one process to
     * expose CRUD operations to another via a special URI (e.g. `content://some.unique.name/some/path`).
     * These content providers are initialized with *the main app process* as singletons within that process.
     * The main app process is the one that is named with the app package name (in our case `com.advanceautoparts.instoreapps`).
     *
     * `androidx.startup.InitializationProvider` is a content provider that is not exported (doesn't actually
     * provide any operations to the outside of the current app. It is only used as a trigger to run initialization code (so it only has
     * its `onCreate` method implemented). The idea is that it is a place where code can be run on app startup.
     *
     * Libraries register their initialization code with the InitializationProvider by adding their Initializer classes as `<meta-data>`
     * children elements of this `<provider>` element. See https://developer.android.com/topic/libraries/app-startup#manifest-entries .
     * These additions to the manifest happen automatically and are not directly visible in our AndroidManifest file. You can see them
     * in the final manifest (`app/build/intermediates/merged_manifests/debug/AndroidManifest.xml`) if you remove the `<provider>` below.
     *
     * HOWEVER, in our case this `<provider>` is not initialized because we don't use the app main process. We don't have one as every
     * activity we define lives in a separate process (defined through `android:process`). So there is no single main app process.
     * So the provider doesn't run => the initialization does not happen.
     *
     * Because of the above, we run the initializers manually below.
     */
    private fun manuallyTriggerAndroidXInitializers() {
        val initializer = AppInitializer.getInstance(this)
        val providerMetadata = providerMetadataFor(InitializationProvider::class.java)

        providerMetadata.keySet()
            .filter { providerMetadata.getString(it) == "androidx.startup" }
            .forEach {
                val klass = Class.forName(it)

                if (Initializer::class.java.isAssignableFrom(klass)) {
                    @Suppress("UNCHECKED_CAST")
                    initializer.initializeComponent(klass as Class<out Initializer<Any>>)
                }
            }
    }

    private fun providerMetadataFor(klass: Class<*>): Bundle {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            packageManager
                .getProviderInfo(
                    ComponentName(packageName, klass.name),
                    PackageManager.ComponentInfoFlags.of(PackageManager.GET_META_DATA.toLong())
                )
        } else {
            @Suppress("DEPRECATION")
            packageManager
                .getProviderInfo(
                    ComponentName(packageName, klass.name),
                    PackageManager.GET_META_DATA
                )
        }.metaData
    }
}