import Error "mo:base/Error";
import Text "mo:base/Text";

import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Result "mo:base/Result";

actor Calculator {
  public func calculate(x : Int, y : Int, op : Text) : async Result.Result<Int, Text> {
    switch (op) {
      case ("+") { #ok(x + y) };
      case ("-") { #ok(x - y) };
      case ("*") { #ok(x * y) };
      case ("/") {
        if (y == 0) {
          #err("Error: Division by zero")
        } else {
          #ok(x / y)
        }
      };
      case (_) {
        #err("Error: Invalid operation")
      };
    }
  };

  public func clear() : async () {
    Debug.print("Calculator cleared");
  };
}
