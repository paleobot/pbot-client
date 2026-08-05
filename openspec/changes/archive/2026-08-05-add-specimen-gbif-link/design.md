## Context

PBOT already integrates iDigBio into the Specimen mutate workbench: a set of fields on the "iDigBio" tab plus an `IDigBioSelect` control that searches iDigBio using form data and lets the user pick a matching record. GBIF is a comparable occurrence aggregator, and the server already exposes a `gbifID: String` field on the `Specimen` type and its input type (`pbot-api/schema.graphql:320, 983`). The client has partial, abandoned plumbing for it: `SpecimenMutateForm.js` queries `gbifID` and loads it on edit, `SpecimenMutateResults.js:54` passes it into the mutation, and `SpecimenSelect.js:35` queries it — but there is no rendered input, no entry in `initValues`, a commented-out validator, no search helper, and no display anywhere.

This change completes and extends that plumbing. It is client-only; no server work is required.

## Goals / Non-Goals

**Goals:**
- Make `gbifID` reachable: enter it manually, or find it via a GBIF search seeded by the specimen number.
- Reuse the established iDigBio interaction pattern so the UI is consistent and low-surprise.
- Display the GBIF reference on both specimen detail views (web hotlink, PDF plain text).

**Non-Goals:**
- No server/schema changes (field already exists).
- No populating of other specimen fields from a GBIF record (unlike the commented-out "populate all" idea in iDigBio) — only the `gbifID` is mined.
- No live re-validation of the stored ID against GBIF on every render; validation is at most a submit-time check.
- No changes to the iDigBio integration.

## Decisions

### Store the bare occurrence key, derive URLs at the edges
`gbifID` holds only the GBIF occurrence `key` (e.g. `6168470317`). Rationale: the field is named `gbifID` and all existing plumbing treats it as an ID; persisting a full URL would be a name/semantics mismatch and duplicate a fixed prefix in every row. URLs are constructed only where needed — the search API URL in `GBIFSelect`, and the portal URL for the web hotlink.
- *Alternative considered:* store the full API URL (as first sketched in the request). Rejected — mismatched with the field name and existing code, and couples stored data to one API path.

### Two distinct URLs: API for search, portal for display
Search uses `https://api.gbif.org/v1/occurrence/search?catalogNumber=<name>` (verified live: returns `{ count, results: [ { key, gbifID, scientificName, institutionCode, catalogNumber, country, year, ... } ] }`). Display links to the human-readable page `https://www.gbif.org/occurrence/<gbifID>`. Note the correct spelling is `occurrence` (two r's); the typo'd `occurence` in the original request is not used.
- *Alternative considered:* hotlink to the raw API JSON (`api.gbif.org/...`). Rejected per user preference for the human-readable portal page.

### New `GBIFSelect.js` modeled on `IDigBioSelect.js`
A new component in `src/components/Specimen/` mirrors `IDigBioSelect`'s structure: an outer `IconButton` (`ManageSearchIcon`, `color="secondary"`) that opens an inner `GBIFDialog`. The dialog fetches on mount via `useEffect`, tracks `loading` / `error` / results state, lists results with `ListItemButton`s, and calls a `handleSelect` that does `formikProps.setFieldValue("gbifID", result.key)`. It reads form values through `useFormikContext()`.
- Button `disabled` keys off `formikProps.values.name` (the required Specimen number), which lives in the Required accordion but is reachable via Formik context from the Other tab.
- List primary text: `scientificName, institutionCode, catalogNumber, country, year`; secondary: `key: <key>`. Guard against missing fields.
- Error/empty states reuse the iDigBio dialog's copy pattern ("Error from GBIF: …", "No occurrences found"), plus a link out to the GBIF site.
- *Alternative considered:* generalize `IDigBioSelect` into one shared component. Rejected — the two APIs differ enough (query shape, response shape, which field is mined) that a shared abstraction would be more tangled than a parallel file; matches the repo's existing "copy the pattern" convention.

### Field + button layout, and validator
In the "Other" tab (`TabPanel value="1"`), add a `<Stack direction="row" spacing={0}>` containing the `gbifID` `SensibleTextField` and `<GBIFSelect/>`, matching the iDigBio Stack at `SpecimenMutateForm.js:480`. Add `gbifID: ''` to `initValues`. Enable a lightweight Yup validator for `gbifID` (`Yup.string()`, optionally the submit-time GBIF existence check already drafted in comments at `:256`); keep it non-blocking so a valid bare key passes.

### Complete the query/display plumbing
Add `gbifID` to both gql query blocks in `SpecimenQueryResults.js` (~`:67` and `:187`) and to `massageSpecimen` (`:408`) so `SpecimenWeb`/`SpecimenPdf` receive it. `SpecimenWeb.js` adds a `Box` (near the iDigBio Box at `:82`) with a MUI `<Link ... target="_blank">` when `gbifID` is truthy. `SpecimenPdf.js` adds a `renderField("GBIF", ...)` (near `:96`) as plain text.

## Risks / Trade-offs

- **GBIF catalog-number search is fuzzy / may return many or zero hits** → the dialog explicitly handles the multi-result (user picks), zero-result, and error cases, mirroring iDigBio; the user always confirms the selection.
- **Stored `gbifID` could become stale if the GBIF occurrence is deleted/merged** → acceptable; same risk profile as the existing iDigBio UUID and PBDB IDs. Optional submit-time validation can catch a bad ID at entry but is not a guarantee over time.
- **Direct browser call to a third-party API (CORS/availability)** → GBIF's public API sends permissive CORS headers and the app already makes the same style of direct `fetch` to iDigBio, so this follows an established, working pattern; failures degrade to the error dialog.
- **Field label naming ("GBIF ID" vs "GBIF link")** → the request called it a "GBIF link" but we store an ID; using the label "GBIF ID" for the input avoids implying a URL is expected, while the *display* is presented as a link.

## Open Questions

- None blocking. (If desired later: whether to also surface `gbifID` in the query-results summary table, and whether to enable the submit-time GBIF existence validator by default vs. leave it as a pure string field.)
