## 1. ReferenceManager: gated published-in radio

- [x] 1.1 Add a `displayPublishedIn` prop (default falsy); render all new UI only when truthy.
- [x] 1.2 When enabled, render a "Published in" column header and a per-row MUI `<Radio>` (not a `RadioGroup`), with `checked={reference.publishedInReference === true}`.
- [x] 1.3 Implement the `onClick` toggle via the `FieldArray` render-prop `form` bag: re-click the flagged row clears it; clicking another row sets that row `true` and all others `false`.
- [x] 1.4 Disable the radio when `reference.pbotID === ''`.
- [x] 1.5 Wrap the radio in an MUI `<Tooltip title="Click again to clear">`.
- [x] 1.6 Confirm consumers that omit `displayPublishedIn` render unchanged (no header, no radio).

## 2. OTUMutateForm: enable and seed

- [x] 2.1 Pass `displayPublishedIn` to `<ReferenceManager>`.
- [x] 2.2 Add `publishedInReference: false` to the default reference row object in `initValues`.

## 3. OTUSelect: edit-mode round-trip

- [x] 3.1 Add `publishedInReference` to the `references` selection in the `populateMode="full"` GraphQL query.
- [x] 3.2 Include `publishedInReference` (defaulting to `false`) when mapping `otu.references` in the `references` `setFieldValue` hydration call.

## 4. Verify

- [x] 4.1 Confirm `references` (with `publishedInReference`) flows through `OTUMutateResults.js` → `Mutator.js` into `OTUInput` without further change. (Verified by code: `references` passes straight through; server `CitedByInput` accepts the field. Production build compiles cleanly.)
- [x] 4.2 Create an OTU flagging one reference; confirm the mutation sends `publishedInReference: true` for that row and `false` for others. _(Verified in running app.)_
- [x] 4.3 Edit that OTU; confirm the published-in radio pre-selects the saved reference. _(Verified in running app.)_
- [x] 4.4 Verify toggle-off (re-click clears) and exclusive-select (switching rows moves the flag). _(Verified in running app.)_
- [x] 4.5 Spot-check a non-OTU reference manager (e.g. Collection or Schema) to confirm no published-in UI appears. _(Verified in running app.)_
