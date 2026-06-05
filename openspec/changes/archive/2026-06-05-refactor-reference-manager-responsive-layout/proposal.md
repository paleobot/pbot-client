## Why

`ReferenceManager` is shared by ~10 forms. Its row layout mixes proportional MUI grid columns (`xs={8}` title, `xs={1}` delete) with fixed-px columns, which breaks down as the window narrows: the delete (`X`) button wraps to a second line or overflows its container. The `add-otu-published-in-reference-input` change fixed this only for the OTU mutate form by gating a robust layout behind `displayPublishedIn`, leaving the same bug in every other consumer and accumulating layout conditionals that exist for general robustness, not for the published-in feature.

## What Changes

- Make the robust, single-line responsive row layout the **single** layout for all `ReferenceManager` consumers, so the delete-button wrap/overflow bug is fixed everywhere.
- Remove the layout conditionals currently gated on `displayPublishedIn`, keeping gated **only** the genuinely OTU-specific UI (the "Published in" header label and the radio column).
- The title-select column becomes **full-width / shrinkable** in all reference forms (previously the theme's fixed ~400px). This is required: a clean `nowrap` row needs a column that can shrink, otherwise `nowrap` trades "X wraps" for "X overflows". **Mildly visible change** to the other ~9 forms (title field grows to fill its cell and shrinks responsively).
- Preserve correct behavior for all existing prop variants: `single`, `omitOrder`, `optional`, default, and `displayPublishedIn`.

## Capabilities

### New Capabilities
- `reference-manager-layout`: The shared reference-row layout contract — responsive single-line rows, aligned columns, and per-variant rendering (`single` / `omitOrder` / `optional` / default / `displayPublishedIn`) that hold up as the container narrows.

### Modified Capabilities
<!-- None: otu-published-in-reference-input's requirements are unchanged; only its implementation rebase changes (the published-in UI now sits on the unified layout rather than a gated one). -->

## Impact

- `src/components/Reference/ReferenceManager.js` — collapse the dual layout into one responsive layout; gate only the published-in header + radio column.
- `src/components/Reference/ReferenceSelect.js` — title-select becomes `fullWidth` and shrinkable (`minWidth: 0`) for all consumers, removing the OTU-only `fullWidth` prop plumbing if it is made unconditional.
- Visual change (intended) to every reference form: Schema, Comment, Specimen (query+mutate), Collection (query+mutate), Synonym, Description, OTU (query+mutate). Each must be eyeballed across widths.
- No GraphQL/server/data changes. No change to `publishedInReference` behavior.
