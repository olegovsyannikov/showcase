package one.getsober.soberone

import android.content.Intent
import android.util.Log
import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task

@CapacitorPlugin(requestCodes = [GoogleAuthPlugin.RC_GOOGLE_SIGN_IN])
class GoogleAuthPlugin : Plugin() {
    private var mGoogleSignInClient: GoogleSignInClient? = null

    companion object {
        const val RC_GOOGLE_SIGN_IN = 50001
    }

    override fun load() {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(BuildConfig.GOOGLE_SIGNIN_CLIENT_ID)
                .requestEmail()
                .build()
        mGoogleSignInClient = GoogleSignIn.getClient(activity.applicationContext, gso)
    }

    @PluginMethod
    fun googleSignIn(call: PluginCall?) {
        saveCall(call)
        val signInIntent = mGoogleSignInClient!!.signInIntent
        startActivityForResult(call, signInIntent, RC_GOOGLE_SIGN_IN)
    }

    override fun handleOnActivityResult(requestCode: Int, resultCode: Int, data: Intent) {
        super.handleOnActivityResult(requestCode, resultCode, data)

        val savedCall = savedCall ?: return

        if (requestCode == RC_GOOGLE_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            val ret = handleSignInResult(task)
            if (ret.has("success")) {
                savedCall.resolve(ret)
            } else {
                savedCall.reject("Can not get Google account")
            }
        }
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>): JSObject {
        val ret = JSObject()
        try {
            val account = completedTask.getResult(ApiException::class.java)
            if (account != null) {
                Log.d("S1", account.toString())
                ret.put("success", true)
                ret.put("token_id", account.idToken)
                ret.put("email", account.email)
                ret.put("client_id", BuildConfig.GOOGLE_SIGNIN_CLIENT_ID)
            }
        } catch (e: ApiException) {
            Log.d("S1", "signInResult:failed code=" + e.statusCode)
        }
        return ret
    }
}
