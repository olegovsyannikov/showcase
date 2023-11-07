package one.getsober.soberone

import com.getcapacitor.JSObject
import com.android.installreferrer.api.InstallReferrerClient
import com.android.installreferrer.api.InstallReferrerStateListener
import com.android.installreferrer.api.ReferrerDetails
import com.getcapacitor.Plugin
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks

class InstallReferrerPlugin : Plugin() {
    override fun load() {
        // Get install referrer information after the plugin is loaded
        getInstallReferrer()
    }

    private fun getInstallReferrer() {
        val referrerClient = InstallReferrerClient.newBuilder(context).build()
        referrerClient.startConnection(object : InstallReferrerStateListener {
            override fun onInstallReferrerSetupFinished(responseCode: Int) {
                when (responseCode) {
                    InstallReferrerClient.InstallReferrerResponse.OK -> {
                        // Connection established
                        val response: ReferrerDetails = referrerClient.installReferrer
                        val referrerUrl = response.installReferrer

                        // Do something with the install referrer
                        notifyListeners("installReferrerReceived", JSObject().put("referrerUrl", referrerUrl))
                    }
                    else -> {
                        // Connection failed
                    }
                }
            }

            override fun onInstallReferrerServiceDisconnected() {
                // Connection lost
            }
        })
    }
}
