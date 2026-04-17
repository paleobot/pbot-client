# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a Create React App project wrapped with CRACO (package.json scripts use `craco` instead of `react-scripts`):

- `npm start` — dev server on port 3000; proxies `/graphql` to `http://localhost:4001/` (configured via `proxy` in `package.json`)
- `npm run build` — production build
- `npm test` — interactive Jest watch mode. Run a single test file with `npm test -- src/App.test.js` or filter by name with `npm test -- -t "pattern"`. There is currently only a smoke test (`src/App.test.js`); `.github/workflows/deploy-dev.yaml` explicitly skips tests.

`.env` / `env.template` hold `REACT_APP_*` vars (file-size limit, supported image formats) and a currently-unused `PUBLIC_GROUP_ID` (the public group id is fetched at runtime — see `GlobalContext`).

CRACO (`craco.config.js`) exists solely to add Node-polyfills (`util`, `stream-browserify`, `buffer`, `process`, `browserify-zlib`) and the `ProvidePlugin` for `process`/`Buffer` that Webpack 5 no longer ships. `src/polyfills.js` is imported first in `src/index.js` for the same reason.

Deploy: pushes to `master` trigger `.github/workflows/deploy-dev.yaml`, which SSHes into a dev host and does `git fetch && git reset --hard origin/master` in `repos/pbot-api/client` — a PM2 watcher picks up the change. There is no build step in CI; the server builds/serves.

## Architecture

This is the React frontend for **PBOT** (a paleobotany database). The server it talks to lives in a sibling `pbot-api` repo and exposes a Neo4j-backed GraphQL API. This repo contains only the client.

### Peer server repo

The GraphQL server lives at `/home/douglas/repos/pbot-api` (same parent dir as this repo) and is directly readable. When a client change depends on server behavior — new/renamed fields, resolver logic, permission rules, Cypher queries — read the server source rather than guessing. Key files: `schema.graphql` (type/query/mutation definitions, including `@cypher` directive queries), `Resolvers.js`, `permissions.js`, `cypher/` (Neo4j query fragments), `index.js` (server entry), and its own `CLAUDE.md`.

### Routing and top-level shape

`src/index.js` defines the entire `createBrowserRouter` tree:

- `/` → `App` (nav, footer, auth/global providers) with nested children
- `/query/<entity>` and `/mutate/<entity>` → `PBOTInterface` with `formClass="query"` or `"mutate"`, then `Action` picks the concrete form
- `/query/<entity>/:id` → top-level `*DirectQueryResults` components (NOT nested under `App`, because they're standalone landing pages, not embedded in the workbench)
- `*.md` legacy paths (`Register.md`, `OTU.md`, …) redirect to `/howto/<topic>` which renders a markdown doc via `MDElement`

The MUI theme (colors, default `TextField` variant = `standard` with width 400px, green `secondary` = `#66bb6a`) is also defined in `index.js`.

### The query/mutate workbench pattern

`PBOTInterface` → `Action` → `Query` / `Mutate` → `<Entity><Query|Mutate>Form` → on submit → `Result` renders `<Entity><Query|Mutate>Results`. The Action/Results split is driven by MUI `Tabs` with `hidden` (not unmounted) so submitting a form doesn't lose state. `Result` is remounted on each submit by toggling `showResult` false→true — this is intentional; a comment in `PBOTInterface.js:46` explains why.

Every supported entity follows the same file layout inside `src/components/<Entity>/`:

- `<Entity>QueryForm.js` / `<Entity>QueryResults.js` — search UI + results table
- `<Entity>MutateForm.js` / `<Entity>MutateResults.js` — create/edit/delete UI + confirmation
- `<Entity>DirectQueryResults.js` — standalone detail page reachable by URL (only for OTU/Collection/Specimen/Reference/Schema)
- `<Entity>Select.js` — MUI autocomplete for picking one of these entities inside another form
- `<Entity>Web.js` / `<Entity>Pdf.js` — shared presentation used by both the workbench and the direct-query pages, plus PDF export via `@react-pdf/renderer`

Entities with full query+mutate surfaces: OTU, Collection, Specimen, Reference, Schema, Person. Mutate-only: Synonym, Comment, Description, CharacterInstance, Character, State, Group, Image. When adding a new entity, copy an existing folder — the wiring in `Query.js`, `Mutate.js`, `Result.js`, and the router in `index.js` all need a matching entry.

### GraphQL

`src/ApolloClientSetup.js` builds a single `ApolloClient` using `apollo-upload-client`'s `createUploadLink` (the app uploads images, so a plain `createHttpLink` is intentionally not used) and an auth link that reads `PBOTMutationToken` from `localStorage` and sets `apollo-require-preflight: true`.

`src/components/Mutator.js` is a generic mutation component: pass `entity`, `mode` ("create" | "edit" | "delete"), and `data`, and it builds `Create<Entity>` / `Update<Entity>` / `Delete<Entity>` mutations on the fly from template strings. Most `*MutateResults` components use this instead of hand-written `useMutation` calls.

Queries, on the other hand, are mostly written inline in each `*QueryResults` component using `useQuery`/`gql`. Person, Reference, Schema, Collection, and OTU each have a **fuzzy-search** branch that switches between the standard entity query and a Neo4j-fulltext `fuzzy<Entity>` query (Pattern D: fulltext hit → `pbotID_in` injection → `neo4jgraphql()` delegation, so the standard `_<Type>Filter` shape and `cypherParams` group scoping work on both branches). See `src/components/Person/FUZZY_SEARCH.md` for the pattern and the server-side change (`add-fuzzy-search-core-entities`) it depends on.

### Auth and global state

Two React contexts wrap `App`:

- `AuthProvider` (`AuthContext.js`) — holds the `PBOTMutationToken` (JWT-ish) from `localStorage`. `useAuth()` returns `[token, setToken]`.
- `GlobalProvider` (`GlobalContext.js`) — on mount, does a plain `fetch('/graphql', …)` (NOT Apollo — see the comment at `GlobalContext.js:44` about Apollo re-querying on every render) to look up the `public` group's `pbotID`, exposed as `publicGroupID`. Most queries need this to scope results.

`App.js` also validates the `PBOTMe` UUID in `localStorage` on each mount and clears `PBOTMe`/`PBOTMutationToken` if it doesn't match a UUID v1-5 pattern.

### OpenSpec

`openspec/` and `.github/skills/openspec-*` hold a spec-driven change workflow (explore → propose → apply → archive). The matching Claude skills live under `.claude/skills/` and commands under `.claude/commands/opsx/`. Invoke via `/openspec-*` or `/opsx:*` slash commands when a change request is non-trivial.

### Notable quirks

- `src/components/oldStuff/` is dead code kept for reference — don't modify it and don't import from it.
- `App.js` sets `window.onpopstate` to reset workbench state on Back — any nav logic needs to coexist with this.
- `util.alphabetize(list, field, ignoreQuotes)` sorts null names to the end (by substituting `"z"`) and, with `ignoreQuotes`, strips leading `"` so quoted taxonomic names sort after unquoted ones. Use it for any OTU/taxon list rather than re-rolling a comparator.
- `console.log` calls are scattered throughout render functions intentionally (there's a commented-out Proxy-based toggle in `index.js` that never worked). Don't strip them during unrelated work.
