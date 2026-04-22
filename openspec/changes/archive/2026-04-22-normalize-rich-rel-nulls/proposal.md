## Why

The client crashes or silently mis-renders when a Specimen (or any other core entity) has rich-relationship edges whose target nodes are filtered out by our fork's group-scope filter. `neo4j-graphql-js` emits a projection row for each matched edge, but when the target fails the `WHERE` predicate the row is emitted with a `null` target, yielding a phantom `[{ Inner: null }]` shape instead of `[]`. (Stock `neo4j-graphql-js` + no target-node filter does not exhibit this — the trigger is the filtered-out-target interaction, specific to our fork.)

### Background: what neo4j-graphql-js does with rich relationships

The PBOT GraphQL schema (in the `pbot-api` repo) uses two different patterns for relationships backed by Neo4j edges:

1. **Simple relationship fields** — declared with `@relation` on the *field*, e.g.
   ```graphql
   partsPreserved: [Organ] @relation(name: "HAS_PART", direction: OUT)
   ```
   These compile to a straightforward `MATCH` and return a plain array of the target type. An empty relationship produces `[]`.

2. **Rich relationship types** — declared with `@relation` on a *type*, e.g.
   ```graphql
   type IdentifiedSpecimenOf @relation(name: "IDENTIFIED_AS") {
       from: Specimen
       to: OTU
       entered_by: ID!
       timestamp: DateTime
   }

   type Specimen {
       identifiedAs: [IdentifiedSpecimenOf]
       ...
   }
   ```
   These let the client read edge properties (`entered_by`, `timestamp`, `order`, etc.) alongside the target node. They are essential: the app uses rich rels to carry author order, citation order, entry audit data, and per-identification metadata.

For rich-rel fields, `neo4j-graphql-js` translates a selection like `identifiedAs { OTU { pbotID name } }` into Cypher that iterates matched edges and, for each edge, projects an object shaped like `{ OTU: <target-node-with-filter-applied>, …edge props… }`. When an edge matches but the target node fails a `WHERE` predicate, the projection still emits a row — with the target evaluated to `null`. The client receives

```json
"identifiedAs": [
  { "__typename": "_SpecimenIdentifiedAs", "OTU": null }
]
```

instead of the expected `[]`. The schema's implied contract ("`[X]` means zero or more") is silently violated.

In PBOT, the `WHERE` predicate that triggers this is our fork's group-scope filter: every entity fetch is constrained to `pbotID_in: $groups` so that viewers only see entities in groups they belong to. A Specimen can have `identifiedAs` edges to OTUs in groups the viewer can't see; the edge still matches but the target gets filtered out, producing the phantom row. A freshly-created Specimen with zero `identifiedAs` edges produces a clean `[]` — no edge, no projection row, no phantom. The bug therefore manifests mostly on production data with cross-group relationships and is absent on fresh or single-group local data (which is exactly what we observed: prod Specimens with private-group OTUs show the phantom shape; locally-created Specimens in the public group do not).

### Impact on the client

Every place the client maps, filters, or indexes into one of these arrays without checking the inner entity is at risk:

- **Crashes** where code does `s.identifiedAs.map(r => r.OTU.pbotID)` — dereferencing `.OTU.pbotID` on the phantom row throws.
- **Silent wrong numbers** where code does `.length` on a rich-rel array — e.g. `synOTU.identifiedSpecimens.length` shows `1` when the true count is `0`.
- **Junk rows** in sort/map pipelines that don't crash but pass `{Inner: null}` downstream (history displays, etc.).

An audit across the live client (excluding dead code in `oldStuff/`, `Description/old/`, and commented-out MenuItem autofill blocks) found ~11 files at real crash risk and ~6 more with milder silent bugs or theoretical exposure. The codebase already handles the quirk in one place — `src/components/OTU/OTUs.js:35-45` hand-filters `typeSpecimens`, `identifiedSpecimens`, and `holotypeSpecimen` — but every other entity lacks equivalent normalization, and the fix isn't centralized.

### Why a client-side normalizer

Three alternatives were evaluated:

- **Server `@cypher` overrides**: would fix every consumer at once, but loses the auto-generated `orderBy`/filter machinery that several client queries rely on (e.g. `authoredBy(orderBy: order_asc)`), and widens blast radius to all API consumers.
- **Per-call-site guards**: ~15–25 identical `.filter(x => x.Inner)` changes, and every future rich-rel render has to remember the pattern.
- **Client-side `normalize.js`**: extends the pattern already established in `OTUs.js`, scrubs at the data seam, keeps renderers clean, and has small blast radius.

The normalizer approach matches existing conventions and is the lowest-risk, most obvious fix.

## What Changes

