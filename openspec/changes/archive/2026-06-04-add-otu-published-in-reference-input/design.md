## Context

The OTU mutation form manages an OTU's references through the shared `ReferenceManager` component (`src/components/Reference/ReferenceManager.js`), used by ~10 entities. Each reference row is a Formik `FieldArray` element shaped `{ pbotID, order }`.

The server's `OTUCitedBy` relationship now carries `publishedInReference: Boolean`. `CitedByInput` already accepts the field, and the resolver throws if more than one of an OTU's references is flagged `true`. Reference values flow client→server untouched: `OTUMutateResults.js` passes `references` straight through, and `Mutator.js` injects the whole `params` object as `$data: OTUInput!`. So once each row carries the boolean, persistence requires no change to the results/mutator layer.

Edit-mode population is performed by `OTUSelect.js` (`populateMode="full"`), which queries the selected OTU and calls `formikProps.setFieldValue` for each field, including `references` at line ~229. (Note: `OTUMutateForm.js` contains an equivalent commented-out block — it is dead code and is NOT the live path.)

## Goals / Non-Goals

**Goals:**
- Let curators flag at most one of an OTU's references as the one it was published in.
- Keep the control entirely opt-in so the other ~9 `ReferenceManager` consumers are untouched.
- Round-trip the value on create and edit.
- Match the server's "at most one" constraint in the UI so an invalid state is not constructible.

**Non-Goals:**
- Displaying `publishedInReference` in web/PDF read views (separate later change; OTU-level references are not rendered there today).
- Any server-side change (already done).
- Client-side Yup validation of the ≤1 rule (the UI makes >1 unreachable; the server is the source of truth).

## Decisions

**Gated radio column, `displayPublishedIn` prop.** `ReferenceManager` renders the published-in UI only when `displayPublishedIn` is truthy. Default-off means existing consumers pass nothing and see no change. Only `OTUMutateForm` passes the prop.

**Individual `<Radio>` per row, not a `RadioGroup`.** A `RadioGroup`'s `onChange` fires only when the value *changes*, which swallows a re-click of the already-selected radio — defeating toggle-off. Rendering a standalone `<Radio>` per row with `checked={reference.publishedInReference === true}` and the toggle logic in `onClick` (which fires on every click) makes re-click-to-clear work.

**Toggle logic via the `FieldArray` `form` bag.** The `FieldArray` render props expose `form` (the Formik bag). On click, build a new references array and call `form.setFieldValue("references", next)`:
- if the clicked row is already flagged → set only that row's `publishedInReference` to `false` (clear);
- otherwise → set every row's `publishedInReference` to `false`, then the clicked row's to `true` (exclusive select).

**Disable the radio on empty rows.** When `reference.pbotID === ''` (the trailing "add reference" stub), the radio is `disabled` so an empty row can't be flagged.

**Discoverability.** The only persistent text is a short "Published in" column header. The re-click-to-clear gesture is taught via an MUI `<Tooltip title="Click again to clear">` wrapping the radio — hover-only, zero persistent footprint. `Tooltip` and `Radio` are already used in other mutate forms (Collection/Schema/Comment), so this matches house idiom.

**Default row + hydration carry the boolean.** `initValues` in `OTUMutateForm.js` gets `publishedInReference: false` on the default reference row. `OTUSelect.js` adds `publishedInReference` to the edit-mode `references` selection and includes it in the hydration map so editing pre-fills the existing flag.

## Risks / Trade-offs

- **Hidden gesture:** re-click-to-clear is non-standard; users don't expect radios to deselect. Mitigated by the tooltip and by the audience being repeat expert curators. Worst case the data is recoverable (re-pick), and a future iteration could add an explicit clear affordance if needed.
- **Shared component churn:** editing `ReferenceManager` touches a component many entities depend on. Mitigated by gating all new behavior behind a default-off prop; non-OTU render paths take an unchanged code path.
- **Dead-code trap:** the commented-out block in `OTUMutateForm.js` looks like the hydration path but is not. The live edit population is in `OTUSelect.js`; that is where the query/mapping change must land.
