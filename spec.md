# Clario

## Current State
Clario has an early access email signup form stored in the Motoko backend, with an admin page at `/#admin` for viewing signups. The backend stores `Signup` records with `email` and `timestamp`.

## Requested Changes (Diff)

### Add
- A suggestions section below the early access section on the landing page
- A textarea input for users to type their suggestion (no email required)
- A submit button to send the suggestion to the backend
- Backend: `Suggestion` type with `text` and `timestamp`
- Backend: `submitSuggestion(text)` public function
- Backend: `getAllSuggestions()` admin-only function
- Admin page: a second tab/section to view all collected suggestions

### Modify
- `main.mo`: add Suggestion storage and functions
- `App.tsx`: add SuggestionForm component and section below early access
- `AdminPage.tsx`: add suggestions tab alongside signups

### Remove
- Nothing removed

## Implementation Plan
1. Update `main.mo` to add Suggestion type, storage, submitSuggestion, getAllSuggestions
2. Update `backend.d.ts` to reflect new types and functions
3. Add SuggestionForm to App.tsx below the early access section
4. Update AdminPage.tsx to show suggestions in a separate tab
