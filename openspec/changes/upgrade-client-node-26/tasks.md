## 1. Client runtime baseline (this repo)

- [x] 1.1 Add `.nvmrc` containing `26`
- [x] 1.2 Add `"engines": {"node": ">=26.12.1"}` to `package.json` (leave `package-lock.json` otherwise untouched; confirm `npm ci` on Node 26 still succeeds)
- [x] 1.3 On Node 26: run `npm run build` (with `BUILD_PATH` pointed outside the repo) and `npm start`, and confirm `Compiled successfully`, `GET /` 200 and that the `/graphql` proxy answers

## 2. PM2 entry (pbot-api, cross-repo)

- [x] 2.1 In `/home/douglas/repos/pbot-api/ecosystem.config.cjs`, generalize `apiNode()` into `nvmNode(dir)`, which reads `<dir>/.nvmrc`; the `pbot-api` entry uses `nvmNode(__dirname)` with unchanged behaviour
- [x] 2.2 Change the `pbot-client` entry: `script: "./node_modules/@craco/craco/dist/bin/craco.js"`, `args: "start"`, `interpreter: nvmNode(path.join(__dirname, "client"))`, `watch: false`; remove the hard-coded `/home/doug/.../v16.17.0` path and update the header comment
- [x] 2.3 Verify locally with `node -e`: both entries resolve to `v26.*` paths (with a `client/.nvmrc` present in a scratch layout or on the server); a missing major throws a clear error

## 3. Documentation

- [x] 3.1 `pbot-api/NODE-RUNTIME.md`: fix the "PM2 interpreter" paragraph, the "Other Node runtimes" table and the cutover log so prod has no `pbot-client` Node process; document the client entry (CRACO, `client/.nvmrc`, watch off)
- [x] 3.2 `pbot-api/NODE-RUNTIME.md`: add the dev client cutover runbook and rollback (from design.md Migration Plan), including discarding the local ecosystem edit before pulling
- [x] 3.3 `pbot-api/NODE-RUNTIME.md`: state that the nginx `Content-Encoding: br` block can be removed on prod now and on dev after cutover
- [x] 3.4 This repo's `CLAUDE.md`: replace the "PM2 watcher picks up the change" claim (dev runs `craco start` under PM2 with watch off; webpack recompiles `src/`; dependency changes need `npm ci` + `pm2 restart pbot-client`) and mention `.nvmrc` / Node 26

## 4. Dev host cutover (manual, user-run)

- [ ] 4.1 In `~/repos/pbot-api/client`, `git pull origin ddm-dev` and confirm `.nvmrc` exists; then `git -C ~/repos/pbot-api checkout -- ecosystem.config.cjs && git -C ~/repos/pbot-api pull origin ddm-dev`
- [ ] 4.2 `nvm use 26`; optionally `cd ~/repos/pbot-api/client && npm ci`
- [ ] 4.3 Check that both ecosystem entries print `v26.*` interpreters and the client script is `craco.js`
- [ ] 4.4 `nvm use 18.20.8`; `pm2 delete pbot-client && pm2 start ecosystem.config.cjs --only pbot-client && pm2 save`
- [ ] 4.5 Verify: `pm2 show pbot-client` (Node ≥ 26.12.1, craco script, args `start`, watch ✘); `pm2 logs pbot-client` shows `Compiled successfully`; in the browser, load the site, run a query, save a record, export a PDF
- [ ] 4.6 Record the cutover in `NODE-RUNTIME.md`'s cutover log; then remove the nginx `br` block on dev and prod (outside both repos) when ready
