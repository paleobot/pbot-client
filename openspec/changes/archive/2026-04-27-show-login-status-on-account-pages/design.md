## Context

`Profile.js` and `Account.js` are both single-`<Box>` placeholder pages that render a hardcoded "not implemented yet — contact Andrew" sentence and no other content. Neither imports any auth or global context. The token-based auth state already exists in `AuthContext` (`useAuth()` returns `[token, setToken]`), and login persists the user's `pbotID` (UUID) under `PBOTMe`. The username the user typed at login is currently discarded after the request — there is a commented-out line at `LoginForm.js:96` showing this used to be persisted, before being replaced by `pbotID`.

The server's `handleLogin` returns only `{ token, pbotID }` — no name fields. Adding a server change to return the user's given/surname was considered and rejected (see Decisions).

## Goals / Non-Goals

**Goals:**
- Tell the user, on the Profile and Account pages, whether they are signed in and as whom.
- Use only what the client already has at hand; no server change, no extra GraphQL round-trip.
- Keep the change small and reversible.

**Non-Goals:**
- Showing a formatted name (e.g. "Douglas Meredith"). The username is what the user typed at login; that is the identifier surfaced.
- Adding a global "logged in as" header anywhere else in the app.
- Refactoring the placeholder pages or extracting a shared header component (two callers, identical bodies — duplication is cheaper).
- Changing logout flow, token storage, or auth context shape.

## Decisions

**Decision 1: Cache `values.userName` at login rather than fetching given/surname.**
Rationale: cheapest and honest — the user knows the handle they just typed. The client already has it in scope at the moment of `localStorage.setItem('PBOTMutationToken', ...)`. A "real name" would require either a server response change (`handleLogin` to include `given`/`surname`) or an Apollo round-trip on every page mount. Neither is justified for a header.
Alternative considered: extend `handleLogin` to return `given`/`surname` and cache those. Defers naturally if we want it later — adds a parallel pair of `localStorage` keys.
Alternative considered: `useQuery` for the Person on Profile/Account mount. Rejected as a per-mount round-trip for static-ish data.

**Decision 2: Use a separate localStorage key (`PBOTMeUsername`), not embed in `PBOTMe`.**
Rationale: `PBOTMe` is the pbotID (UUID) and is validated by the `App.js` mount effect against a UUID regex. Embedding a username would break that validation. Parallel keys cost nothing and keep the contracts clean.

**Decision 3: Decouple "is logged in?" from "do we know who?".**
Rationale: Sessions that predate this change have a token but no cached username. Forcing a re-login or showing the raw UUID would both be user-hostile for a single header. Three render branches (`token + name` / `token only` / `no token`) handle the gap gracefully and self-heal on the next login.

**Decision 4: Duplicate the header in `Profile.js` and `Account.js` rather than extract a `<LoginStatusHeader/>`.**
Rationale: two callers, ~6 lines each, identical bodies. Extracting a one-use-elsewhere component for a one-line `<Typography>` plus a three-branch ternary is over-engineering. Trivial to extract later if a third caller appears.

**Decision 5: `<Typography variant="h5" gutterBottom>`.**
Rationale: the existing body text is default body weight, so even h5 reads as clearly "larger". `gutterBottom` gives breathing room above the placeholder paragraph without custom margins.

## Risks / Trade-offs

- **Stale username** if a user is renamed server-side: cached username outlives the rename until next login. Acceptable for a display-only header; documented.
- **localStorage drift** if a future change wipes `PBOTMutationToken` from somewhere we miss: the username could linger past a session. Mitigation: the two existing wipe sites (`NavBar.js` logout, `App.js` stale-UUID) are the only known wipe paths in the codebase; both are updated in this change.
- **No migration for in-flight sessions**: anyone currently logged in won't have `PBOTMeUsername` until they log in again. Handled by Decision 3 (the "logged in, name unknown" branch). No forced logout.
