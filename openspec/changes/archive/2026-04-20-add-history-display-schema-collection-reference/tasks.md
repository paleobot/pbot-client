## 1. Schema

- [x] 1.1 In `src/components/Schema/SchemaQueryResults.js`, add `enteredBy { timestamp type Person { given middle surname } }` to the standAlone gql query variant only
- [x] 1.2 In `SchemaQueryResults.js`, add an inline massage guarded by `if (props.standAlone)` that sets `schema.history = sort(schema.enteredBy.map(...), "timestamp")` with shape `{ timestamp, type, person }`, following the Specimen pattern
- [x] 1.3 In `src/components/Schema/SchemaWeb.js`, append a collapsed `History` accordion at the end of the accordion stack, rendering a table of `history` entries (timestamp / type / person), matching `OTUweb.js:488-520`
- [x] 1.4 In `src/components/Schema/SchemaPdf.js`, add a History section with per-entry rows and a "No history available" fallback when `history` is empty, matching `OTUpdf.js:277-297`
- [x] 1.5 Manually verify the Schema direct-query URL renders the new accordion and PDF export
- [x] 1.6 Manually verify the Schema workbench search (including fuzzy) still works and renders no history UI

## 2. Collection

- [x] 2.1 In `src/components/Collection/CollectionQueryResults.js`, add `enteredBy { timestamp type Person { given middle surname } }` to the standAlone gql query variant only
- [x] 2.2 In `CollectionQueryResults.js`, add an inline massage guarded by `if (props.standAlone)` that sets `collection.history = sort(collection.enteredBy.map(...), "timestamp")`
- [x] 2.3 In `src/components/Collection/CollectionWeb.js`, append a collapsed `History` accordion at the end of the accordion stack with the same table structure
- [x] 2.4 In `src/components/Collection/CollectionPDF.js`, add a History section with per-entry rows and a "No history available" fallback
- [x] 2.5 Manually verify the Collection direct-query URL and PDF export
- [x] 2.6 Manually verify the Collection workbench search (including fuzzy and enterers filter) still works and renders no history UI

## 3. Reference

- [x] 3.1 In `src/components/Reference/ReferenceQueryResults.js`, add `enteredBy { timestamp type Person { given middle surname } }` to the standAlone gql query variant only
- [x] 3.2 In `ReferenceQueryResults.js`, add an inline massage guarded by `if (props.standAlone)` that sets `reference.history = sort(reference.enteredBy.map(...), "timestamp")`
- [x] 3.3 In `src/components/Reference/ReferenceWeb.js`, append a collapsed `History` accordion at the end of the accordion stack with the same table structure
- [x] 3.4 In `src/components/Reference/ReferencePDF.js`, add a History section with per-entry rows and a "No history available" fallback
- [x] 3.5 Manually verify the Reference direct-query URL and PDF export
- [x] 3.6 Manually verify the Reference workbench search still works and renders no history UI

## 4. Cross-cutting verification

- [x] 4.1 Run `npm start` and exercise the three direct-query pages against local `pbot-api`
- [x] 4.2 Confirm an entity with zero `enteredBy` edges renders without error in both web and PDF views
- [x] 4.3 Confirm that `enteredBy` is NOT present in the GraphQL request body for any non-standAlone query (inspect network tab)
