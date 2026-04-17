## Context

The pbot-api server change `add-fuzzy-search-core-entities` (archived 2026-04-16) introduced five fuzzy-search queries implemented via Pattern D: a custom resolver does a Neo4j fulltext lookup to produce score-ordered `pbotID`s, injects those IDs into a `pbotID_in` filter, and delegates to `neo4jgraphql()` for the actual node query. Each fuzzy query accepts the same `_<Type>Filter`, `first`, `offset`, and `orderBy` arguments as its auto-generated counterpart, so existing client-side filter shapes can be reused wholesale.

Current client state (see `pbot-client/CLAUDE.md` for the wider architecture):

- `PersonQueryForm` already has a `fuzzy` checkbox.
- `PersonQueryResults` has two divergent paths — a `fuzzyPersonSearch` call with a hand-rolled client-side post-filter (given/email/orcid/pbotID/groups) plus an extra `memberOf { pbotID }` projection, and a standard `Person` call with a `_PersonFilter` containing `surname_regexp`, `given_regexp`, `memberOf_some`, and `pbotID_not_in`.
- `ReferenceQueryForm`, `SchemaQueryForm`, `CollectionQueryForm`, `OTUQueryForm` have no fuzzy checkbox. Their results components wrap the typed title/name into `(?i).*X.*` regex strings and pass them as `title_regexp` / `name_regexp` in a hand-built `_<Type>Filter`.

Every `<Entity>Select` component embeds `<Entity>QueryForm` + `<Entity>QueryResults` in a search Dialog, so adding fuzzy to the query forms automatically extends it into the Select dialog path. `Inner<Entity>Select` (the plain dropdown) runs its own separate query and is intentionally out of scope — it's a pick-from-all list, not a search UI.

## Goals / Non-Goals

**Goals:**

- Migrate `PersonQueryResults` off `fuzzyPersonSearch` (deprecated) onto `fuzzyPerson`, collapsing the fuzzy and non-fuzzy branches onto a single shared `_PersonFilter` shape.
- Add a "Fuzzy name search" or "Fuzzy title search" checkbox to `ReferenceQueryForm`, `SchemaQueryForm`, `CollectionQueryForm`, `OTUQueryForm` (label depends on whether the fuzzy target is `title` or `name`).
- In each of those four results components, add a `fuzzy`-gated branch that swaps the standard node query for the matching `fuzzy<Type>` query — passing the raw target-field value as `searchString` and preserving every other filter clause unchanged.
- Preserve the non-fuzzy (regex) path exactly as it is today.
- Keep the five `*QueryResults` components parallel — no shared fuzzy-vs-regex abstraction in this change.
- Update `FUZZY_SEARCH.md` to describe the new Pattern D flow and retire the "Future Improvement: Server-Side Filtering" section (which has now shipped).

**Non-Goals:**

