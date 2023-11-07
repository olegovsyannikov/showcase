package one.getsober.soberone

import android.content.pm.ApplicationInfo
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.util.TypedValue
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.RelativeLayout
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    var reloadButton: Button? = null
    var isReloadButtonPressed: Boolean = false

    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (0 != applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) {
            WebView.setWebContentsDebuggingEnabled(true)
        }
        this.bridge.webView.webViewClient = MyAppWebViewClient()

        registerPlugin(IntercomPlugin::class.java)
        registerPlugin(AmplitudePlugin::class.java)
        registerPlugin(FirebaseDynamicLinksPlugin::class.java)
        registerPlugin(InstallReferrerPlugin::class.java)

        Handler(Looper.getMainLooper()).postDelayed({
            addReloadButton()
        }, 0) // Delay of 3 seconds
    }

    private fun addReloadButton() {
        // Get the root view
        val rootView = findViewById<ViewGroup>(android.R.id.content)

        // Create a new RelativeLayout
        val relativeLayout = RelativeLayout(this)

        // Create new button
        reloadButton = Button(this)
        reloadButton?.id = View.generateViewId() // Assign a unique ID to the button
        reloadButton?.text = "Reload"

        // Set its parameters
        val params = RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.WRAP_CONTENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT,
        )
        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM)
        params.addRule(RelativeLayout.ALIGN_PARENT_LEFT)
        params.setMargins(100,0,0,100)
        reloadButton?.layoutParams = params

        // Set button style
        reloadButton?.apply {
            setBackgroundColor(Color.WHITE) // sets the background color of the button
            setTextColor(Color.GRAY) // sets the text color of the button

            // Create a GradientDrawable to act as a border
            val border = GradientDrawable()
            border.setColor(Color.WHITE) // sets the background color of the border
            border.setStroke(5, Color.GRAY) // sets the width and color of the border
            border.cornerRadius = 20f // sets the corner radius of the border

            background = border // applies the border to the button

            setPadding(40, 20, 40, 20)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 16f)
        }

        // Set the onClick listener
        reloadButton?.setOnClickListener {
            MainActivity@this.bridge.reload()
            isReloadButtonPressed = true
        }

        // Add the button to the RelativeLayout
        relativeLayout.addView(reloadButton)

        // Add the RelativeLayout to the root view
        rootView.addView(relativeLayout)
    }

    private inner class MyAppWebViewClient : WebViewClient() {
        override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
            isReloadButtonPressed = false
        }
        override fun onPageFinished(view: WebView, url: String) {
            // Check if the button is already added
            if (reloadButton?.parent != null && !isReloadButtonPressed) {
                // The page has finished loading, hide the button
                reloadButton?.visibility = View.GONE
            }
        }
    }
}
