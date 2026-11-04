## ADDED Requirements

### Requirement: The client SHALL declare a minimum Node.js version patched against CVE-2026-111497

`package.json` SHALL declare `engines.node` as `>=26.12.1`, and the repository root SHALL contain an `.nvmrc` selecting Node 26.

#### Scenario: Engines field present
- **WHEN** `package.json` is inspected
- **THEN** `engines.node` is `>=26.12.1`

#### Scenario: nvm selects Node 26
- **WHEN** a developer runs `nvm use` in the repository root
- **THEN** a Node 26.x runtime is selected

### Requirement: The client SHALL build and serve on the declared runtime

On Node ≥ 26.12.1, `npm ci`, `npm run build` and `npm start` SHALL complete without errors. The dev server SHALL proxy `/graphql` to the API.

#### Scenario: Production build on Node 26
- **WHEN** `npm run build` runs on Node 26.12.1 or later
- **THEN** it exits 0 and writes the bundle to `build/`

#### Scenario: Dev server on Node 26
- **WHEN** `npm start` runs on Node 26.12.1 or later with the API listening on port 4001
- **THEN** the output contains `Compiled successfully`
- **AND** `GET /` returns 200
- **AND** a POST to `/graphql` is answered by the API

### Requirement: The dev host SHALL run the client on the declared runtime via CRACO

The PM2 `pbot-client` entry SHALL start the client with `craco start`, with PM2 file watching disabled. Its interpreter SHALL be the newest nvm-installed Node whose major version matches the client's `.nvmrc`, resolved when PM2 starts the process, and SHALL NOT be a hard-coded version path. If no matching major is installed, resolving the entry SHALL fail with an error naming the missing major.

#### Scenario: PM2 entry resolves to Node 26
- **WHEN** the ecosystem file is loaded on a host with Node 26.x installed under nvm
- **THEN** the `pbot-client` interpreter is a path under `~/.nvm/versions/node/v26.*/bin/node`
- **AND** its script is `@craco/craco/dist/bin/craco.js` with argument `start`
- **AND** `watch` is `false`

#### Scenario: Required major missing
- **WHEN** the ecosystem file is loaded on a host with no Node matching the client's `.nvmrc` major
- **THEN** loading throws an error that names the missing major version

#### Scenario: Running process verified after cutover
- **WHEN** `pm2 show pbot-client` is run on the dev host after cutover
- **THEN** the reported Node.js version is 26.12.1 or later
