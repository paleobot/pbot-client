## Context

The PBOT GraphQL schema exposes Neo4j edges via two shapes: plain `@relation` fields (e.g. `partsPreserved: [Organ]`) and "rich" relationship types (e.g. `identifiedAs: [IdentifiedSpecimenOf]`, where `IdentifiedSpecimenOf` carries `entered_by`, `timestamp`, and the target node). Rich rels are indispensable because they let the client read edge metadata alongside the target node — author/citation order, entry audit data, per-identification provenance.

`neo4j-graphql-js` compiles rich-rel fields to Cypher that iterates matched edges and projects `{Inner: <target-with-filters-applied>, …rel-props}` per edge. When an edge matches but the target fails a `WHERE` predicate, the projection still emits a row with the target evaluated to `null`. In PBOT, the triggering predicate is our fork's group-scope filter (`pbotID_in: $groups`) applied to every entity match: a Specimen can have an `identifiedAs` edge to an OTU in a group the viewer can't see, the edge matches, the target fails the filter, and the client receives `[{Inner: null}]` instead of `[]`. The same mechanism collapses singular rich-rel fields to `{Inner: null}` instead of `null`.

This is specific to our fork: stock `neo4j-graphql-js` without a target-node filter does not exhibit the phantom shape (a freshly-created local Specimen with zero rich-rel edges confirms this — no edge, no projection row, clean `[]`). The quirk manifests mostly on production data where cross-group rich-rel edges are common.

The client has a partial fix for this today in `src/components/OTU/OTUs.js:35-45` that hand-filters a subset of OTU's rich rels. The pattern has never been centralized or extended to other entities, so any `.map(r => r.Inner.pbotID)` on a Specimen, Collection, Reference, Schema, Description, Synonym, or Comment rich-rel field is at risk — sometimes throwing, sometimes silently mis-counting. The Explore-phase audit catalogued ~11 live files that crash outright and ~6 more with milder correctness bugs.

A server-side fix via `@cypher` overrides was considered and rejected because it loses auto-generated filter/orderBy machinery (used by `authoredBy(orderBy: order_asc)` and several `_*Filter` shapes) and widens blast radius to every API consumer. A per-call-site guard approach was rejected because it scatters identical `.filter(r => r.Inner)` logic across ~20 files and places an ongoing burden on every new rich-rel render.

## Goals / Non-Goals

**Goals:**
- Provide a single, explicit utility that converts rich-rel phantom rows to the shape the schema implies (`[]` / `null`) before data reaches any UI component.
- Normalize at the data seam — each `*QueryResults` scrubs its query's results once, innermost level first, and downstream `*Web`/`*Pdf`/`*Select` components can stop carrying ad-hoc inner-null guards.
- Preserve the existing pattern in `OTUs.js` (scrub-at-the-seam) and collapse its hand-rolled logic into calls to the new utility.
- Keep the normalizer dumb and auditable: single-level, explicit field map, no reflection or type-graph magic.

**Non-Goals:**
- Changing any GraphQL query text or the pbot-api schema/resolvers.
- Automatic recursion into nested entities. Callers walk their own query's nesting explicitly.
- Apollo Client cache type-policies or link transforms. The normalizer runs in component code, not in the network stack.
- Fixing dead code. `oldStuff/`, `Description/old/`, and block-commented MenuItem autofill sections in `SpecimenMutateForm.js`, `OTUMutateForm.js`, and `DescriptionMutateForm.js` are explicitly out of scope.
- A general-purpose GraphQL response sanitizer. The utility is scoped to the rich-rel quirk.

## Decisions

### Decision: Single-level normalizer, callers walk nesting explicitly

`normalizeEntity(type, obj)` operates on one entity at a time and does not recurse. Callers that fetch nested rich rels (e.g. `OTU.identifiedSpecimens[*].Specimen.describedBy`) call the normalizer per level, innermost first.

**Rationale:** Recursion would require a global entity-type graph embedded in the normalizer, which would have to be kept in sync with every query in the codebase. Per-level keeps the normalizer ~30 lines and makes each `*QueryResults` self-documenting about what its query fetched. Performance is also easier to reason about — no surprise deep walks.

