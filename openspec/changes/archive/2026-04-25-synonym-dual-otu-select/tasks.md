## 1. Wire in the shared OTUSelect

- [x] 1.1 In `src/components/Synonym/SynonymMutateForm.js`, add an import for the shared `OTUSelect` from `../OTU/OTUSelect.js`
- [x] 1.2 Remove the now-unused `useState` from the `react` import on line 1
- [x] 1.3 Delete the module-scoped local `OTUSelect` definition (approx. lines 106–151)
- [x] 1.4 Replace the existing `<OTUSelect values={...} handleChange={...} setFieldValue={...}/>` usage inside the "Required fields" accordion with two instances of the shared `OTUSelect`, using scalar `name="otu0"` / `name="otu1"` and distinct labels ("OTU 1" / "OTU 2"); do not pass `populateMode`

## 2. Update form value shape

- [x] 2.1 Add `otu0: ''` and `otu1: ''` to `initValues`; do not include an `otus` field
- [x] 2.2 Update `SynonymSelect`'s edit-mode `onChange` to populate `props.values.otu0` and `props.values.otu1` from the loaded synonym's `otus` array (in returned order)
- [x] 2.3 Replace the array-shaped `otus` Yup rule with scalar rules: `otu0: Yup.string().required(...)` and `otu1: Yup.string().required(...).test("distinct", ..., function(v) { return !v || v !== this.parent.otu0 })`

## 3. Translate at the API boundary

- [x] 3.1 In `src/components/Synonym/SynonymMutateResults.js`, replace `otus: queryParams.otus || null` with `otus: (queryParams.otu0 && queryParams.otu1) ? [queryParams.otu0, queryParams.otu1] : null`

## 4. Verify behavior

- [x] 4.1 Run `npm start` and load the Synonym mutate form in create mode; confirm both OTU pickers render with labels, both support the magnifying-glass search dialog, and **selecting an OTU via the dialog manifests in the form** (the regression that drove the scalar-binding decision)
- [x] 4.2 In create mode, confirm submit is blocked with appropriate error messages when (a) one slot is empty, (b) both slots hold the same OTU; confirm submit proceeds when both slots hold distinct OTUs and that the resulting `Mutator` payload contains `otus: [pbotID, pbotID]`
- [x] 4.3 In edit mode, pick an existing synonym via the synonym selector and confirm the two shared OTU pickers populate with the loaded synonym's two OTUs, and that saving the edit round-trips correctly
- [x] 4.4 Spot-check that other callers of shared `OTUSelect` (`OTUMutateForm`, `SpecimenQueryForm`, `CollectionQueryForm`, `OTUQueryForm`) still render and behave identically — no regressions expected since no shared code was touched

## 5. Cleanup checks

- [x] 5.1 Confirm no other symbols in `SynonymMutateForm.js` were referencing the deleted local `OTUSelect` or `useState`
- [x] 5.2 ~~Confirm `npm test` (smoke test) still passes~~ — skipped: the smoke test fails at module-load with a preexisting `TextEncoder is not defined` error from `@react-pdf/renderer` under jsdom, unrelated to this change. CI explicitly skips tests, so this is the ambient state, not a regression.
