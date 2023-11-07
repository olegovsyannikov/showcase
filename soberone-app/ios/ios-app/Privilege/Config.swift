import UIKit
import Foundation

// Your web site url change between "" with full url.
public var siteURL = Bundle.main.object(forInfoDictionaryKey: "SOAppWebsiteUrl") as! String
// public var siteURL = "http://192.168.1.23:3000"

// One Signal Push Notifications AppId change only between ""
//public var onesignalAppId = "8a598af2-774b-47e3-9cca-e9bf7a20300d"

// Lookback token
public var lookbackToken = "PgQ2YESttiEnw9738"

// Intercom credentials
public var intercomAppId = Bundle.main.object(forInfoDictionaryKey: "SOIntercomAppId") as! String
public var intercomApiKey = Bundle.main.object(forInfoDictionaryKey: "SOIntercomApiKey") as! String

// Amplitude
public var amplitudeApiKey = Bundle.main.object(forInfoDictionaryKey: "SOAmplitudeApiKey") as! String

// OAuth credentials
public var googleOauthId = "368269514874-rpga1rf47opdte8ckl1bggkhhbs0va38.apps.googleusercontent.com"
public var vkOauthId = "7147030"

// Show / Hide Loading Animation change only true or false
public var showLoadingAnimation     : Bool = true

// Loading String change only between ""
public var loadingString           : String = "Please Wait.."

// Loading Animation Styles - Change only colors .white , .black etc..
public var loadingActivityColor: UIColor                = UIColor.white
public var loadingActivityBackgroundColor: UIColor      = UIColor.black
public var loadingActivityTextColor: UIColor            = UIColor.white