**Alternatives considered:**
- *Recursive normalizer with a type graph:* rejected. Adds hidden behavior; a field added to a query would be auto-scrubbed, which could mask mistakes elsewhere.
- *Recursive normalizer with opt-in `children` config at call sites:* considered briefly during Explore, rejected as counter-intuitive — the call site ends up describing the query twice (once in GQL, once in config).

### Decision: Explicit inner-key map (no convention-based inference)

`RICH_REL_FIELDS` enumerates, for each entity type, the list-typed and singular rich-rel fields along with the JSON key under which the inner entity appears. For example:

```
Specimen: {
    lists: [
        { field: "identifiedAs",  inner: "OTU" },
        { field: "typeOf",        inner: "OTU" },
        { field: "holotypeOf",    inner: "OTU" },
        { field: "describedBy",   inner: "Description" },
        { field: "references",    inner: "Reference" },
        { field: "enteredBy",     inner: "Person" },
    ],
    singulars: [],
},
OTU: {
    lists: [
        { field: "identifiedSpecimens", inner: "Specimen" },
        { field: "typeSpecimens",       inner: "Specimen" },
        { field: "references",          inner: "Reference" },
        { field: "enteredBy",           inner: "Person" },
    ],
    singulars: [
        { field: "holotypeSpecimen", inner: "Specimen" },
    ],
},
// ... Collection, Reference, Schema, Description, Synonym, Comment
```

**Rationale:** In practice the inner key is always the target type name in the schema (`identifiedAs` → `OTU`, `enteredBy` → `Person`, `authoredBy` → `Person`, `describedBy` → `Description`, `references` → `Reference`). A convention-based implementation would work today. We're spelling it out anyway for three reasons:

1. **Reviewability.** A reviewer opening `normalize.js` can eyeball "yes, this matches the schema" without running code or reasoning about a walker's correctness.
2. **Grep-ability.** Every rich-rel field the client cares about is listed in one place, making it trivial to answer "does the client touch field X?"
3. **Decoupling from implicit naming coupling.** If `neo4j-graphql-js` or the schema ever changes how wrapper types project their target (e.g. a field aliased differently), the explicit map continues to work without a debugging expedition.

The cost is ~60 lines of map. Low.

### Decision: Normalizer mutates in place, no-ops on null/undefined

```
normalizeEntity(type, obj)
  if (!obj) return obj;
  for each listField of RICH_REL_FIELDS[type].lists:
      if (Array.isArray(obj[field]))
          obj[field] = obj[field].filter(row => row[inner] != null);
  for each singularField of RICH_REL_FIELDS[type].singulars:
      if (obj[field] != null && obj[field][inner] == null)
          obj[field] = null;
  return obj;
```

**Rationale:** Mutation matches the existing style in `OTUs.js:35-45` and avoids allocating a parallel object tree for every entity. The no-op on `null`/`undefined` lets callers write `normalizeEntity("Specimen", otu.holotypeSpecimen?.Specimen)` without a guard, which keeps per-level integration compact.

**Trade-off:** Any caller that retains a reference to the pre-normalized object sees the mutation. Mitigated by running the normalizer at the `*QueryResults` data-in seam, before components receive the data. An unused `*QueryResults` path that didn't go through normalization is the only way a stale reference could appear, and none exists today.

**Apollo caveat (added post-implementation):** Apollo's `InMemoryCache` returns frozen result objects, so `normalizeEntity` cannot mutate them directly — strict mode throws "Cannot assign to read only property". Each `*QueryResults` seam therefore deep-clones the entity list first, via a `cloneEntity` helper exported from `normalize.js` that does a `JSON.parse(JSON.stringify(obj))` round-trip. `structuredClone` would have been the obvious choice but requires Chrome 98+; JSON round-trip is safe here because GraphQL responses are plain JSON (no `Date`, `Map`, `undefined`, cycles). The clone-then-normalize pattern is now the standard seam shape — see any `*QueryResults` for the pattern.

### Decision: Integrate at `*QueryResults`, not at `*Web`/`*Pdf`/`*Select`

