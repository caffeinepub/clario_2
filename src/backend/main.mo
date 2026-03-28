import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  type Signup = {
    email : Text;
    timestamp : Int;
  };

  type Suggestion = {
    text : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let signups = List.empty<Signup>();
  let suggestions = List.empty<Suggestion>();
  let accessControlState = AccessControl.initState();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Pre-seed owner as admin
  let ownerPrincipal = Principal.fromText("mbolt-rwfea-7bdvh-f5xmv-76ilq-s46ua-qst5p-bcfwv-tc63o-4uynt-tqe");
  accessControlState.userRoles.add(ownerPrincipal, #admin);
  accessControlState.adminAssigned := true;

  include MixinAuthorization(accessControlState);

  public shared func submitSignup(email : Text) : async Text {
    if (email.size() == 0) {
      return "Error: Email is required";
    };
    let newSignup : Signup = {
      email;
      timestamp = Time.now();
    };
    signups.add(newSignup);
    "Success";
  };

  public shared ({ caller }) func getAllSignups() : async [Signup] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view signups");
    };
    signups.values().toArray();
  };

  public shared ({ caller }) func clearSignups() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear signups");
    };
    signups.clear();
    "Signups cleared";
  };

  public shared func submitSuggestion(text : Text) : async Text {
    if (text.size() == 0) {
      return "Error: Suggestion text is required";
    };
    let newSuggestion : Suggestion = {
      text;
      timestamp = Time.now();
    };
    suggestions.add(newSuggestion);
    "Success";
  };

  public shared ({ caller }) func getAllSuggestions() : async [Suggestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view suggestions");
    };
    suggestions.values().toArray();
  };

  public shared ({ caller }) func clearSuggestions() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear suggestions");
    };
    suggestions.clear();
    "Suggestions cleared";
  };
};
