//
//  VKDelegate.swift
//  Privilege
//
//  Created by Oleg Ovsyannikov on 25/09/2019.
//  Copyright © 2019 Dmitry Dyakonov. All rights reserved.
//

import Foundation
import SwiftyVK

class VKDelegate: SwiftyVKDelegate {

    let appId = vkOauthId
    let scopes: Scopes = [.offline,.email]

    init() {
        VK.setUp(appId: appId, delegate: self)
    }

    func vkNeedsScopes(for sessionId: String) -> Scopes {
        // Called when SwiftyVK attempts to get access to user account
        // Should return a set of permission scopes
        return scopes
    }

    func vkNeedToPresent(viewController: VKViewController) {
        // Called when SwiftyVK wants to present UI (e.g. webView or captcha)
        // Should display given view controller from current top view controller
        if let rootController = UIApplication.shared.keyWindow?.rootViewController {
             rootController.present(viewController, animated: true)
         }

    }

    func vkTokenCreated(for sessionId: String, info: [String : String]) {
      // Called when user grants access and SwiftyVK gets new session token
      // Can be used to run SwiftyVK requests and save session data
    }

    func vkTokenUpdated(for sessionId: String, info: [String : String]) {
      // Called when existing session token has expired and successfully refreshed
      // You don't need to do anything special here
    }

    func vkTokenRemoved(for sessionId: String) {
      // Called when user was logged out
      // Use this method to cancel all SwiftyVK requests and remove session data
    }
}
