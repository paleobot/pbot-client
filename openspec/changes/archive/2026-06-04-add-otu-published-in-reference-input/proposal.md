## Why

The pbot-api server added a `publishedInReference: Boolean` field on the `OTUCitedBy` relationship, letting an OTU flag which one of its references is the publication the taxon was published in. The client mutation form currently has no way to set this value, so curators cannot record it.

## What Changes

- Add an opt-in `displayPublishedIn` prop to the shared `ReferenceManager` component. When enabled, each reference row gains a "Published in" radio control.
- Wire the OTU mutate form to enable `displayPublishedIn`, so curators can flag at most one of an OTU's references as the publication of record (mirroring the server's "at most one" constraint).
- Selecting a row's radio flags that reference and clears any other; re-clicking the selected radio clears the flag (toggle-off). Rows with no reference chosen yet have the radio disabled.
- Load and pre-fill the existing `publishedInReference` value when editing an OTU.
- Out of scope: displaying `publishedInReference` in the web/PDF read views. OTU-level references are not rendered in the read views at all today; surfacing them is a separate later change.

## Capabilities

### New Capabilities
- `otu-published-in-reference-input`: Curator-facing input in the OTU mutation form for flagging which attached reference an OTU was published in, gated behind a reusable `ReferenceManager` prop.

### Modified Capabilities
<!-- None: no existing spec's requirements change. -->

## Impact

- `src/components/Reference/ReferenceManager.js` — new gated radio column (shared by ~10 entities; default-off prop keeps all other consumers visually unchanged).
- `src/components/OTU/OTUMutateForm.js` — enable the prop; add `publishedInReference` to the default reference row in `initValues`.
- `src/components/OTU/OTUSelect.js` — add `publishedInReference` to the edit-mode references query and to the hydration mapping (this is the live edit-population path; the equivalent code in `OTUMutateForm.js` is commented-out dead code).
- No change required in `OTUMutateResults.js` / `Mutator.js`: `references` already passes straight through into `OTUInput`, and the server's `CitedByInput` accepts `publishedInReference`.
- No Yup change: the server enforces the ≤1 constraint.
