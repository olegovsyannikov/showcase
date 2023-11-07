import UIKit
import WebKit
import Intercom
import GoogleSignIn
import SwiftyVK
import AuthenticationServices
import Capacitor
import Amplitude
import AppsFlyerLib
import FacebookCore

// class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate, WKScriptMessageHandler {
class ViewController: CAPBridgeViewController, WKScriptMessageHandler, WKUIDelegate, WKNavigationDelegate {
    override func capacitorDidLoad() {
        // super.loadView()
        //let webConfiguration = WKWebViewConfiguration()
        // Init JS Handler
        //let contentController = WKUserContentController()

        webView!.configuration.userContentController.add(self, name: "intercomShow")
        webView!.configuration.userContentController.add(self, name: "intercomRegisterUser")
        webView!.configuration.userContentController.add(self, name: "onesignalSetExternalUserId")
        webView!.configuration.userContentController.add(self, name: "intercomTrackEvent")
        webView!.configuration.userContentController.add(self, name: "intercomUpdateUser")
        webView!.configuration.userContentController.add(self, name: "googleAuth")
        webView!.configuration.userContentController.add(self, name: "vkAuth")
        webView!.configuration.userContentController.add(self, name: "appleAuth")
        webView!.configuration.userContentController.add(self, name: "requestPushPermission")

        webView!.configuration.userContentController.add(self, name: "amplitudeTrackEvent")
        webView!.configuration.userContentController.add(self, name: "amplitudeRegisterUser")
        webView!.configuration.userContentController.add(self, name: "amplitudeUpdateUser")

        webView!.configuration.userContentController.add(self, name: "appsflyerTrackEvent")
        webView!.configuration.userContentController.add(self, name: "facebookTrackEvent")

        //webConfiguration.userContentController = contentController

        //webView?.configuration.userContentController = contentController
        //webView!.configuration.userContentController.add(self, name: "appleAuth")

        //webView = WKWebView(frame: .zero, configuration: webConfiguration)
        //webView?.navigationDelegate = self
        //webView?.uiDelegate = self
        //navigationController?.navigationBar.barStyle = .black

        // view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        let url = URLRequest(url: URL(string:siteURL)! as URL) as URLRequest

        // Webview
        webView?.allowsBackForwardNavigationGestures = true
        webView?.uiDelegate = self
        webView?.navigationDelegate = self
        //webView?.load(url)
        webView?.scrollView.isScrollEnabled = false
        webView?.scrollView.bounces = false
        webView?.scrollView.showsHorizontalScrollIndicator = false
        webView?.scrollView.showsVerticalScrollIndicator = false
        webView?.configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        webView?.configuration.preferences.javaScriptEnabled = true
        webView?.configuration.preferences.setValue(true, forKey: "developerExtrasEnabled")

        // Google //
        //GIDSignIn.sharedInstance()?.presentingViewController = self
    }

    // override func didReceiveMemoryWarning() {
    //     super.didReceiveMemoryWarning()
    // }

    // override var preferredStatusBarStyle : UIStatusBarStyle {
    //     return .darkContent
    // }

    // @objc func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    //     print(error.localizedDescription)
    // }

    @objc(webView:decidePolicyForNavigationAction:decisionHandler:) func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if navigationAction.navigationType == .linkActivated  {

            if let url = navigationAction.request.url,
            let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
            !(components.host?.hasPrefix("accounts.google"))!,
            !(components.host?.hasPrefix("accounts.google.com"))!,
            !(components.host?.hasPrefix("oauth.vk.com"))!,
            !(components.host?.hasPrefix("api.vk.com"))!,
            !(components.host?.hasPrefix("login.vk.com"))!,
            !(components.host?.hasPrefix("pay.google.com"))!,
            !(components.host?.hasPrefix("widget.cloudpayments.ru"))!,
            !components.path.hasSuffix("register/google") && !components.path.hasSuffix("register/vkontakte"),
            UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                print(url)
                print("Redirected to browser. No need to open it locally")
                decisionHandler(.cancel)
            } else {
                print("Open it locally")
                decisionHandler(.allow)
            }
        }

        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if navigationAction.targetFrame == nil, let url = navigationAction.request.url, let scheme = url.scheme {
            if ["http", "https", "mailto"].contains(where: { $0.caseInsensitiveCompare(scheme) == .orderedSame }) {
                let shared = UIApplication.shared
                if shared.canOpenURL(url) {
                    shared.open(url, options: [:], completionHandler: nil)
                }
            }
        }
        return nil
    }

