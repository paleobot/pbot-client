## Why

The Profile and My Account pages currently render only a static "not implemented yet — contact Andrew" message. Users land there with no indication of whose session they're on (or whether they're signed in at all), which is mildly disorienting given those pages exist precisely to manage their account.

## What Changes

- On successful login, persist the username the user typed (`values.userName`) to a new `localStorage` key `PBOTMeUsername`, alongside the existing `PBOTMutationToken` and `PBOTMe` writes.
- On logout (in `NavBar.js`) and on the stale-UUID cleanup path (in `App.js`), also remove `PBOTMeUsername` so it is cleared on the same cadence as the other auth keys.
- On both `Profile.js` and `Account.js`, render a new `<Typography variant="h5" gutterBottom>` header above the existing "not implemented" body text, showing one of three messages depending on auth state:
  - token + cached username → `"You are logged in as <username>"`
  - token but no cached username (e.g. session predates this change) → `"You are logged in"`
  - no token → `"You are not logged in"`
- The header is duplicated across the two pages rather than extracted into a shared component (only two callers, identical bodies).

## Capabilities

### New Capabilities
- `account-page-login-status`: Login status header on the Profile and My Account pages, sourced from `useAuth()` plus a username cached at login time.

### Modified Capabilities
<!-- None. -->

## Impact

- `src/components/LoginForm.js` — additional `localStorage.setItem('PBOTMeUsername', values.userName)` on successful login.
- `src/components/NavBar.js` — additional `localStorage.removeItem('PBOTMeUsername')` in the existing logout cleanup.
- `src/App.js` — additional `localStorage.removeItem('PBOTMeUsername')` in the existing invalid-`PBOTMe` cleanup branch.
- `src/components/Profile.js` and `src/components/Account.js` — each grows a header above the existing `<Box>`-wrapped message; each uses `useAuth()` and `localStorage.getItem('PBOTMeUsername')`.
- No server changes; no GraphQL changes; no Apollo round-trips added. `PBOTMutationToken` and `PBOTMe` semantics unchanged.
- Stale-username risk: if a user is renamed server-side, the cached username remains until their next login. Acceptable for a display-only header.