**Rationale:** Direct query pages (`*DirectQueryResults`) all funnel through the matching `*QueryResults` (confirmed during Explore). Normalizing once at that seam covers both the workbench flow and direct-link landing pages. Putting it in `*Web`/`*Pdf`/`*Select` would duplicate the call at every render site and miss non-rendering consumers like sort/filter helpers.

### Decision: No server-side changes

**Rationale:** Rejected server `@cypher` overrides because they lose auto-generated `orderBy` and `_Filter` machinery that client queries depend on, and widen blast radius to every API consumer. Rejected Apollo link/type-policy sanitization because it's opaque at the call site and couples the fix to Apollo internals. Keeping the fix in component code makes it obvious and easy to back out if needed.

### Decision: Hand-coded field map rather than deriving from the schema

The `RICH_REL_FIELDS` map is maintained by hand. Three alternatives were considered for deriving it from the GraphQL schema instead:

- **Runtime GraphQL introspection.** Fire a `__schema` query at startup, walk the types, find wrappers structurally (types with `from` + `to` fields), and record each entity's rich-rel fields along with the target type name. Rejected because it adds a startup network dependency and a new failure mode (what does the app do if introspection fails or is disabled?) to fix what is fundamentally a cosmetic data-shape problem.
- **Build-time schema parse.** Read `../pbot-api/schema.graphql` during the client build and emit a generated map. Rejected because the client currently has no build step in CI (`.github/workflows/deploy-dev.yaml` does a `git reset --hard` and a PM2 watcher picks it up; the server builds/serves). Adding a generation step to CRACO is disproportionate for an ~8-entity / ~30-field map.
- **Pure runtime heuristic.** Skip the map entirely and detect phantom rows by shape ("array with one object whose non-`__typename` properties are all null"). Rejected because it's fragile at the edges, hides intent (a future developer can't tell which fields are affected without running it), and can't handle singular rich-rels with the same precision.

The hand-coded map is ~60 lines, trivially auditable, and the schema changes infrequently enough that drift is a low-probability risk.

**Drift mitigation:** A companion dev-only script at `scripts/check-rich-rel-map.js` parses the peer `pbot-api/schema.graphql` and warns when the hand-coded map is out of sync — either missing a rich-rel field present in the schema or listing one that no longer exists. The script is not wired into the build or CI; it runs on demand when touching rich-rel code or after a server schema change. A comment at the top of `normalize.js` points at this script and at `pbot-api/schema.graphql` as the source of truth.

## Risks / Trade-offs

- **Mutation of GraphQL result objects** → Apollo's cache freezes results, so direct mutation throws. Resolved by cloning at the seam (`cloneEntity` helper in `normalize.js`) before normalizing. Any future `*QueryResults` that skips the clone will fail loudly in strict mode rather than silently corrupt the cache.
- **Forgetting to normalize a newly-fetched nesting level** → Unavoidable with per-level by design. Mitigated by a task-list checklist covering every current `*QueryResults` and by keeping the `RICH_REL_FIELDS` map the single source of truth for which fields are rich rels. Code review expected to catch new cases.
- **Schema drift** → If pbot-api adds a new rich-rel field on an existing entity, the map must be updated. Mitigated by `scripts/check-rich-rel-map.js`, a dev-only sanity script that parses `pbot-api/schema.graphql` and flags mismatches with the hand-coded map. A comment in `normalize.js` points at the script and at the schema file as the source of truth.
- **Silent `.length` bugs pre-existed and may persist if a site is missed** → Mitigated by auditing all identified sites (enumerated in proposal) and collapsing `OTUs.js` as a sanity check that the utility covers the existing known-good pattern.

## Migration Plan

1. Land the new `src/util/normalize.js` and the integration in `*QueryResults` in a single change — the utility is useless without call sites, and the call sites depend on the utility.
2. Replace `OTUs.js:35-45` as part of the same change, to confirm parity with the existing scrubber.
3. No data migration. No flag. No rollback strategy beyond `git revert` — the change is self-contained and introduces no external dependencies.

## Open Questions

None. Design was settled during Explore; all decisions above reflect the explicit choices made there (single-level, explicit map, no children sugar, client-side only).
