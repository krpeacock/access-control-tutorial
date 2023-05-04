import Map "mo:map/Map";
import JSON "mo:json/JSON";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";

shared ({ caller }) actor class () {
  let { phash } = Map;
  stable let creator = caller;
  stable let counts = Map.new<Principal, Nat>(phash);

  public shared ({ caller }) func increment() : async Nat {
    let prev = switch (Map.get(counts, phash, caller)) {
      case (null) { 0 };
      case (?n) { n };
    };
    let next = prev + 1;
    Map.set(counts, phash, caller, next);

    next;
  };

  public type Count = {
    principal : Principal;
    count : Nat;
  };
  public query func getCounts() : async Text {
    var entries = Buffer.fromArray<JSON.JSON>([]);
    for ((principal, count) in Map.entries(counts)) {
      entries.add(
        #Object([
          ("principal", #String(Principal.toText(principal))),
          ("count", #String(Nat.toText(count))),
        ])
      );
    };
    JSON.show(#Array(Buffer.toArray(entries)));
  };

  public shared query ({ caller }) func myCount() : async Nat {
    switch (Map.get(counts, phash, caller)) {
      case (null) { 0 };
      case (?n) { n };
    };
  };

};
