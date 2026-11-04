## Context

- **Dev host today** (`pm2 show pbot-client`, 2026-11-04):
  - script `node_modules/react-scripts/scripts/start.js`
  - interpreter `/home/doug/.nvm/versions/node/v18.20.8/bin/node`
  - cwd `~/repos/pbot-api/client`
  - watch off
  - created 2026-11-03 during the API cutover
- **Origin of the dev entry:** it comes from `pbot-api/ecosystem.config.cjs`. The server's checkout carries an uncommitted edit changing the interpreter from v16.17.0 to v18.20.8. The committed file says `watch: true`, but the running process has watch off.
- **The PM2 daemon** runs on Node 18.20.8 (in-memory 5.1.2). `pm2` is only on PATH under Node 18, so npm steps run on 26 and pm2 commands on 18 (see `pbot-api/NODE-RUNTIME.md`).
- **Prod** serves `build/` through nginx and has no client Node process. `NODE-RUNTIME.md`'s prod `pbot-client` rows are wrong.
- **Smoke test (local, Node 26.13.0 / npm 11.20, 2026-11-04):**

  | Check | Result |
  |---|---|
  | `craco build` with the existing (Node 18-installed) `node_modules` | ✅ |
  | `craco start`, serving the bundle and the `/graphql` proxy to :4001 | ✅ |
  | `react-scripts/scripts/start.js` without CRACO | ✅ compiles |
  | Fresh `npm ci` from the current lockfile | ✅. The only install-script warning is `core-js`/`core-js-pure`'s postinstall, a funding banner that needs no approval |
  | Native addons | none |
  | Deprecations (`--trace-deprecation`) | `DEP_WEBPACK_DEV_SERVER_ON_BEFORE/AFTER_SETUP_MIDDLEWARE` (CRA 5) and `DEP0060 util._extend` (`http-proxy`). None blocks anything; all are dev-server only |

## Goals / Non-Goals

**Goals:**
- The dev `pbot-client` process runs on Node ≥ 26.12.1.
- Dev compiles the same way as local and prod (CRACO).
- The PM2 entry in git matches what runs, with no hand edits on the server.
- Docs stop claiming a prod client Node process or a PM2 watcher.

**Non-Goals:**
- The dev process's 35 restarts and 96.6% heap usage. The error log has no heap or OOM lines (it may have been rotated by `pm2-logrotate`). Investigate separately.
- CRA→Vite, React/MUI upgrades, silencing dev-server deprecations.
- Serving dev as a static build.
- Upgrading the PM2 daemon or moving it to Node 26.
- Editing nginx. Its config is in neither repo, so we only document when the `br` block can go.

## Decisions

### D1. Interpreter resolved from `client/.nvmrc`
Generalize `pbot-api`'s `apiNode()` into `nvmNode(dir)`, which reads `<dir>/.nvmrc` and returns the newest `~/.nvm/versions/node/v<major>.*/bin/node`. If that major isn't installed, it throws a clear error. The API entry calls `nvmNode(__dirname)` and the client entry calls `nvmNode(path.join(__dirname, "client"))`.

The client owns its Node major in its own repo, so the two can move independently.

*Alternatives considered:*
- **Hard-code a v26 path:** this is how the v16/v18 drift happened.
- **Reuse pbot-api's `.nvmrc`:** couples the client to the API's runtime.
- **`interpreter: "node"`:** runs on the daemon's Node 18.

### D2. Run `craco start`, not `react-scripts start`
Script `./node_modules/@craco/craco/dist/bin/craco.js` with `args: "start"`.

Local `npm start` and the prod `npm run build` both go through CRACO (`util`/`stream`/`buffer`/`process`/`zlib` fallbacks plus `ProvidePlugin`). Dev was the only environment without them. That means a polyfill-dependent bug, such as PDF export using `Buffer`, could appear or hide only on dev.

*Alternative considered:* keep `react-scripts` so the change only touches the runtime. Rejected because the cutover already deletes and recreates the process, so this is the cheapest moment to align.

