## Why

Specimens in PBOT can already be cross-referenced to iDigBio, but not to GBIF (Global Biodiversity Information Facility), another major occurrence aggregator. Curators want to record the GBIF occurrence that corresponds to a PBOT specimen and be able to find it directly from the specimen number they already entered, the same way the iDigBio integration works. The backing `gbifID` field already exists on the server and is partially wired through the client, but there is no UI to enter it, no search helper, and no display of it — so today the field is unreachable.

## What Changes

- Add a **GBIF ID** input field to the "Other" tab of the Optional-fields accordion in the Specimen mutate form (`gbifID`, storing the bare GBIF occurrence key — e.g. `6168470317`, not a URL).
- Add a **search button** (iDigBio-style `ManageSearchIcon`) next to that field. It is enabled only when the required Specimen number (`name`) field is populated. Clicking it queries the GBIF occurrence-search API by catalog number and opens a dialog.
- Add a **result-selection dialog**: on a successful query, list matching GBIF occurrences; selecting one mines its `key` and writes it into the `gbifID` field. On failure or no results, show an informational message (mirroring the iDigBio dialog's states).
- Complete the existing partial `gbifID` plumbing: add `gbifID` to the form's `initValues`, an (optional) Yup validator, and to the two query blocks + `massageSpecimen` in `SpecimenQueryResults.js` so display components receive it.
- **Display** the GBIF link on the specimen detail views: `SpecimenWeb.js` renders it as an active hotlink to the human-readable GBIF page (`https://www.gbif.org/occurrence/<gbifID>`); `SpecimenPdf.js` renders it as plain text (no link).

No server change is required — `gbifID: String` already exists on the `Specimen` type and its input type in `pbot-api/schema.graphql`.

## Capabilities

### New Capabilities
- `specimen-gbif-link`: Entry, GBIF-search-assisted lookup, and display of a GBIF occurrence reference on a Specimen.

### Modified Capabilities
<!-- None: no existing spec's requirements change. -->

## Impact

- **Client (this repo):**
  - New file: `src/components/Specimen/GBIFSelect.js` (search button + dialog; modeled on `IDigBioSelect.js`).
  - `src/components/Specimen/SpecimenMutateForm.js` — render `gbifID` field + `GBIFSelect` in the "Other" tab; add `gbifID` to `initValues`; enable/wire the (currently commented-out) validator.
  - `src/components/Specimen/SpecimenQueryResults.js` — add `gbifID` to both gql query blocks and to `massageSpecimen`.
  - `src/components/Specimen/SpecimenWeb.js` — display `gbifID` as a hotlink to the GBIF portal page.
  - `src/components/Specimen/SpecimenPdf.js` — display `gbifID` as plain text.
- **External dependency:** browser `fetch` to `https://api.gbif.org/v1/occurrence/search?catalogNumber=<name>` (public, unauthenticated). Selected value stored is the occurrence `key`.
- **Server (`pbot-api`):** none — field already present.
- **No breaking changes.**
