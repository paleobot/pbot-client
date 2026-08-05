## 1. GBIFSelect component

- [x] 1.1 Create `src/components/Specimen/GBIFSelect.js`, modeled on `IDigBioSelect.js` (imports: MUI Dialog/List/Link/IconButton/Tooltip, `ManageSearchIcon`, `useFormikContext`).
- [x] 1.2 Implement `GBIFDialog`: on mount `fetch` `https://api.gbif.org/v1/occurrence/search?catalogNumber=<encodeURIComponent(values.name)>`; track `loading` / `error` / `results` state.
- [x] 1.3 Render dialog states — loading indicator, error message ("Error from GBIF: …"), empty ("No occurrences found"), and a `List` of results showing `scientificName, institutionCode, catalogNumber, country, year` (primary) and `key: <key>` (secondary), each a `ListItemButton`. Include a Cancel action and an out-link to the GBIF site.
- [x] 1.4 Implement the outer `GBIFSelect`: `IconButton` with `ManageSearchIcon`, `color="secondary"`, tooltip, `disabled={!formikProps.values.name}`; opens the dialog; `handleSelect(result)` calls `setFieldValue("gbifID", result.key)` and closes.

## 2. Specimen mutate form wiring

- [x] 2.1 Import `GBIFSelect` in `SpecimenMutateForm.js`.
- [x] 2.2 Add `gbifID: ''` to `initValues`.
- [x] 2.3 In the "Other" tab (`TabPanel value="1"`), add a `<Stack direction="row" spacing={0}>` with a `gbifID` `SensibleTextField` (label "GBIF ID") + `<GBIFSelect/>`, following the iDigBio Stack pattern.
- [x] 2.4 Enable a `gbifID` entry in the Yup `validationSchema` (activated the drafted submit-time GBIF existence check against `https://api.gbif.org/v1/occurrence/<id>`, matching the active iDigBio uuid validator; empty value passes).

## 3. Query plumbing for display

- [x] 3.1 Add `gbifID` to both gql query blocks in `SpecimenQueryResults.js` (~line 67 and ~line 187).
- [x] 3.2 `massageSpecimen` (~line 408) already spreads `{...sp}`, so `gbifID` flows to `SpecimenWeb`/`SpecimenPdf` automatically — no explicit change needed.

## 4. Display

- [x] 4.1 In `SpecimenWeb.js`, add a `Box` (near the iDigBio Box) that, when `s.gbifID` is truthy, renders a MUI `<Link href={`https://www.gbif.org/occurrence/${s.gbifID}`} target="_blank">` (labeled "GBIF").
- [x] 4.2 In `SpecimenPdf.js`, add a `renderField("GBIF", s.gbifID)` (near the iDigBio field) as plain, non-hyperlinked text; `renderField` already returns null when absent.

## 5. Verify

- [ ] 5.1 Manual check: create a specimen with a specimen number, use the search button to find and select a GBIF occurrence, save, and confirm the bare `key` is stored.
- [ ] 5.2 Manual check: open the specimen detail (web) and confirm the GBIF link opens `https://www.gbif.org/occurrence/<key>`; confirm the PDF shows plain text.
- [ ] 5.3 Manual check: search button is disabled with an empty specimen number; no-result and error dialogs display correctly.
