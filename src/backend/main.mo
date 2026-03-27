import List "mo:core/List";
import Text "mo:core/Text";
import OutCall "http-outcalls/outcall";
import Iter "mo:core/Iter";

actor {
  type Submission = {
    email : Text;
    improvementGoal : Text;
    biggestProblem : Text;
    wouldUse : Text; // "Yes" | "No" | "Maybe"
    suggestions : ?Text;
  };

  // List to store submissions (persistent)
  let submissions = List.empty<Submission>();

  // Needed for HTTP outcall transform
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Add a new submission and send to Brevo
  public shared ({ caller }) func submitForm(submission : Submission) : async Text {
    if (submission.email.size() == 0) {
      return "Error: Email is required";
    };

    submissions.add(submission);

    // Prepare Brevo payload with both contact & deal info
    let suggestionsText = switch (submission.suggestions) {
      case (null) { "" };
      case (?s) { s };
    };

    let brevoPayload = "{
      \"email\": \"" # submission.email # "\",
      \"attributes\": {
        \"IMPROVEMENT_GOAL\": \"" # submission.improvementGoal # "\",
        \"BIGGEST_PROBLEM\": \"" # submission.biggestProblem # "\",
        \"WOULD_USE\": \"" # submission.wouldUse # "\",
        \"SUGGESTIONS\": \"" # suggestionsText # "\"
      },
      \"updateEnabled\": true
    }";

    try {
      let apiKey = "<YOUR_BREVO_API_KEY>"; // TODO: Store securely
      let headers = [
        {
          name = "api-key";
          value = apiKey;
        },
        {
          name = "Content-Type";
          value = "application/json";
        },
      ];

      let _brevoResponse = await OutCall.httpPostRequest(
        "https://api.brevo.com/v3/contacts",
        headers,
        brevoPayload,
        transform,
      );
      "Success";
    } catch (e) { "Error submitting to Brevo: " # e.message() };
  };

  // Get all submissions (for admin review)
  public shared ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.values().toArray();
  };

  public shared ({ caller }) func clearSubmissions() : async Text {
    submissions.clear();
    "Submissions cleared";
  };
};
