package one.getsober.soberone

import com.amplitude.api.Amplitude
import com.getcapacitor.Plugin

class AmplitudePlugin : Plugin() {
    override fun load() {
        Amplitude
                .getInstance()
                .initialize(activity.applicationContext, BuildConfig.AMPLITUDE_KEY)
                .enableForegroundTracking(activity.application)
                .enableCoppaControl()
    }
}
