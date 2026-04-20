## Context

The PBOT client already shows an entry history (timestamp, action type, person) on two entity direct-query pages:

- OTU: massage in `src/components/OTU/OTUs.js:25`, web accordion in `src/components/OTU/OTUweb.js:488-520`, PDF section in `src/components/OTU/OTUpdf.js:277-297`.
- Specimen: massage in `src/components/Specimen/SpecimenQueryResults.js:409` (guarded by `if (props.standAlone)` at `:383`), web accordion in `SpecimenWeb.js:269-290`, PDF section in `SpecimenPdf.js:187-207`.

The server-side GraphQL schema already exposes `enteredBy` on `Schema`, `Collection`, and `Reference` (via `SchemaEnteredBy`, `CollectionEnteredBy`, `ReferenceEnteredBy` relationship types in `pbot-api/schema.graphql`). No server change is required.

Schema, Collection, and Reference `*QueryResults.js` each build multiple gql query variants (standard, fuzzy, and — for standAlone direct-query pages — a dedicated branch). The existing convention (confirmed in OTU and Specimen) is that history is only rendered on standAlone pages, so fetching `enteredBy` can be scoped to the standAlone query branch.

## Goals / Non-Goals

**Goals:**
- Users viewing a Schema, Collection, or Reference direct-query page can see a History accordion with timestamp, action type, and person for each entry event.
- The same history appears in the PDF export of those pages.
- Implementation mirrors the established Specimen pattern for consistency.
- No impact on payload size or performance for the workbench list-view (non-standAlone) and fuzzy-search branches.

**Non-Goals:**
- No changes to OTU or Specimen history display.
- No changes to the server schema, resolvers, or permissions.
- No new history display on the workbench list-view results (the existing UX shows history only on direct-query pages).
- No filtering, sorting controls, or pagination of the history list beyond the existing timestamp sort.
- No empty-state message in the web view (matches OTU/Specimen, which also render an empty table when history is empty). PDF keeps its existing "No history available" fallback pattern.

## Decisions

### Decision 1: Fetch `enteredBy` only in the standAlone gql branch

**Choice:** Add the `enteredBy { timestamp type Person { given middle surname } }` selection only to the standAlone query variant in each entity's `*QueryResults.js`. Leave the standard and fuzzy branches untouched.

**Rationale:** History is only rendered on direct-query pages, which always set `standAlone: true` (see `SchemaDirectQueryResults.js`, `CollectionDirectQueryResults.js`, `ReferenceDirectQueryResults.js`). Pulling `enteredBy` on every workbench search would bloat payloads with data the UI never displays.

**Alternative considered:** Add `enteredBy` to all query variants for uniformity. Rejected because it materially inflates list-view payloads (each result carries an entry-event array with a nested Person per event) for no user-visible benefit.

### Decision 2: Guard the history massage behind `props.standAlone`

**Choice:** In each `*QueryResults.js`, wrap the `entity.history = sort(entity.enteredBy.map(...))` assignment in an `if (props.standAlone)` block — the same pattern as `SpecimenQueryResults.js:383`.

**Rationale:** Non-standAlone branches don't select `enteredBy`, so `entity.enteredBy` will be undefined. Unconditionally mapping over it would crash the workbench list view.

### Decision 3: Accordion placement at the end of the existing stack

**Choice:** Append the History accordion as the last accordion in each `*Web.js` file.

**Rationale:** User-specified. Each entity has a different accordion ordering already; rather than insert history into a semantically-consistent slot per entity (which would mean three different choices), placing it at the end is predictable and uniform.

### Decision 4: Inline massage rather than a helper file

**Choice:** Put the `history = sort(enteredBy.map(...))` transform inline in each `*QueryResults.js`, as Specimen does.

**Rationale:** User-specified. Schema/Collection/Reference have no existing helper file like OTU's `OTUs.js`. Creating one purely for this three-line transform is unnecessary ceremony; the Specimen-style inline assignment is the local convention for entities without an existing helper.

### Decision 5: Reuse OTU/Specimen presentational structure verbatim

**Choice:** Copy the MUI table (web) and `@react-pdf/renderer` View (PDF) block structure from OTU/Specimen directly into the new entities, changing only the prop name (`schema.history` / `collection.history` / `reference.history` vs. `s.history`).

**Rationale:** A shared `<HistoryAccordion>` / `<HistoryPdfSection>` component would be cleaner, but introduces a refactor of OTU and Specimen to also consume it — out of scope for this change. The pattern is short enough that duplication is acceptable and keeps the blast radius tight. A future refactor could extract a shared component if more entities adopt history display.

## Risks / Trade-offs

- **Code duplication across five entities.** → Mitigation: accepted for now. If a sixth entity adopts history display, extract a shared component.
- **Crash if a standAlone query returns an entity with `enteredBy: null` (not just empty array).** → Mitigation: defensively use `(entity.enteredBy || []).map(...)` so the sort step never runs against null. Follow whichever defensive pattern Specimen uses today for consistency.
- **Private-group filtering on `Person` inside `enteredBy`.** → Mitigation: the `Person` records referenced by `enteredBy` edges are already used by OTU/Specimen without special handling. The server's permission rules handle visibility; the client renders whatever the server returns. If a person is inaccessible, the field will be null — match OTU/Specimen behavior (display the event regardless; the join-level handling is the server's responsibility).
- **Fuzzy-branch drift.** If future work adds history to fuzzy-search results, the standAlone-only gating must be re-evaluated. → Mitigation: documented here and in the spec.

## Migration Plan

No migration. This is a pure client-side additive change. Deploy via the standard `master` push → `deploy-dev.yaml` workflow. Rollback is a simple revert.

## Open Questions

None at this time. All four implementation questions (accordion placement, standAlone-only scoping, DirectQueryResults updates, empty-state handling) were resolved during exploration.