- Add `src/util/normalize.js` exposing `normalizeEntity(type, obj)` and an explicit `RICH_REL_FIELDS` map keyed by entity type. The map encodes, per entity, the list-typed rich-rel fields and singular rich-rel fields, and for each field the **inner entity key name** (e.g. `describedBy` → `Description`, `identifiedAs` → `OTU`, `authoredBy` → `Person`, `enteredBy` → `Person`). In practice the inner key is always the target type name in the schema, but we spell it out explicitly for reviewability rather than relying on a convention at runtime.
- Add `scripts/check-rich-rel-map.js`, a dev-only sanity script that parses `../pbot-api/schema.graphql` and warns if `RICH_REL_FIELDS` is missing a rich-rel field present in the schema or contains one that no longer exists. Not wired into the build or CI — run on demand when touching rich-rel code or after a server schema change.
- `normalizeEntity` is single-level (no recursion, no nested-children sugar). It mutates `obj` in place, filters each list rich-rel field to drop entries whose inner entity is `null`, and coerces each singular rich-rel field to `null` if its inner entity is `null`. It no-ops on `null`/`undefined` input so callers can use optional chaining freely.
- `normalize.js` also exports a `cloneEntity(obj)` helper that returns a deep, mutable copy via `JSON.parse(JSON.stringify(obj))`. Apollo's `InMemoryCache` returns frozen objects that cannot be mutated in place, so every `*QueryResults` clones each entity with `cloneEntity` before handing it to `normalizeEntity`. JSON round-trip (rather than `structuredClone`) keeps the helper compatible with older browsers; GraphQL responses are plain JSON so the round-trip is lossless.
- Each `*QueryResults` component normalizes every level its query actually fetches, innermost first. Example: `OTUQueryResults` walks `identifiedSpecimens[*].Specimen`, `typeSpecimens[*].Specimen`, and `holotypeSpecimen.Specimen` with `normalizeEntity("Specimen", ...)` before calling `normalizeEntity("OTU", otu)`. Writing out the nesting at the call site keeps the query shape visible and avoids a hidden global type graph.
- Collapse the hand-rolled scrubbing in `src/components/OTU/OTUs.js:35-45` into calls to `normalizeEntity`.
- Update affected call sites so downstream `*Web`, `*Pdf`, and `*Select` components stop needing ad-hoc `.Inner &&` guards on rich-rel rows (existing defensive checks can remain; the goal is that they're no longer *required* for correctness).
- No schema changes, no server changes, no GraphQL query changes.

## Capabilities

### New Capabilities
- `rich-relationship-normalization`: Client-side normalization of neo4j-graphql-js rich-relationship fields, converting the phantom `[{Inner: null}]` shape produced by empty `OPTIONAL MATCH` resolutions into the expected empty-array / null-singular shape before data reaches UI components.

### Modified Capabilities
<!-- None — this change introduces an internal utility and adjusts call sites; no existing spec-level behavior changes. -->

## Impact

- **New code**: `src/util/normalize.js` (new module) and `scripts/check-rich-rel-map.js` (dev-only sanity script).
- **Modified code** (~11 crash-risk files + backfill):
  - `src/components/OTU/OTUs.js` — replace hand-rolled scrubber with `normalizeEntity` calls.
  - `src/components/Specimen/SpecimenQueryResults.js`, `SpecimenWeb.js`, `SpecimenPdf.js`, `SpecimenSelect.js`
  - `src/components/OTU/OTUQueryResults.js`, `OTUweb.js`, `OTUpdf.js`, `OTUSelect.js`
  - `src/components/Collection/CollectionQueryResults.js`, `CollectionWeb.js`, `CollectionPDF.js`, `CollectionSelect.js`
  - `src/components/Reference/ReferenceQueryResults.js`, `ReferenceWeb.js`, `ReferencePDF.js`, `ReferenceSelect.js`
  - `src/components/Schema/SchemaQueryResults.js`, `SchemaWeb.js`, `SchemaPdf.js`, `SchemaMutateForm.js`
  - `src/components/Synonym/SynonymMutateForm.js`
  - `src/components/Comment/CommentMutateForm.js`, `Comments.js`
  - `src/components/Description/DescriptionSelect.js`
- **No impact on**:
  - Server (`pbot-api`) — schema, resolvers, and Cypher are untouched.
  - Apollo Client setup — no cache type-policies, no link changes.
  - GraphQL queries — query text is unchanged.
  - Dead code: `src/components/oldStuff/`, `src/components/Description/old/`, commented-out MenuItem autofill blocks in `SpecimenMutateForm.js`, `OTUMutateForm.js`, `DescriptionMutateForm.js` are explicitly out of scope.
- **Dependencies**: none added.
- **Risk**: low. The normalizer mutates in place, which could surprise a caller that holds onto pre-normalized references — mitigated by running it at the `*QueryResults` data-in seam before any downstream component sees the data. Apollo's cache freezes its results, so each seam clones via `cloneEntity` before normalizing; any future `*QueryResults` that skips the clone will throw loudly in strict mode rather than silently corrupt the cache.
