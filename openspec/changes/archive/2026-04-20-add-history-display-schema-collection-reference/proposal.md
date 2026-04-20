## Why

OTU and Specimen direct-query pages (and their PDF exports) display an edit/entry history accordion showing who created and modified the record. Schema, Collection, and Reference direct-query pages lack this, even though the server already exposes the `enteredBy` relationship for all three entities. Users viewing these records have no way to see provenance (who entered the record and when) from the client.

## What Changes

- Display an entry history on Schema, Collection, and Reference direct-query pages (web view), as a collapsed accordion at the bottom of the existing accordion stack — mirroring the OTU/Specimen pattern.
- Include the same history section in the Schema, Collection, and Reference PDF exports.
- Only fetch `enteredBy` and build the history list in the `standAlone` code path of each entity's `*QueryResults.js`. The fuzzy and non-standAlone workbench queries are untouched.
- No server changes (the `Schema.enteredBy`, `Collection.enteredBy`, and `Reference.enteredBy` fields already exist).

## Capabilities

### New Capabilities
- `entity-history-display`: Shared capability describing how entity history (timestamp / action type / person) is fetched on direct-query pages and rendered in both the web and PDF views for core entities.

### Modified Capabilities
<!-- None. No existing spec defines the current OTU/Specimen history behavior, and this change only adds new display on three entities without altering any already-specified behavior. -->

## Impact

- **Client code** (9 files):
  - `src/components/Schema/SchemaQueryResults.js`, `SchemaWeb.js`, `SchemaPdf.js`
  - `src/components/Collection/CollectionQueryResults.js`, `CollectionWeb.js`, `CollectionPDF.js`
  - `src/components/Reference/ReferenceQueryResults.js`, `ReferenceWeb.js`, `ReferencePDF.js`
- **GraphQL**: additional `enteredBy { timestamp type Person { given middle surname } }` selection on the standAlone query variant for each of the three entities. No schema or resolver changes.
- **DirectQueryResults files**: untouched; they already set `standAlone: true` and reuse the `*QueryResults` component.
- **Non-standAlone (workbench) and fuzzy queries**: unchanged. Payload size for the list-view workbench search is not affected.
- **No new dependencies.**
