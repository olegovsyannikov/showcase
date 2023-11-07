//
//  Functions.swift
//  Privilege
//
//  Created by Oleg Ovsyannikov on 24/09/2019.
//  Copyright © 2019 Dmitry Dyakonov. All rights reserved.
//

import Foundation

func stringify(_ json: Any, prettyPrinted: Bool = false) -> String {
    var options: JSONSerialization.WritingOptions = []
    if prettyPrinted {
      options = JSONSerialization.WritingOptions.prettyPrinted
    }

    do {
      let data = try JSONSerialization.data(withJSONObject: json, options: options)
      if let string = String(data: data, encoding: String.Encoding.utf8) {
        return string
      }
    } catch {
      print(error)
    }

    return ""
}
