## 1. Cache username at login

- [x] 1.1 In `src/components/LoginForm.js` `handleSubmit`, after the existing `localStorage.setItem('PBOTMe', loginResult.pbotID)` (around line 97), add `localStorage.setItem('PBOTMeUsername', values.userName)`.

## 2. Clear cached username with the rest of auth state

- [x] 2.1 In `src/components/NavBar.js` (logout handler around line 65), add `localStorage.removeItem('PBOTMeUsername')` alongside the existing `removeItem` calls for `PBOTMutationToken` and `PBOTMe`.
- [x] 2.2 In `src/App.js` (stale-`PBOTMe` cleanup around line 31–34), add `localStorage.removeItem('PBOTMeUsername')` in the same branch that clears `PBOTMe` and `PBOTMutationToken`.

## 3. Render header on Profile

- [x] 3.1 In `src/components/Profile.js`, import `Typography` from `@mui/material` and `useAuth` from `./AuthContext`.
- [x] 3.2 Convert the component to a function body (it is currently an arrow with a parenthesised JSX expression) so it can call `useAuth()` and read `localStorage.getItem('PBOTMeUsername')`.
- [x] 3.3 Above the existing message, render a `<Typography variant="h5" gutterBottom>` whose text is one of: `You are logged in as <username>` (token + non-empty username), `You are logged in` (token, no cached username), or `You are not logged in` (no token).

## 4. Render header on Account

- [x] 4.1 Repeat the same imports + conversion + header in `src/components/Account.js`. Body text remains unchanged.

## 5. Verify

- [x] 5.1 `npm start`; with no token in localStorage, navigate to `/profile` and `/account` — confirm `You are not logged in` renders above the placeholder body on both.
- [x] 5.2 Log in via the form, then visit `/profile` and `/account` — confirm `You are logged in as <username>` matches the username typed at login.
- [x] 5.3 With an existing logged-in session, manually `localStorage.removeItem('PBOTMeUsername')` in the devtools console, reload `/profile` — confirm fallback `You are logged in` renders (no UUID, no error).
- [x] 5.4 Click Logout in the NavBar; confirm `localStorage` no longer contains `PBOTMutationToken`, `PBOTMe`, or `PBOTMeUsername`, and that `/profile` and `/account` now show `You are not logged in`.
