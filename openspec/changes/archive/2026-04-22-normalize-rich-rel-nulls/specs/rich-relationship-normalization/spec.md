## ADDED Requirements

### Requirement: Centralized rich-relationship normalization utility

The client SHALL expose a single utility module at `src/util/normalize.js` that provides a `normalizeEntity(type, obj)` function and an explicit `RICH_REL_FIELDS` map. The map SHALL enumerate, for each supported entity type, every list-typed rich-relationship field and every singular rich-relationship field, and for each field SHALL specify the exact JSON key under which the inner (target) entity appears.

#### Scenario: Utility module exposes the normalizer and field map
- **WHEN** a client module imports from `src/util/normalize.js`
- **THEN** it can access `normalizeEntity` and `RICH_REL_FIELDS`, and `RICH_REL_FIELDS` contains entries for at least Specimen, OTU, Collection, Reference, Schema, Description, Synonym, and Comment

#### Scenario: Field map records inner key names explicitly
- **WHEN** a developer inspects `RICH_REL_FIELDS.Specimen`
- **THEN** each entry specifies both the field name (e.g. `identifiedAs`) and the inner entity key (e.g. `OTU`), with no reliance on naming-convention inference

### Requirement: List rich-relationship fields normalized to expected shape

`normalizeEntity(type, obj)` SHALL, for every list-typed rich-relationship field declared in `RICH_REL_FIELDS[type]`, filter the array in place so that entries whose inner entity is `null` or `undefined` are removed. An array containing only phantom rows MUST become an empty array.

#### Scenario: Phantom single-row array becomes empty
- **WHEN** `normalizeEntity("Specimen", s)` is called and `s.identifiedAs` is `[{ OTU: null }]`
- **THEN** `s.identifiedAs` becomes `[]`

#### Scenario: Mixed array drops only phantom rows
- **WHEN** `normalizeEntity("Specimen", s)` is called and `s.identifiedAs` is `[{ OTU: { pbotID: "x" } }, { OTU: null }]`
- **THEN** `s.identifiedAs` retains only the row with a non-null `OTU`

#### Scenario: Already-clean array is unchanged
- **WHEN** `normalizeEntity("Specimen", s)` is called and `s.identifiedAs` is `[{ OTU: { pbotID: "x" } }]`
- **THEN** `s.identifiedAs` is unchanged

### Requirement: Singular rich-relationship fields normalized to null when empty

`normalizeEntity(type, obj)` SHALL, for every singular rich-relationship field declared in `RICH_REL_FIELDS[type]`, coerce the field to `null` if the field is present but its inner entity is `null` or `undefined`.

#### Scenario: Phantom singular becomes null
- **WHEN** `normalizeEntity("OTU", otu)` is called and `otu.holotypeSpecimen` is `{ Specimen: null }`
- **THEN** `otu.holotypeSpecimen` becomes `null`

#### Scenario: Populated singular is preserved
- **WHEN** `normalizeEntity("OTU", otu)` is called and `otu.holotypeSpecimen` is `{ Specimen: { pbotID: "x" } }`
- **THEN** `otu.holotypeSpecimen` is unchanged

### Requirement: Normalizer is single-level and no-ops on nullish input

`normalizeEntity` MUST NOT recurse into nested entities. Callers are responsible for walking their query's nesting and normalizing each level explicitly. `normalizeEntity` MUST return its input unchanged when the input is `null` or `undefined`, so that callers can invoke it on optionally-present fields without guarding each call.

#### Scenario: Nested rich rels are not auto-scrubbed
- **WHEN** `normalizeEntity("OTU", otu)` is called on an OTU whose `identifiedSpecimens[0].Specimen.identifiedAs` contains a phantom row
- **THEN** the outer OTU's fields are normalized but the nested Specimen's `identifiedAs` is NOT modified by that call

#### Scenario: Null input is a safe no-op
- **WHEN** `normalizeEntity("Specimen", null)` is called
- **THEN** the function returns without throwing

#### Scenario: Undefined input is a safe no-op
- **WHEN** `normalizeEntity("Specimen", undefined)` is called
- **THEN** the function returns without throwing

### Requirement: Every `*QueryResults` component normalizes its query results

Every client `*QueryResults` component that consumes rich-relationship data from the GraphQL API SHALL pass each entity in its result set through `normalizeEntity` before storing it in state or passing it to any child component. For queries that fetch nested entities containing their own rich-relationship fields, the component SHALL normalize each nesting level that appears in its query, innermost level first.

Because Apollo's `InMemoryCache` returns frozen result objects, `*QueryResults` components SHALL deep-clone entities at the data seam (via the `cloneEntity` helper exported from `src/util/normalize.js`) before invoking `normalizeEntity` on them. Mutating an Apollo-cached object directly throws in strict mode.

#### Scenario: Clone precedes normalize
- **WHEN** a `*QueryResults` component receives entities from `useQuery`
- **THEN** it maps each entity through `cloneEntity` (producing a mutable deep copy) before any `normalizeEntity` call, so the Apollo cache is never mutated

#### Scenario: Top-level entity is normalized before render
- **WHEN** `SpecimenQueryResults` receives GraphQL data containing a Specimen with `identifiedAs: [{ OTU: null }]`
- **THEN** the Specimen passed to `SpecimenWeb` / `SpecimenPdf` has `identifiedAs: []`

#### Scenario: Nested entities are normalized at their own level
- **WHEN** `OTUQueryResults` receives an OTU whose `identifiedSpecimens[0].Specimen.describedBy` contains a phantom row
- **THEN** the inner Specimen's `describedBy` is normalized before the outer OTU is normalized, and the rendered OTU has clean data at every fetched level

#### Scenario: DirectQueryResults inherit normalization
- **WHEN** a user navigates directly to a `/query/<entity>/:id` URL that renders via a `*DirectQueryResults` component
- **THEN** the data reaches the rendering component already normalized, because `*DirectQueryResults` funnels through the matching `*QueryResults`

### Requirement: Existing `OTUs.js` hand-rolled scrubber replaced

The hand-rolled rich-relationship scrubbing in `src/components/OTU/OTUs.js` (the block that filters `typeSpecimens`/`identifiedSpecimens` and nulls `holotypeSpecimen`) SHALL be replaced with calls to `normalizeEntity`. The observable behavior of the containing function MUST be unchanged.

#### Scenario: OTU scrubber uses shared utility
- **WHEN** the code path that previously hand-filtered OTU rich rels executes
- **THEN** it delegates to `normalizeEntity("OTU", otu)` and produces the same resulting object shape it did before the change
