## Why

The pbot-api server recently introduced five Pattern D fuzzy-search queries — `fuzzyPerson`, `fuzzyReference`, `fuzzySchema`, `fuzzyCollection`, `fuzzyOTU` — that accept the same rich `_<Type>Filter` inputs as the auto-generated node queries. The client today only uses `fuzzyPersonSearch` (now deprecated on the server) for Person, and has no fuzzy UI at all for the four other core entities — even though users hit the same "I don't know the exact spelling" wall searching for References, Schemas, Collections, and OTUs.

This change migrates the Person fuzzy path onto the new `fuzzyPerson` query (removing the client-side post-filter the old query forced) and adds a consistent fuzzy-search checkbox to the four other query forms.

## What Changes

- Add a `fuzzy` boolean to `initialValues` and a "Fuzzy title search" / "Fuzzy name search" checkbox to each of `ReferenceQueryForm`, `SchemaQueryForm`, `CollectionQueryForm`, `OTUQueryForm`. Label text depends on the fuzzy-target field: `title` → "Fuzzy title search"; `name` → "Fuzzy name search".
- In each of `ReferenceQueryResults`, `SchemaQueryResults`, `CollectionQueryResults`, `OTUQueryResults`, branch the GraphQL query on the `fuzzy` flag:
  - Fuzzy on: call `fuzzy<Type>(searchString: <raw value of target field>, filter: <all other filter clauses, minus the target field's regex>, ...)`. Don't wrap the target field in a regex. Don't re-sort results (score order wins).
  - Fuzzy off: unchanged — existing regex-based path continues to apply.
- Migrate `PersonQueryResults` from `fuzzyPersonSearch` to `fuzzyPerson`: pass the existing `_PersonFilter` shape (surname/given/email/orcid/memberOf/pbotID_not_in) as `filter`, drop the `memberOf { pbotID }` projection and the client-side post-filter block. Both fuzzy and non-fuzzy Person paths share one filter shape after this.
- Reference fuzzy is **title-only** (matches the server's `fuzzyReferenceTitleIndex`). `bookTitle` fuzzy matching is deferred; the checkbox label communicates this scope ("Fuzzy title search").
- Each Entity's `*Select` dialog picks up fuzzy for free because the dialog embeds `*QueryForm` + `*QueryResults` — no separate work needed. The plain-dropdown path inside `Inner*Select` is unchanged (it's a pick-from-all list, not a search).
- Update `src/components/Person/FUZZY_SEARCH.md` to describe the new Pattern D client flow and to remove the "Future Improvement: Server-Side Filtering" section (that improvement has now shipped).

## Capabilities

### New Capabilities
- `fuzzy-search-ui`: Fuzzy-search UI for Person, Reference, Schema, Collection, and OTU query forms — a checkbox that swaps the query-target field from regex substring matching to server-side Lucene fuzzy matching while preserving all other filter inputs.

### Modified Capabilities
<!-- None. No pre-existing openspec specs in this repo; fuzzy-search-ui is new. -->

## Impact

- **Query forms**: `ReferenceQueryForm.js`, `SchemaQueryForm.js`, `CollectionQueryForm.js`, `OTUQueryForm.js` gain a `fuzzy` field and a `CheckboxWithLabel`. `PersonQueryForm.js` is unchanged (already has the checkbox).
- **Query results**: `ReferenceQueryResults.js`, `SchemaQueryResults.js`, `CollectionQueryResults.js`, `OTUQueryResults.js` gain a fuzzy branch. `PersonQueryResults.js` is simplified (deletes the client-side post-filter and `memberOf` projection).
- **Docs**: `src/components/Person/FUZZY_SEARCH.md` rewritten to describe the new pattern.
- **Server dependency**: requires pbot-api's `add-fuzzy-search-core-entities` change to be deployed **and** `cypher/setup-fuzzy-indexes.cypher` to have been run in the target Neo4j environment. Missing indexes surface as query-time errors from Neo4j.
- **No breaking changes**: non-fuzzy paths are untouched; `Select` and `Manager` autocomplete dropdowns are untouched; direct-query URLs (`/query/<entity>/:id`) are untouched.
- **Out of scope**: extending fuzzy to the plain-dropdown `Inner*Select` path; expanding Reference fuzzy to cover `bookTitle`; removing the deprecated `fuzzyPersonSearch` resolver (that's a future server change after this client migration lands).
