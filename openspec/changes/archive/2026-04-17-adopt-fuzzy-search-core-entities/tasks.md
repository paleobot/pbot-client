## 1. Spike: validate the client Pattern D flow on Reference

- [x] 1.1 Confirm pbot-api's `add-fuzzy-search-core-entities` change is deployed to dev and that `cypher/setup-fuzzy-indexes.cypher` has been run against the dev Neo4j (if not, coordinate this before proceeding — fuzzy queries will error otherwise)
- [x] 1.2 Add a `fuzzy: false` entry to `initValues` in `src/components/Reference/ReferenceQueryForm.js` and render a `CheckboxWithLabel` labeled "Fuzzy title search" immediately under the existing `title` field
- [x] 1.3 In `src/components/Reference/ReferenceQueryResults.js`, branch on `queryParams.fuzzy`: when true, issue `fuzzyReference(searchString: <raw title>, filter: { AND: [...] })` with every non-title filter clause preserved; when false, execute the existing query unchanged
- [x] 1.4 In the fuzzy branch, normalize `data.fuzzyReference` into the same local variable the non-fuzzy branch uses, and skip the `sort(references, "year", "title")` call when `fuzzy` is true
- [x] 1.5 In the fuzzy branch, pass the raw title value (no `(?i).*X.*` wrapping) and omit both the `title_regexp` and `bookTitle_regexp` clauses from the filter
- [x] 1.6 Manual verification: `npm start`, open `/query/reference`, type a well-known title fragment with a deliberate misspelling, tick the box, submit — confirm the misspelled-target record appears and results are in score order (not alphabetical)
- [x] 1.7 Manual verification: same search with `fuzzy` unchecked — confirm identical behavior to before this change (regex substring match, sorted by year then title)
- [x] 1.8 Manual verification: fuzzy ON + `year` filter — confirm only fuzzy-matching References with that year are returned
- [x] 1.9 Manual verification: open a form that embeds `ReferenceSelect` (e.g., `OTUMutateForm`'s `ReferenceManager`), click the search icon, confirm the Dialog shows the "Fuzzy title search" checkbox and that a fuzzy search inside the dialog selects correctly into the parent form
- [x] 1.10 Manual verification: standalone/direct-query paths (`/query/reference/:id`) are unaffected — hit one directly and confirm it still renders via the non-workbench branch
- [x] 1.11 If any of 1.6–1.10 reveals a divergence from `design.md`, update `design.md` (and `specs/fuzzy-search-ui/spec.md` if requirements shifted) before continuing to task group 2

## 2. Migrate Person off `fuzzyPersonSearch`

- [x] 2.1 In `src/components/Person/PersonQueryResults.js`, replace the `fuzzyPersonSearch` GraphQL query with a `fuzzyPerson(surname: $surname, given: $given, middle: $middle, filter: _PersonFilter)` query that accepts the same `_PersonFilter` shape the non-fuzzy branch already uses (email / orcid / memberOf_some / pbotID_not_in)
- [x] 2.2 Remove the `memberOf { pbotID }` projection — group scoping now lives in `_PersonFilter`'s `memberOf_some` clause on both branches
- [x] 2.3 Delete the client-side post-filter block that filters `given` / `email` / `orcid` / `pbotID` / `groups` / `excludeList` in JavaScript after the fuzzy query resolves
- [x] 2.4 Collapse the filter-variable construction so that both fuzzy and non-fuzzy branches pass the same `_PersonFilter` shape; the fuzzy branch additionally passes `surname` / `given` / `middle` as top-level `fuzzyPerson` args (no regex wrap), and omits `surname_regexp` / `given_regexp` from the filter
- [x] 2.5 Preserve the "no client-side sort on fuzzy results" rule — `alphabetize(people, "surname")` only runs when `fuzzy` is false
- [x] 2.6 Manual verification: fuzzy surname search (e.g., "Darwen") still finds near-spelling persons, and the results are score-ordered
- [x] 2.7 Manual verification: fuzzy ON + non-empty email — confirm the email filter narrows results (i.e., the server-side filter replaced the old client-side post-filter correctly)
- [x] 2.8 Manual verification: fuzzy ON + explicit group selection — confirm cross-group persons are not returned
- [x] 2.9 Manual verification: fuzzy OFF behavior is unchanged end-to-end
- [x] 2.10 Grep the entire `src/` tree for `fuzzyPersonSearch` — confirm zero remaining call sites

## 3. Replicate for Schema

- [x] 3.1 Add `fuzzy: false` to `SchemaQueryForm` `initValues` and render "Fuzzy title search" `CheckboxWithLabel` adjacent to the `title` field
- [x] 3.2 In `SchemaQueryResults.js`, add the fuzzy branch: call `fuzzySchema(searchString: <raw title>, filter: { ... non-title clauses })`; preserve all other filter clauses; skip client-side sort on fuzzy results
- [x] 3.3 Manual verification: fuzzy ON finds misspelled-title Schemas; fuzzy OFF unchanged; `SchemaSelect` search dialog inherits the checkbox

## 4. Replicate for Collection

- [x] 4.1 Add `fuzzy: false` to `CollectionQueryForm` `initValues` and render "Fuzzy name search" `CheckboxWithLabel` adjacent to the `name` field
- [x] 4.2 In `CollectionQueryResults.js`, add the fuzzy branch: call `fuzzyCollection(searchString: <raw name>, filter: { ... non-name clauses })`. Collection's filter construction is string-concatenated and conditional — ensure the fuzzy branch still composes correctly with all optional filter clauses (`partsPreserved`, `notableFeatures`, `specimens_some`, `location_distance_lt`, etc.)
- [x] 4.3 Skip `sort(collections, ...)` on fuzzy results
- [x] 4.4 Manual verification: fuzzy ON finds misspelled-name Collections; fuzzy ON combined with `partsPreserved` narrows correctly; fuzzy OFF unchanged; `CollectionSelect` search dialog inherits the checkbox

## 5. Replicate for OTU

- [x] 5.1 Add `fuzzy: false` to `OTUQueryForm` `initValues` (keeping the existing large init-values block intact) and render "Fuzzy name search" `CheckboxWithLabel` adjacent to the top-level `name` field
- [x] 5.2 In `OTUQueryResults.js`, add the fuzzy branch: call `fuzzyOTU(searchString: <raw name>, filter: { ... non-name clauses })`. OTU has the most filter clauses (taxonomy + fossil characteristics + description + time + location + stratigraphy + specimen + metadata) — verify that exercising an accordion section in fuzzy mode still composes correctly
- [x] 5.3 Skip client-side re-sort on fuzzy results
- [x] 5.4 Manual verification: fuzzy ON finds misspelled-name OTUs; fuzzy ON + stratigraphic-formation filter narrows correctly; fuzzy ON + a description/character-instance filter narrows correctly; fuzzy OFF unchanged; `OTUSelect` search dialog inherits the checkbox

## 6. Documentation

- [x] 6.1 Rewrite `src/components/Person/FUZZY_SEARCH.md`:
  - Describe Pattern D as implemented across all five entities
  - Delete the "Future Improvement: Server-Side Filtering" section
  - Delete the client-side post-filter table (no longer applies)
  - Reference the server's `add-fuzzy-search-core-entities` change for the server contract
  - Note that `fuzzyPersonSearch` is deprecated server-side and no longer invoked client-side
- [x] 6.2 Verify the `CLAUDE.md` section mentioning Person fuzzy search does not need updates (spot-check it against the new code)

## 7. Cross-entity regression sweep

- [x] 7.1 With fuzzy OFF on every entity, run a representative query on each (Person, Reference, Schema, Collection, OTU) and confirm no behavior change vs. pre-change master
- [x] 7.2 With fuzzy ON on every entity, run representative queries and confirm each hits the correct `fuzzy<Type>` field (check the Network tab's GraphQL operation name)
- [x] 7.3 Confirm no `fuzzyPersonSearch` calls appear in the network tab for any UI path
- [x] 7.4 Confirm reset buttons on all five forms clear `fuzzy` back to `false`
