## Why

Collection detail pages show the collection's references, but the equivalent OTU, Specimen, and Schema detail pages do not surface their own entity-level references consistently: OTU never displays them, Specimen fetches them but never renders them, and Schema buries them inline in the top info block. Curators and visitors viewing an OTU also have no way to see which reference is the taxonomic authority, even though that fact (`publishedInReference`) is already captured at entry time.

## What Changes

- Add an entity-level **References** display (web accordion + PDF section) to the OTU, Specimen, and Schema detail pages, matching the existing Collection treatment.
- Position the References block **immediately before the History block** on every entity that has one — including **Collection**, where the References accordion currently sits before Specimens and will be moved.
- For **Schema**, move the references out of the top key-info block into a dedicated accordion/section, and label it **"Reference"** (singular) — Schema only; the others use "References".
- For **OTU**, append `references` (with `publishedInReference`) to the standAlone GraphQL selection (it is not fetched today) and render `(authority source)` next to any reference whose `publishedInReference` is `true`.
- For **Specimen**, add `pbotID` to the existing `references` selection so each rendered reference links to its `/query/reference/<pbotID>` detail page.

## Capabilities

### New Capabilities
- `detail-page-reference-display`: An entity's own references are rendered as a References block placed immediately before History on its detail page (web + PDF), for OTU, Specimen, Schema, and Collection, with an OTU-specific authority indicator driven by `publishedInReference`.

### Modified Capabilities
<!-- No existing spec's requirements change; entity-history-display still governs the History block, which is unaffected. -->

## Impact

- Client display components: `OTUweb.js`, `OTUpdf.js`, `SpecimenWeb.js`, `SpecimenPdf.js`, `SchemaWeb.js`, `SchemaPdf.js`, `CollectionWeb.js`, `CollectionPDF.js`.
- Client query selections: `OTUQueryResults.js` (standAlone block — add `references` + `publishedInReference`), `SpecimenQueryResults.js` (add `pbotID` to the two `references` selections).
- No server/schema changes: `references` and `OTUCitedBy.publishedInReference` already exist server-side.
- Workbench list views and fuzzy-search paths are out of scope and unchanged.
