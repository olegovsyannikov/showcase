import UIKit
import Intercom
import GoogleSignIn
import SwiftyVK
import Capacitor
import Firebase
import AppTrackingTransparency
import Amplitude
import Sentry
import AppsFlyerLib
import FacebookCore
import StoreKit

let prefs:UserDefaults = UserDefaults.standard
var vkDelegateReference : SwiftyVKDelegate?
let signInConfig = GIDConfiguration.init(clientID: googleOauthId)

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, AppsFlyerLibDelegate {
    func onConversionDataSuccess(_ conversionInfo: [AnyHashable : Any]) {
        //
    }

    func onConversionDataFail(_ error: Error) {
        //
    }

    var window: UIWindow?
    var viewController = ViewController()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        SKAdNetwork.registerAppForAdNetworkAttribution()

        SentrySDK.start { options in
            options.dsn = "https://2d5c859c547f4e13afe87134b2b2afca@o895448.ingest.sentry.io/5943687"
            options.debug = true // Enabled debug when first installing is always helpful
        }

        // clear cache
        // WKWebsiteDataStore.default().removeData(
        //     ofTypes: [WKWebsiteDataTypeDiskCache, WKWebsiteDataTypeMemoryCache],
        //     modifiedSince: Date(timeIntervalSince1970: 0),
        //     completionHandler:{ }
        // )

        // Initialize Intercom
        Intercom.setApiKey(intercomApiKey, forAppId: intercomAppId)
        Intercom.registerUnidentifiedUser()

        // Initialize Google SignIn
        //GIDSignIn.sharedInstance().clientID = googleOauthId
        //GIDSignIn.sharedInstance().delegate = self
        //signInConfig = GIDConfiguration.init(clientID: googleOauthId)

        // Initialize VK
        vkDelegateReference = VKDelegate()

        FirebaseApp.configure()

        // Enable sending automatic session events
        Amplitude.instance().trackingSessionEvents = true
        // Initialize SDK
        Amplitude.instance().initializeApiKey(amplitudeApiKey)

        AppsFlyerLib.shared().appsFlyerDevKey = "otNG32kJR8exADbVoSHtQo"
        AppsFlyerLib.shared().appleAppID = "id1481719333"

        ApplicationDelegate.shared.application(
            application,
            didFinishLaunchingWithOptions: launchOptions
        )

        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        //VK.handle(url: url, sourceApplication: sourceApplication)
        // return true

        var handled: Bool

        handled = GIDSignIn.sharedInstance.handle(url)
        if handled {
            return true
        }

        ApplicationDelegate.shared.application(
            app,
            open: url,
            sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String,
            annotation: options[UIApplication.OpenURLOptionsKey.annotation]
        )

        return CAPBridge.handleOpenUrl(url, options)
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        Intercom.setDeviceToken(deviceToken)
        return CAPBridge.handleContinueActivity(userActivity, restorationHandler)
    }

    func requestPushPermission(_ application: UIApplication) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { (granted, error) in

            guard error == nil else {
                //Display Error.. Handle Error.. etc..
                return
            }

            if granted {
                //Do stuff here..
                //Register for RemoteNotifications. Your Remote Notifications can display alerts now :)
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
            else {
                //Handle user denying permissions..
            }
        }

        application.registerForRemoteNotifications()
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
        if #available(iOS 14, *) {
            ATTrackingManager.requestTrackingAuthorization { status in
                if status == .authorized {
                    AppsFlyerLib.shared().start()

                    // FB
                    Settings.setAdvertiserTrackingEnabled(true)
                    Settings.isAdvertiserIDCollectionEnabled = true
                    Settings.isAutoLogAppEventsEnabled = true
                }
            }
        } else {
            AppsFlyerLib.shared().start()

            // FB
            Settings.setAdvertiserTrackingEnabled(true)
            Settings.isAdvertiserIDCollectionEnabled = true
            Settings.isAutoLogAppEventsEnabled = true
        }
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func logout() {
        Intercom.logout()
    }


    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
      super.touchesBegan(touches, with: event)

      // 'statusBarFrame' was deprecated in iOS 13.0: Use the statusBarManager property of the window scene instead.
      let statusBarRect = UIApplication.shared.statusBarFrame

      guard let touchPoint = event?.allTouches?.first?.location(in: self.window) else { return }

      if statusBarRect.contains(touchPoint) {
        // 'CAPBridge' is deprecated: 'statusBarTappedNotification' has been moved to Notification.Name.capacitorStatusBarTapped. 'getLastUrl' and application delegate methods have been moved to ApplicationDelegateProxy.
        NotificationCenter.default.post(CAPBridge.statusBarTappedNotification)
        //NotificationCenter.default.post(Notification.Name.capacitorStatusBarTapped)
      }
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        //   NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidRegisterForRemoteNotificationsWithDeviceToken.name()), object: deviceToken)
        Messaging.messaging().apnsToken = deviceToken
        Messaging.messaging().token(completion: {(token, error) in
            if let error = error {
                NotificationCenter.default.post(name:Notification.Name(CAPNotifications.DidFailToRegisterForRemoteNotificationsWithError.name()), object:error)
            } else if let token = token {
                NotificationCenter.default.post(name:Notification.Name(CAPNotifications.DidRegisterForRemoteNotificationsWithDeviceToken.name()),object: token)
            }
        })
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
      NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidFailToRegisterForRemoteNotificationsWithError.name()), object: error)
    }
}

/**
extension AppDelegate: GIDSignInDelegate {
    func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {

         if let error = error {
             if (error as NSError).code == GIDSignInErrorCode.hasNoAuthInKeychain.rawValue {
               NSLog("The user has not signed in before or they have since signed out.")
             } else {
               NSLog("%@", error.localizedDescription)
             }
             return
         }

         // Send user data to webview
         viewController.sendUserInfo(
             userId: user.userID,
             tokenId: user.authentication.idToken,
             name: user.profile.name,
             email: user.profile.email
         )
    }

    func sign(_ signIn: GIDSignIn!, didDisconnectWith user: GIDGoogleUser!, withError error: Error!) {
       // Perform any operations when the user disconnects from app here.
    }
}
*/