### D3. `watch: false`
PM2 watch would restart the whole process on any file change in the cwd, including `node_modules` and the webpack cache, while webpack's own watcher has already recompiled. The process already runs with watch off, so this makes the file match. After this change:
- `src/` changes picked up by the deploy's `git reset`: webpack recompiles.
- `package.json` or lockfile changes: run `npm ci` and `pm2 restart pbot-client` manually.

### D4. Baseline declared, not guarded
Add `.nvmrc` (`26`) and `engines.node >=26.12.1`, matching the API.

There's no runtime guard like the API's. The only hook CRACO offers is `craco.config.js`, and that would also fire in `craco build` and `craco test`. A future PM2 entry pointing at `react-scripts` directly would skip it. On dev, `pm2 show pbot-client` (interpreter `v26.*`) is the check, and the runbook verifies it.

*Alternative considered:* a version check in `craco.config.js`. Rejected because it gives unreliable coverage and adds a failure mode to local builds and tests.

## Risks / Trade-offs

- [Switching to CRACO changes the dev bundle (polyfills now injected)] → Prod already ships this exact configuration. The runbook checks a query, a save, and a PDF export on dev.
- [`git pull` in pbot-api on dev conflicts with the local ecosystem edit] → The runbook discards the edit (`git checkout -- ecosystem.config.cjs`) before pulling.
- [The pbot-api `pbot-api` entry regresses while refactoring the resolver] → Verify with `node -e` that both entries resolve to v26 paths before any `pm2` command. Do not touch the running `pbot-api` process (no `pm2 restart all`, no `pm2 update`).
- [PM2 evaluates the whole ecosystem file even with `--only`, so a missing `client/.nvmrc` or Node major stops `pm2 start` for the API too] → `nvmNode` fails with a message naming the missing file or major. The runbook deploys the client commit with `.nvmrc` before pulling pbot-api. Running processes are unaffected: watch restarts and `pm2 restart` reuse the stored config and don't re-read the file.
- [PM2 keeps the old interpreter on restart] → Use `pm2 delete` + `pm2 start`, not `restart`.
- [`DEP0060 util._extend` becomes a hard removal in a later Node] → It works on 26. Revisit when `http-proxy-middleware`/CRA is replaced.
- [Dependency changes no longer trigger a reload on dev] → Documented in CLAUDE.md and NODE-RUNTIME.md. This already matches current behaviour, since the running process has watch off.

## Migration Plan

Dev host only, as `doug`:

1. In `~/repos/pbot-api/client`, run `git pull origin ddm-dev` and confirm `.nvmrc` exists. Then run `git -C ~/repos/pbot-api checkout -- ecosystem.config.cjs` and `git -C ~/repos/pbot-api pull origin ddm-dev`. After verification, fast-forward `master` in both repos.
2. `nvm use 26`. Optionally run `cd ~/repos/pbot-api/client && npm ci`; the Node 18-installed `node_modules` were verified on 26.
3. `cd ~/repos/pbot-api && node -e 'const a=require("./ecosystem.config.cjs").apps; a.forEach(x=>console.log(x.name, x.interpreter, x.script))'`. Both interpreters should be under `v26.*`, and the client script should be `craco.js`.
4. `nvm use 18.20.8`, then `pm2 delete pbot-client`, `pm2 start ecosystem.config.cjs --only pbot-client`, `pm2 save`.
5. Verify:
   - `pm2 show pbot-client` shows interpreter `v26.*`, script `…/craco/dist/bin/craco.js`, args `start`, watch ✘.
   - `pm2 logs pbot-client` shows `Compiled successfully`.
   - In the browser: load the site, run a query, save a record, export a PDF.
6. Once dev is verified, the nginx `Content-Encoding: br` block can be removed on dev. Prod's can be removed at any time.

**Rollback:** check out the previous `pbot-api` ecosystem file and set the client interpreter back to `v18.20.8` locally. Then, on Node 18: `pm2 delete pbot-client && pm2 start ecosystem.config.cjs --only pbot-client && pm2 save`. Keep the `br` block in place while rolled back.

## Open Questions

- What causes the dev process's 35 restarts? It isn't an OOM according to the current error log. Tracked outside this change.
