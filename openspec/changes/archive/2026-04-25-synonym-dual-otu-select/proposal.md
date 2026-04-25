## Why

The Synonym mutate form requires the user to pick exactly two OTUs from a single multi-select dropdown. That control is a one-off, flat-list select with no search or filtering — it does not share the UX affordances of the shared `OTUSelect` component used everywhere else in the app (magnifying-glass dialog backed by the full OTU query form). Switching to two instances of the shared `OTUSelect` gives users structured search for each of the two taxa being synonymized, and removes a duplicated picker implementation.

## What Changes

- Replace the local module-scoped `OTUSelect` inside `SynonymMutateForm.js` with two instances of the shared `OTUSelect` component from `src/components/OTU/OTUSelect.js`.
- Bind the two slots to scalar Formik fields `otu0` and `otu1` (not bracket-paths into an `otus` array). This avoids a Formik 2.2.9 path-resolution asymmetry between `setFieldValue` and `Field`/`useField` that surfaced when binding to `otus[0]`/`otus[1]` (the dialog-path selection silently failed to manifest in the form).
- Translate the two scalar form fields into the `otus: [pbotID, pbotID]` array that the API expects in `SynonymMutateResults.js`, matching the existing form-to-API shape-adaptation pattern used by other `*MutateResults` components. The form has no awareness of the `otus` array shape.
- Yup validation operates on the scalar fields: each `otu0`/`otu1` is required, and `otu1` must differ from `otu0`.
- Delete the now-unused local `OTUSelect` definition and the unused `useState` import from `SynonymMutateForm.js`.
- **No changes** to `OTUSelect.js`, `OTUQueryResults.js`, or any other caller. The existing `exclude` prop on `OTUSelect` remains vestigial (threaded but not honored) and is intentionally out of scope.

## Capabilities

### New Capabilities
- `synonym-dual-otu-select`: Covers the Synonym mutate form's presentation of OTU selection as two separate pickers backed by the shared `OTUSelect`, along with the distinct-pair validation rule.

### Modified Capabilities
<!-- None. No existing spec's requirements are changing. -->

## Impact

- **Code**: Two files.
  - `src/components/Synonym/SynonymMutateForm.js`: local `OTUSelect` (lines ~106–151) deleted; two shared `OTUSelect` instances added inside the existing "Required fields" accordion bound to `name="otu0"` / `name="otu1"`; `initValues` gains `otu0`/`otu1` (and drops `otus`); Yup schema rewritten in terms of the scalar fields; `SynonymSelect`'s edit-mode populate writes `otu0`/`otu1` from the loaded synonym's OTU array.
  - `src/components/Synonym/SynonymMutateResults.js`: builds `otus: [otu0, otu1]` (or `null` when both are empty) from the scalar query params before passing to `Mutator`.
- **GraphQL / API**: No change. The `Mutator` still receives `{otus: [pbotID, pbotID], ...}`; the server resolver and `schema.graphql` on `pbot-api` are untouched.
- **Edit-mode populate path**: `SynonymSelect` (same file) populates `values.otu0` and `values.otu1` from the loaded synonym's OTU array; the two shared `OTUSelect` instances pick them up via their scalar names with no further glue.
- **Other callers of shared `OTUSelect`** (`OTUMutateForm`, `SpecimenQueryForm`, `CollectionQueryForm`, `OTUQueryForm`): unaffected — they do not pass `exclude` and the shared component's public API is unchanged.
- **Risk**: Low. Single-file change, no server coordination, no migration. The new Yup `distinct` test is the only net-new behavior a user could encounter; the error message is the mitigation.
