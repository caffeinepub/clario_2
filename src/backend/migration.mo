import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type Signup = {
    email : Text;
    timestamp : Int;
  };

  type Suggestion = {
    text : Text;
    timestamp : Int;
  };

  type UserProfile = {
    name : Text;
  };

  type Actor = {
    signups : List.List<Signup>;
    suggestions : List.List<Suggestion>;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