//    override func didReceiveMemoryWarning() {
//        super.didReceiveMemoryWarning()
//        // Dispose of any resources that can be recreated.
//    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "intercomShow" {
            Intercom.presentMessenger()
        }

        if message.name == "intercomRegisterUser" {
            let userInfo = message.body as AnyObject
            Intercom.registerUser(withUserId: userInfo["user_id"] as! String)
        }

        if message.name == "intercomUpdateUser" {
            let userInfo = message.body as! NSDictionary
            let basicAttributes = userInfo["basicAttributes"] as! NSDictionary
            let customAttributes = userInfo["customAttributes"] as! NSDictionary

            let email = basicAttributes["email"] as? String ?? nil

            let userAttributes = ICMUserAttributes()
            if (email != nil && !email!.isEmpty) {
                userAttributes.email = email
            }
            userAttributes.name = basicAttributes["name"] as? String
            userAttributes.signedUpAt = Date(timeIntervalSince1970: basicAttributes["created_at"] as? Double ?? 0)
            userAttributes.customAttributes = customAttributes as? [String : Any]

            Intercom.updateUser(userAttributes)
        }

        if message.name == "intercomTrackEvent" {
            let event = message.body as! NSDictionary
            let type = event["type"] as! String
            let params = event["params"]
            if (params != nil) {
                Intercom.logEvent(withName: type, metaData: params as! [AnyHashable: Any])
            } else {
                Intercom.logEvent(withName: type)
            }
        }

        if message.name == "intercomLogout" {
            Intercom.logout()
        }

        if message.name == "requestPushPermission" {
            let application = UIApplication.shared
            let appDelegate = application.delegate as! AppDelegate
            appDelegate.requestPushPermission(application)
            appDelegate.viewController = self
        }

        if message.name == "googleAuth" {
            let application = UIApplication.shared
            let appDelegate = application.delegate as! AppDelegate
            appDelegate.viewController = self
            GIDSignIn.sharedInstance.signIn(with: signInConfig, presenting: self) { user, error in
                guard error == nil else { return }

//                if (error as NSError).code == GIDSignInErrorCode.hasNoAuthInKeychain.rawValue {
//                  NSLog("The user has not signed in before or they have since signed out.")
//                } else {
//                  NSLog("%@", error.localizedDescription)
//                }

                if (user != nil) {
                    self.sendUserInfo(
                        userId: user?.userID,
                        tokenId: user?.authentication.idToken,
                        name: user?.profile?.name,
                        email: user?.profile?.email
                    )
                }
            }
        }

        if message.name == "vkAuth" {
            VK.sessions.default.logOut()
            VK.sessions.default.logIn(
                onSuccess: { info in
                    self.sendUserInfo(
                        userId: info["user_id"],
                        tokenId: info["access_token"],
                        name: "",
                        email: info["email"]
                    )
                    print("Sober1: success authorize with", info)
                },
                onError: { error in
                    print("Sober1: authorize failed with", error)
                }
            )
        }

        if message.name == "appleAuth" {
            let appleIDProvider = ASAuthorizationAppleIDProvider()
            let request = appleIDProvider.createRequest()
            request.requestedScopes = [.fullName, .email]

            let authorizationController = ASAuthorizationController(authorizationRequests: [request])
            authorizationController.delegate = self
            authorizationController.presentationContextProvider = self
            authorizationController.performRequests()
        }

        // if message.name == "onesignalSetExternalUserId" {
        //     let userId = message.body as! Int
        //     OneSignal.setExternalUserId(String(userId))
        // }

        if message.name == "amplitudeRegisterUser" {
            let userInfo = message.body as! NSDictionary
            let userId = userInfo["user_id"] as? NSNumber
            if (userId != nil) {
                Amplitude.instance().setUserId(userId?.stringValue)
            }
        }

        if message.name == "amplitudeUpdateUser" {
            let userInfo = message.body as! NSDictionary
            let basicAttributes = userInfo["basicAttributes"] as! NSDictionary
            let customAttributes = userInfo["customAttributes"] as! NSDictionary

            let identify = AMPIdentify()
            for (key, value) in basicAttributes {
                identify.set(key as! String, value: value as! NSObject)
            }
            for (key, value) in customAttributes {
                identify.set(key as! String, value: value as! NSObject)
            }

            Amplitude.instance().identify(identify)
        }

        if message.name == "amplitudeTrackEvent" {
            let event = message.body as! NSDictionary
            let type = event["type"] as! String
            let params = event["params"]
            if (params != nil) {
                Amplitude.instance().logEvent(type, withEventProperties: params as! [AnyHashable: Any])
            } else {
                Amplitude.instance().logEvent(type)
            }
        }

        if message.name == "appsflyerTrackEvent" {
            let event = message.body as! NSDictionary
            let type = event["type"] as! String
            let params = event["params"]
            if (params != nil) {
                AppsFlyerLib.shared().logEvent(type, withValues: params as! [AnyHashable: Any])
            } else {
                AppsFlyerLib.shared().logEvent(type, withValues: nil)
            }
        }

        if message.name == "facebookTrackEvent" {
            let event = message.body as! NSDictionary
            let type: AppEvents.Name = AppEvents.Name(rawValue: event["type"] as! String)
            let params = event["params"]
            if (params != nil) {
                AppEvents.shared.logEvent(type, parameters: params as? [AppEvents.ParameterName: Any])
            } else {
                AppEvents.shared.logEvent(type)
            }
        }
    }

    func sendUserInfo(userId: String?, tokenId: String?, name: String?, email: String?) { 
        let userJson: [String: String] = [
            "user_id": userId ?? "",
            "token_id": tokenId ?? "",
            "client_id": googleOauthId,
            "name": name ?? "",
            "email": email ?? ""
        ]

        DispatchQueue.main.async {
            self.webView?.evaluateJavaScript("soSignIn('\(stringify(userJson))')")
        }
    }
}

/**
extension ViewController: GIDSignInDelegate {
    func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {
    }
}
*/

extension ViewController: ASAuthorizationControllerDelegate {
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        switch authorization.credential {
        case let appleIDCredential as ASAuthorizationAppleIDCredential:

            guard let appleIDToken = appleIDCredential.identityToken else {
                print("Unable to fetch identity token")
                return
            }

            guard let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
                print("Unable to serialize token string from data: \(appleIDToken.debugDescription)")
                return
            }

            let userIdentifier = appleIDCredential.user
            let email = appleIDCredential.email

            let nameFormatter = PersonNameComponentsFormatter()
            let fullName = nameFormatter.string(from: appleIDCredential.fullName!)

            self.sendUserInfo(
                userId: userIdentifier,
                tokenId: idTokenString,
                name: fullName,
                email: email
            )
        default:
            break
        }
    }
}

extension ViewController: ASAuthorizationControllerPresentationContextProviding {
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return self.view.window!
    }
}
