## 1. OTU references + authority indicator

- [x] 1.1 In `OTUQueryResults.js`, add `references { Reference { pbotID title year } order publishedInReference }` to the standAlone field set (leave the workbench table fragment and `synonyms.references` untouched)
- [x] 1.2 In `OTUweb.js`, destructure `references` from `props.otu` and add a collapsed "References" accordion immediately before the History accordion; render each reference as a link to `/query/reference/<pbotID>` showing `title, year`, ordered by edge `order`
- [x] 1.3 In `OTUweb.js`, append `(authority source)` next to any reference whose `publishedInReference` is `true`
- [x] 1.4 In `OTUpdf.js`, destructure `references` and add a References section immediately before the History section, marking the `publishedInReference` entry with `(authority source)`

## 2. Specimen references

- [x] 2.1 In `SpecimenQueryResults.js`, add `pbotID` to both `references → Reference` selections
- [x] 2.2 In `SpecimenWeb.js`, add a collapsed "References" accordion immediately before the History accordion; render each reference as a link to `/query/reference/<pbotID>` showing `title, year`, ordered by edge `order`
- [x] 2.3 In `SpecimenPdf.js`, add a References section immediately before the History section

## 3. Schema references (move to dedicated block, singular label)

- [x] 3.1 In `SchemaWeb.js`, remove the inline references listing from the top key-info `Paper` and add a collapsed "Reference" (singular) accordion immediately before the History accordion; render each reference as a link to `/query/reference/<pbotID>` showing `title, year`
- [x] 3.2 In `SchemaPdf.js`, remove the inline references from the key-info area and add a "Reference" section immediately before the History section

## 4. Collection references (reposition before History)

- [x] 4.1 In `CollectionWeb.js`, move the existing References accordion so it sits immediately before the History accordion (currently before Specimens), leaving its content unchanged
- [x] 4.2 In `CollectionPDF.js`, move the existing References section so it sits immediately before the History section

## 5. Verification

- [x] 5.0 Production build compiles cleanly (`npm run build` → "Compiled with warnings"; only pre-existing lint warnings, no errors)
- [x] 5.1 Loaded OTU/Specimen/Schema/Collection direct-query URLs (headless Chrome against the running app); References block renders immediately before History on each, with working `/query/reference/<pbotID>` links
- [x] 5.2 Confirmed web: OTU `fd54f172…` shows `(authority source)` only on its `publishedInReference` reference ("Manual of Fruits and Seeds Descriptions, 2023"); PDF uses the same data path (code-verified, not visually rendered headlessly)
- [x] 5.3 Confirmed Schema web key-info captions no longer include "References"; refs now render in the singular "Reference" accordion before History, not duplicated
- [x] 5.4 Verified by construction: only standAlone/detail query+display paths were changed; no non-standAlone or fuzzy-search query/UI was touched
