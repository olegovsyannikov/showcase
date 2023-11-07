package one.getsober.soberone

import com.getcapacitor.Plugin
import io.intercom.android.sdk.Intercom

class IntercomPlugin : Plugin() {
    override fun load() {
        Intercom.initialize(
                activity.application,
                BuildConfig.INTERCOM_API_KEY,
                BuildConfig.INTERCOM_APP_ID
        )
    }
}
