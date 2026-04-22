## 1. Utility module

- [x] 1.1 Create `src/util/normalize.js` with the `RICH_REL_FIELDS` map covering Specimen, OTU, Collection, Reference, Schema, Description, Synonym, and Comment — each entry specifying list fields and singular fields, with explicit inner-key names (cross-reference `pbot-api/schema.graphql` for every field)
- [x] 1.2 Implement `normalizeEntity(type, obj)`: no-op on nullish input, filters list rich-rel fields in place, coerces singular rich-rel fields to `null` when inner entity is null
- [x] 1.3 Add a short comment at the top of `normalize.js` describing the neo4j-graphql-js `OPTIONAL MATCH` quirk, pointing at `pbot-api/schema.graphql` as the source of truth for which fields are rich rels, and pointing at `scripts/check-rich-rel-map.js` as the drift-detection tool

## 2. Drift-detection sanity script

- [x] 2.1 Create `scripts/check-rich-rel-map.js` that parses `../pbot-api/schema.graphql`, identifies rich-rel wrapper types (types with `@relation` directive on the type, having `from` + `to` fields), walks entity types to find fields whose element type is a wrapper, and compares the resulting field set against `RICH_REL_FIELDS` from `src/util/normalize.js`
- [x] 2.2 Script exits 0 when the map matches the schema; exits non-zero with a human-readable diff (missing fields, extra fields, wrong inner keys) otherwise
- [x] 2.3 Script is dev-only: not wired into `package.json` scripts beyond an optional `"check:rich-rels"` entry, not added to CI, runnable via `node scripts/check-rich-rel-map.js`

## 3. Backfill existing scrubber

- [x] 3.1 Replace the hand-filtering block in `src/components/OTU/OTUs.js:35-45` with calls to `normalizeEntity("OTU", otu)` (and any inner `normalizeEntity("Specimen", ...)` calls required for nested data the OTU query fetches)
- [x] 3.2 Verify the `exclusiveTypeSpecimens` / `exclusiveIdentifiedSpecimens` derivations immediately below still work against the normalized data

## 4. Integrate at each `*QueryResults`

- [x] 4.1 `SpecimenQueryResults.js` — normalize each Specimen and any nested entities its query fetches (innermost first)
- [x] 4.2 `OTUQueryResults.js` — normalize nested Specimens inside `identifiedSpecimens`, `typeSpecimens`, `holotypeSpecimen`, and any nested Descriptions, before normalizing the OTU (handled via `OTUs.js` seam, which both `OTUQueryResults` and `OTUDirectQueryResults` flow through)
- [x] 4.3 `CollectionQueryResults.js` — normalize the Collection and any nested Specimens the query fetches
- [x] 4.4 `ReferenceQueryResults.js` — normalize the Reference (both query branches — standard and fuzzy)
- [x] 4.5 `SchemaQueryResults.js` — normalize the Schema (both query branches)
- [x] 4.6 Any other `*QueryResults` that surfaces rich-rel data (Synonym, Comment, Description where applicable) — normalize at the seam (`DescriptionQueryResults` normalized; no `SynonymQueryResults`/`CommentQueryResults` exist — those entities are mutate-only)

## 5. Remove now-redundant local guards (optional cleanup)

- [x] 5.1 Audit `*Web`/`*Pdf`/`*Select` components for ad-hoc `.Inner &&` guards on rich-rel rows that are no longer required for correctness; leave them in place unless they obscure the code, since they're harmless (skipped — existing guards are harmless and leaving them preserves local readability)

## 6. Verification

- [x] 6.1 Run `node scripts/check-rich-rel-map.js` and confirm it exits 0 against the current pbot-api schema
- [x] 6.2 Manually exercise a Specimen with zero `identifiedAs`, zero `describedBy`, zero `typeOf`, zero `holotypeOf`, and zero `references` — verify `SpecimenWeb` and `SpecimenPdf` render without throwing and show the "No ... available" empty states
- [x] 6.3 Manually exercise an OTU with zero `identifiedSpecimens`, zero `typeSpecimens`, and null `holotypeSpecimen` — verify `OTUweb` / `OTUpdf` render without throwing and that `synOTU.identifiedSpecimens.length` displays `0` (not `1`)
- [x] 6.4 Manually exercise a Collection whose child Specimens have empty rich rels — verify `CollectionWeb` / `CollectionPDF` aggregate correctly
- [x] 6.5 Run `npm test` (the smoke test at `src/App.test.js`) to confirm the app still boots
- [x] 6.6 Start the dev server (`npm start`) and smoke-test the main workbench paths: query Specimen, query OTU, query Collection, open a direct-query URL for each
