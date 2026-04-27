## ADDED Requirements

### Requirement: Cache username at login

On a successful login response, the client SHALL store the username the user submitted on the login form to `localStorage` under the key `PBOTMeUsername`, alongside the existing `PBOTMutationToken` and `PBOTMe` writes.

#### Scenario: Successful login

- **WHEN** the login `POST /user/login` returns `ok: true`
- **THEN** the client SHALL `localStorage.setItem('PBOTMeUsername', <submitted username>)` in addition to setting `PBOTMutationToken` and `PBOTMe`

#### Scenario: Failed login

- **WHEN** the login response is not `ok`
- **THEN** `PBOTMeUsername` SHALL NOT be written

### Requirement: Clear cached username on logout and stale session

The cached username SHALL be cleared whenever the existing auth keys (`PBOTMutationToken`, `PBOTMe`) are cleared, so that `PBOTMeUsername` never lingers past a session.

#### Scenario: User clicks logout

- **WHEN** the logout handler in `NavBar.js` runs
- **THEN** `localStorage.removeItem('PBOTMeUsername')` SHALL be called alongside the existing `removeItem` calls for `PBOTMutationToken` and `PBOTMe`

#### Scenario: Stale `PBOTMe` detected

- **WHEN** the `App.js` mount-time validation finds a `PBOTMe` value that does not match a UUID v1–5 pattern and clears `PBOTMe` and `PBOTMutationToken`
- **THEN** `PBOTMeUsername` SHALL also be removed in the same branch

### Requirement: Render login-status header on Profile and Account pages

Both `Profile.js` and `Account.js` SHALL render a `<Typography variant="h5" gutterBottom>` header above their existing "not implemented" message, with content determined by the current auth state.

#### Scenario: Logged in with cached username

- **WHEN** `useAuth()` returns a truthy token AND `localStorage.getItem('PBOTMeUsername')` returns a non-empty string
- **THEN** the header text SHALL be `You are logged in as <username>`

#### Scenario: Logged in without cached username

- **WHEN** `useAuth()` returns a truthy token AND `localStorage.getItem('PBOTMeUsername')` is null or empty
- **THEN** the header text SHALL be `You are logged in`

#### Scenario: Not logged in

- **WHEN** `useAuth()` returns a falsy token
- **THEN** the header text SHALL be `You are not logged in`

### Requirement: Existing "not implemented" message preserved

The existing "Full user-directed … functionality has not been implemented yet …" body content SHALL remain unchanged on both pages; only a new header is added above it.

#### Scenario: Profile page

- **WHEN** a user navigates to `/profile`
- **THEN** the existing contact-Andrew message SHALL render below the new header, with no other layout change

#### Scenario: Account page

- **WHEN** a user navigates to `/account`
- **THEN** the existing contact-Andrew message SHALL render below the new header, with no other layout change
