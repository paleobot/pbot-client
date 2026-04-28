## 1. GraphQL projection changes

- [x] 1.1 In `src/components/OTU/OTUQueryResults.js` standAlone branch, refactor the `holotypeSpecimen.Specimen.describedBy` selection so `Description.pbotID` is always fetched and the heavy fields (`name`, `writtenDescription`, `notes`, `schema { pbotID title }`, `characterInstances { … }`) are wrapped in an inline fragment with `@include(if: $includeHolotypeDescription)`.
- [x] 1.2 In the same standAlone branch, add `describedBy { Description { pbotID } }` to the `typeSpecimens.Specimen` selection.
- [x] 1.3 In the same standAlone branch, add `describedBy { Description { pbotID } }` to the `identifiedSpecimens.Specimen` selection.

## 2. SpecimenTable column (Web)

- [x] 2.1 In `src/components/OTU/OTUweb.js`, add a "Has Description" header cell to `SpecimenTable`'s `TableHead` row.
- [x] 2.2 In the same component, add a body cell that renders a checkmark (e.g., `✓` via MUI `CheckIcon` or a Unicode character consistent with the project style) when `s.Specimen.describedBy?.length > 0`, and renders blank otherwise.

## 3. SpecimenTable column (PDF)

- [x] 3.1 In `src/components/OTU/OTUpdf.js`, add a "Has Description" header cell to the PDF `SpecimenTable`'s header row.
- [x] 3.2 Add a body cell that renders a checkmark glyph when `s.Specimen.describedBy?.length > 0` and renders blank otherwise.
- [x] 3.3 Re-balance the StyleSheet column widths so the new 6-column layout fits the existing PDF page width without horizontal overflow.

## 4. Verification

- [x] 4.1 Manually load the standalone OTU page for an OTU that has at least one described holotype, at least one described type or additional specimen, and at least one un-described specimen; confirm checkmarks appear on the described rows and blanks on the un-described rows in all three tables.
- [x] 4.2 With `includeHolotypeDescription=true`, confirm the Holotype Description accordion still renders schema title, written description, notes, and character instances exactly as before.
- [x] 4.3 With `includeHolotypeDescription=false` (or omitted), confirm the holotype row's Has Description checkmark still renders correctly and the GraphQL response does not include the heavy holotype description fields.
- [x] 4.4 Render the same OTU as PDF (`?format=pdf`) and confirm the new column appears in all three tables and the layout fits the page.
- [x] 4.5 Render the same OTU as JSON (`?format=json`) and confirm `describedBy` is present on the holotype, type, and identified specimens in the dump.
