## Why

CVE-2026-111497 ("Node2Shell", a Brotli decoder out-of-bounds write) is fixed only in Node ≥ 26.12.1. `pbot-api` moved to Node 26 on 2026-11-03. The `pbot-client` dev-server process on the **dev** host still runs under PM2 on Node 18.20.8, which is end-of-life and will never be patched. It is the last process holding the nginx `Content-Encoding: br` stopgap in place.

Prod is not affected: it serves the static build through nginx and runs no client Node process.

## What Changes

- Declare the client's runtime baseline: add `.nvmrc` (`26`) and `"engines": {"node": ">=26.12.1"}` to `package.json`.
- Change the dev host's PM2 `pbot-client` entry (in `pbot-api/ecosystem.config.cjs`):
  - Resolve the interpreter from the client's `.nvmrc` (newest nvm-installed matching major), the same way the `pbot-api` entry already does, instead of a hard-coded `/home/doug/.nvm/.../v16.17.0` path.
  - **BREAKING (dev only):** run `craco start` instead of `react-scripts/scripts/start.js`, so dev compiles with the same CRACO polyfills/`ProvidePlugin` as local `npm start` and the prod build.
  - Set `watch: false` to match what actually runs. Webpack's own watcher recompiles on `src/` changes, so the `git reset` deploy keeps working. Dependency changes need a manual `pm2 restart`.
- Correct `pbot-api/NODE-RUNTIME.md`. It wrongly lists a prod `pbot-client` Node process. Add the client cutover runbook and note when the nginx `br` block can be removed: prod now, dev after cutover.
- Correct this repo's `CLAUDE.md`. It claims a PM2 watcher reloads the client, and it doesn't say how dev launches the client.

No application code changes. Smoke tests on Node 26.13.0 / npm 11.20 passed for `craco build`, `craco start` (including the `/graphql` proxy), plain `react-scripts start`, and a fresh `npm ci`.

## Capabilities

### New Capabilities
- `client-runtime-baseline`: the client declares a minimum Node.js version patched against CVE-2026-111497. The dev host's PM2 process runs it on that runtime via CRACO.

### Modified Capabilities
<!-- None. -->

## Impact

- **This repo:** new `.nvmrc`, `package.json` (`engines`), `CLAUDE.md`.
- **pbot-api (cross-repo):** `ecosystem.config.cjs` (`pbot-client` entry plus a generalized interpreter resolver) and `NODE-RUNTIME.md`.
- **Dev host ops:** discard the uncommitted interpreter edit in `~/repos/pbot-api/ecosystem.config.cjs`, pull, then `pm2 delete` / `pm2 start` the client. PM2 commands run on Node 18.20.8, where pm2 is installed.
- **Prod:** no deploy change. The nginx `br` block there can be removed independently (the nginx config lives outside both repos).
- **Dependencies:** none added or upgraded.
