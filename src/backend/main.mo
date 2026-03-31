import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration with-clause

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
  let secondAdminPrincipal = Principal.fromText("3fthk-6gg5x-7dxhw-xquwh-6gwyh-hjnou-ekcu2-kaebz-3r4ur-qwrw3-pae");
  accessControlState.userRoles.add(secondAdminPrincipal, #admin);

  include MixinAuthorization(accessControlState);

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Email Signup Functions
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

  public query ({ caller }) func getAllSignups() : async [Signup] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view signups");
    };
    signups.toArray();
  };

  public shared ({ caller }) func clearSignups() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear signups");
    };
    signups.clear();
    "Signups cleared";
  };

  // Suggestion Functions
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

  public query ({ caller }) func getAllSuggestions() : async [Suggestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view suggestions");
    };
    suggestions.toArray();
  };

  public shared ({ caller }) func clearSuggestions() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear suggestions");
    };
    suggestions.clear();
    "Suggestions cleared";
  };
};
