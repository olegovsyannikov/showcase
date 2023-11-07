package one.getsober.soberone

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.google.firebase.dynamiclinks.FirebaseDynamicLinks

class FirebaseDynamicLinksPlugin : Plugin() {
    override fun load() {
        // Handle dynamic links after the plugin is loaded
        handleDynamicLink()
    }

    private fun handleDynamicLink() {
        FirebaseDynamicLinks.getInstance()
            .getDynamicLink(activity.intent)
            .addOnSuccessListener(activity) { pendingDynamicLinkData ->
                // Get deep link from result (may be null if no link is found)
                val deepLink = pendingDynamicLinkData?.link
                if (deepLink != null) {
                    // Do something with the deep link
                    notifyListeners("dynamicLinkReceived", JSObject().put("deepLink", deepLink.toString()))
                }
            }
            .addOnFailureListener(activity) {
                // Handle errors
            }
    }
}