- Changing the `Inner*Select` plain-dropdown queries (separate code path, not a search UI).
- Extending Reference fuzzy matching to `bookTitle` (server index is title-only; deferred).
- Extracting a shared `useFuzzyOrStandardQuery` hook across entities (we explicitly prefer five parallel branches, mirroring the server's "five hand-written resolvers" judgment).
- Exposing `fuzzyLimit`, `first`, `offset`, or explicit `orderBy` controls in any UI (inherit server defaults).
- Removing the deprecated `fuzzyPersonSearch` resolver from the server (separate future server change after this client lands).
- Surfacing fuzzy match scores in the UI.

## Decisions

### Decision 1: Spike on Reference before touching Person

**Choice:** Task 1 implements fuzzy search on Reference end-to-end (form + results + Select-dialog verification). Tasks 2+ (Person migration, then Schema/Collection/OTU) only start once Reference is verified working against a live pbot-api.

**Rationale:**

- The Pattern D client flow — raw string to `searchString`, `_<Type>Filter` for everything else, no client post-sort — is new to this codebase. Validating it on a greenfield entity removes the variable of "is the old Person legacy path interfering?"
- Mirrors the server's own spike rhythm (they spiked Reference first, then replicated). Symmetry across repos makes the change easier to reason about and roll back in coordination.
- Person's work is a cleanup migration, not a design validation — better done once the destination pattern is proven.

**Alternatives considered:**

- Person first (it's where fuzzy already exists, so migrating it is the "natural" starting point). Rejected for the reasons above.
- All five in parallel. Rejected — if the pattern needs a tweak, we'd have to retrofit five files.

### Decision 2: Fuzzy checkbox sits next to the fuzzy-target field

**Choice:** Each form places the `fuzzy` checkbox immediately under the text field it fuzzy-matches (matching the existing `PersonQueryForm` layout where "Fuzzy name search" appears under `given` and above `email`).

**Rationale:**

- Visually tight coupling between the checkbox and the field whose behavior it changes.
- Matches the precedent already set by Person.
- Avoids users checking the box and then typing into a field the checkbox doesn't affect.

**Alternatives considered:**

- A dedicated "Search mode" section at the top of the form. Rejected as over-engineered for a single-field toggle.

### Decision 3: Label text matches the target field noun

**Choice:**

| Entity     | Target field | Label                 |
|------------|--------------|-----------------------|
| Person     | surname+given| Fuzzy name search     |
| Reference  | title        | Fuzzy title search    |
| Schema     | title        | Fuzzy title search    |
| Collection | name         | Fuzzy name search     |
| OTU        | name         | Fuzzy name search     |

**Rationale:**

- Uses the word a user already sees in the adjacent field label. "Fuzzy title search" next to a "Title" field is immediately understandable.
- The underlying GraphQL field names (`searchString`, `surname`/`given`/`middle` for Person) are server-implementation detail; the UI speaks in user terms.

### Decision 4: Fuzzy mode bypasses regex wrapping; non-fuzzy preserves it

**Choice:** When `fuzzy` is true, the raw user input goes straight to the server as `searchString` (for Reference/Schema/Collection/OTU) or `surname`/`given`/`middle` (for Person). The `(?i).*X.*` regex wrap used by the non-fuzzy path is skipped. When `fuzzy` is false, the non-fuzzy path is untouched — regex as today.

**Rationale:**

- Regex is for substring matching; fuzzy is for edit-distance matching. Wrapping a fuzzy search string in `.*...*` is meaningless to Lucene.
- Keeping the non-fuzzy path intact means this change is additive — existing users see identical behavior when the box is unchecked.

**Trade-off:** Users who type `"species"` in fuzzy mode expecting substring behavior will see different results than non-fuzzy mode (fuzzy may include `"Speceis"` misspellings). The checkbox label sets expectations.

### Decision 5: Fuzzy results preserve server score order; non-fuzzy results keep client-side sort

**Choice:** When `fuzzy` is true, `*QueryResults` must NOT re-apply its existing `alphabetize(...)` / `sort(...)` call. The server returns results in fuzzy-score order (best match first) and that order is the value. When `fuzzy` is false, the existing client-side sort runs unchanged.

**Rationale:**

- Score order is the whole point of fuzzy search — alphabetizing afterward destroys it.
- Non-fuzzy path today sorts by entity-specific criteria (year+title for Reference, surname for Person, etc.) and users are accustomed to that. Don't change what works.

### Decision 6: Keep the five `*QueryResults` branches parallel (no shared hook)

**Choice:** Each of the five results components gets its own `fuzzy ? fuzzy<Type>(...) : <Type>(...)` branch, written out long-hand. No extraction of a `useFuzzyOrStandardQuery(typeName, ...)` hook.

**Rationale:**

- Five near-identical-looking call sites is a small ergonomic cost.
- Each entity's filter shape is already bespoke — Reference has `OR: [title_regexp, bookTitle_regexp]`, Collection has deeply nested `specimens_some: { partsPreserved_some: ... }`, OTU has ~20 filter clauses. A shared hook would need to know all of these structures, which defeats the point of sharing.
- The server made the same judgment on its side ("leave them as five hand-written resolvers"). Symmetry helps.
- If duplication turns out to hurt later, extracting is easier from five concrete cases than designing the right abstraction upfront.

**Revisit trigger:** if a sixth entity needs fuzzy (or a cross-cutting change touches all five fuzzy branches), reconsider.

### Decision 7: Reference fuzzy is title-only; checkbox label communicates the scope

**Choice:** `ReferenceQueryForm`'s checkbox is labeled "Fuzzy title search". When checked, the fuzzy branch passes `title` as `searchString` and drops both the `title_regexp` and `bookTitle_regexp` OR-clause from the filter.

**Rationale:**

- The server's `fuzzyReferenceTitleIndex` covers `Reference.title` only, per server Decision 5. A fuzzy search on `bookTitle` would require either a new server-side composite index or client-side post-filter/merge (which is exactly the pattern we're deleting from Person).
- Labeling the checkbox "title search" rather than just "fuzzy search" sets accurate expectations.

**Deferred:** expanding `fuzzyReferenceTitleIndex` to composite `(title, bookTitle)` is a server change, tracked outside this client change.

### Decision 8: Person migration collapses fuzzy and regex branches onto one filter shape

**Choice:** After migration, `PersonQueryResults` has one filter-variable block. Both fuzzy and non-fuzzy paths pass the same `_PersonFilter` (`surname_regexp` / `given_regexp` / `memberOf_some` / `pbotID_not_in`). The fuzzy path additionally passes `surname`/`given`/`middle` as top-level args on `fuzzyPerson`. The fuzzy path stops regex-wrapping those name fields in the filter (since the fuzzy index handles the matching) — but continues to pass email/orcid/groups/exclude through `_PersonFilter` unchanged.

The `memberOf { pbotID }` projection and the client-side post-filter block both go away. `fuzzyPerson`'s server-side filter + `cypherParams` scoping handles what those used to.

**Rationale:**

- `fuzzyPersonSearch`'s inability to accept a `_PersonFilter` is the sole reason the post-filter and extra projection exist. Removing that inability removes their reason to exist.
- One filter-variable block is cleaner to read and harder to drift on than two divergent ones.

### Decision 9: Defer UX concerns around empty-searchString and missing-index errors

**Choice:** No client-side validation of empty `searchString`. No specific error copy for a missing Neo4j fulltext index. Submitting an empty fuzzy search follows whatever the server returns (spec allows empty list or "all candidates up to fuzzyLimit"). Missing-index errors surface via the existing generic `Error :(` path in each `*QueryResults`.

**Rationale:**

- Empty search is a day-zero edge case; users will figure out quickly that an empty fuzzy search isn't useful. Not worth form-validation overhead.
- Missing-index is a one-time ops failure at deploy time, not a user-facing concern once the setup script has run. A specific error message would rot (indexes-missing is unlikely to happen twice).

**Revisit trigger:** if either becomes a user-support issue, add targeted UX then.

## Risks / Trade-offs

- **Server not deployed yet / indexes not created** → Any fuzzy checkbox the user ticks will hit a Neo4j error. → **Mitigation:** coordinate with whoever deploys pbot-api; verify `cypher/setup-fuzzy-indexes.cypher` has run in each target environment before this client change is deployed. Call this out in the Migration Plan below.

- **Result-shape drift between fuzzy and non-fuzzy** → Each results component renders `data.<TypeName>` in non-fuzzy mode and `data.fuzzy<TypeName>` in fuzzy mode. Both return the same node type, but the client must pull from the right key. → **Mitigation:** normalize to a single local variable immediately after `useQuery` returns (e.g., `const results = fuzzy ? data.fuzzyReference : data.Reference`).

- **Tokenization surprise on hyphens/punctuation** (server Decision 7) → `"Ref-ddm-08-25a"` in fuzzy mode becomes `Ref~ ddm~ 08~ 25a~` OR'd. Users may not expect this. → **Mitigation:** no client fix; document the behavior in `FUZZY_SEARCH.md` and trust the checkbox label to frame expectations.

- **User ticks fuzzy then leaves the target field blank** → Server returns "unspecified" behavior (empty list or all-candidates-up-to-fuzzyLimit). → **Mitigation:** accept whatever the server returns; don't add client-side validation (Decision 9).

- **Reference bookTitle drop-off** → Fuzzy mode on Reference silently excludes bookTitle from the search. → **Mitigation:** "Fuzzy title search" label (Decision 7). Monitor user feedback; if complaints arrive, raise server-side composite-index change.

- **Person behavior drift** → Current `fuzzyPersonSearch` and current regex-based Person query have subtly different behaviors (old post-filter uses case-insensitive regex for given, exact-match for email/orcid; new `fuzzyPerson` with `_PersonFilter` uses `given_regexp` exactly like the non-fuzzy path does today). Net effect is that given/email/orcid should behave identically across the two paths after migration — but we should verify rather than assume. → **Mitigation:** manual verification task explicitly checks parity.

- **Dialog-embedded reuse** → `*Select` search dialogs reuse `*QueryForm` + `*QueryResults`, so they'll pick up the checkbox. Any form layout change ripples into those dialogs. → **Mitigation:** when verifying each entity, also open the corresponding `*Select` search icon and confirm the dialog still looks/works right.

## Migration Plan

1. **Pre-flight**: Confirm pbot-api's `add-fuzzy-search-core-entities` is deployed to the target environment (dev first). Confirm `cypher/setup-fuzzy-indexes.cypher` has been run against that environment's Neo4j. Without both, no fuzzy checkbox will work.
2. **Task 1 (Reference spike)**: Add fuzzy to `ReferenceQueryForm` and `ReferenceQueryResults`. Verify against dev pbot-api — fuzzy on/off parity for non-target filters, score order preserved, `Select` dialog picks it up, no regressions to standalone or direct-query paths. If any of this reveals a design issue, update `design.md` before proceeding.
3. **Task 2 (Person migration)**: Swap `fuzzyPersonSearch` for `fuzzyPerson`. Delete client-side post-filter, collapse filter shape. Verify against dev — fuzzy name lookup still finds Darwen≈Darwin, non-fuzzy unchanged, Select dialogs unchanged.
4. **Tasks 3–5 (replicate)**: Schema, Collection, OTU — replicate the Reference pattern. Expect minor per-entity adaptation (OTU has the most filter clauses; exercise the accordion sections with fuzzy ON/OFF to catch anything that interacts with filter construction).
5. **Task 6 (docs)**: Rewrite `src/components/Person/FUZZY_SEARCH.md` to describe the new Pattern D flow across all five entities. Delete the "Future Improvement" section.
6. **Deploy**: push to master; `.github/workflows/deploy-dev.yaml` handles the dev rollout via SSH+PM2. No manual build step on the client side.
7. **Rollback**: revert the commit. Non-fuzzy paths continue working. Server's deprecated `fuzzyPersonSearch` remains live, so an older client build continues working — graceful two-way degradation.

## Open Questions

- Should `ReferenceQueryForm`'s checkbox placement be under `title` specifically, or grouped with `year`/`authors`/etc.? Lean: immediately under `title`, matching Decision 2 and Person's precedent. Resolve during Task 1 implementation.
- When `fuzzy` is checked but the target field is blank, should the form prevent submission? Per Decision 9, no — but if Task 1 reveals the "all candidates" behavior is alarming (e.g., pulls back 200 unrelated References), we may want to gate submission on non-empty input. Revisit after Task 1 manual verification.
