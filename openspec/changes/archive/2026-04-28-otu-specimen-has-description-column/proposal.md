## Why

The standalone OTU display page (Web and PDF) lists holotype, other type, and additional specimens in tables, but gives no indication of which specimens have been described. Users currently have to click through to each specimen to find out, which is tedious for OTUs with many specimens and obscures coverage gaps in the description data.

## What Changes

- Add a "Has Description" column to the `SpecimenTable` component in both `OTUweb.js` and `OTUpdf.js`. Render a checkmark when the specimen has at least one visible Description, blank otherwise.
- Always fetch a minimal `describedBy { Description { pbotID } }` projection on `holotypeSpecimen`, `typeSpecimens`, and `identifiedSpecimens` in the standalone OTU GraphQL query (`OTUQueryResults.js`).
- Move the existing heavy holotype-description fields (name, writtenDescription, notes, schema, characterInstances) behind an inline-fragment `@include(if: $includeHolotypeDescription)` so the existing Holotype Description accordion continues to work without redundant payload.

## Capabilities

### New Capabilities
- `otu-specimen-description-indicator`: Display a per-specimen indicator of whether each specimen on the standalone OTU page has at least one description visible to the viewer.

### Modified Capabilities

None. The existing Holotype Description accordion is unaffected; only the GraphQL projection shape changes around it.

## Impact

- `src/components/OTU/OTUQueryResults.js` — standAlone GQL block: gating change on `holotypeSpecimen`, additive on `typeSpecimens` and `identifiedSpecimens`.
- `src/components/OTU/OTUweb.js` — `SpecimenTable` gains a column.
- `src/components/OTU/OTUpdf.js` — `SpecimenTable` gains a column; PDF column widths in the StyleSheet adjust to fit.
- No server (`pbot-api`) change.
- No change to `src/util/normalize.js` or `OTUs.js` — `Specimen.describedBy` is already in `RICH_REL_FIELDS` and `normalizeEntity("Specimen", …)` is already called for all three specimen sets.
- Workbench (non-standAlone) GQL branch unaffected; `OTUweb`/`OTUpdf` are only rendered on the standalone direct-query path (`OTUs.js:223`).
- Group scoping: the column reflects "has a description visible to the current viewer." A specimen with descriptions only in groups outside the viewer's scope renders as blank. This is intentional and consistent with the rest of the page.
- JSON export (`?format=json`) automatically includes the new field; no extra work.
