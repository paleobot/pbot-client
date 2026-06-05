## 1. Query selections (client-only, no API change)

- [x] 1.1 In `src/components/Specimen/SpecimenQueryResults.js`, add `pbotID` to the `describedBy.Description` `schema { }` selection (currently `title` only).
- [x] 1.2 In `src/components/Specimen/SpecimenQueryResults.js`, add `references { Reference { pbotID title year } order }` to the `describedBy.Description` selection.
- [x] 1.3 In `src/components/OTU/OTUQueryResults.js`, add `references { Reference { pbotID title year } order }` to the holotype `holotypeSpecimen.Specimen.describedBy.Description` selection (leave existing `name` and `schema { pbotID title }` unchanged).

## 2. Specimen "Descriptions" display

- [x] 2.1 In `src/components/Specimen/SpecimenWeb.js` (~line 234), change the header to `<description name>` (plain bold) `from schema "<schema title>"` where the schema title is a `Link` to `/query/schema/<schema pbotID>?includeCharacters=true` (mirror the link pattern in `SchemaQueryResults.js`).
- [x] 2.2 In `SpecimenWeb.js`, add a references subsection after the `notes:` row (same `indent` styling), rendering each `references[].Reference` title via `DirectQueryLink type="reference"`; render only when `references.length > 0`.
- [x] 2.3 In `src/components/Specimen/SpecimenPdf.js` (~line 170), change the header to `<name> from schema "<schema title>"` as plain text (no links), and add a plain-text references subsection after notes.

## 3. OTU "Holotype descriptions" display

- [x] 3.1 In `src/components/OTU/OTUweb.js` (~line 321), change the header to `<description name>` (plain bold) `from schema "<schema title>"` with the schema title linked to `/query/schema/<schema pbotID>?includeCharacters=true`.
- [x] 3.2 In `OTUweb.js`, add a references subsection after the `notes:` row (same `indent` styling) with `DirectQueryLink type="reference"` titles; render only when `references.length > 0`.
- [x] 3.3 In `src/components/OTU/OTUpdf.js` (~line 191), change the header to `<name> from schema "<schema title>"` as plain text, and add a plain-text references subsection after notes.

## 4. Verify merged section untouched

- [x] 4.1 Confirm the "Merged exemplar descriptions" code paths in `OTUweb.js` (~line 369) and `OTUpdf.js` (~line 220) are unchanged: header still `From schema "<schema name>"`, no schema link, no references subsection.

## 5. Manual verification

- [x] 5.1 Load a Specimen detail page (web) with descriptions and confirm header shows `<name> from schema "<schema>"`, schema link opens the schema page, and reference titles link to reference pages.
- [x] 5.2 Load an OTU detail page (web) with a holotype description and confirm the same header, schema link, and references behavior; confirm the merged-exemplar accordion is visually unchanged.
- [x] 5.3 Export the Specimen and OTU PDFs and confirm the header text change and plain-text references appear, with no links.
