## Context

The standalone OTU display page renders three specimen tables (holotype, other type, additional) via a shared `SpecimenTable` component used in both `OTUweb.js` and `OTUpdf.js`. The standalone GraphQL query in `OTUQueryResults.js` already fetches a full `describedBy { Description { … } }` projection on `holotypeSpecimen`, but it is gated by `@include(if: $includeHolotypeDescription)` because the Holotype Description accordion is the only consumer today. The other two specimen sets (`typeSpecimens`, `identifiedSpecimens`) do not fetch `describedBy` at all.

The client already has the machinery to scrub phantom rich-relationship rows: `RICH_REL_FIELDS.Specimen` in `src/util/normalize.js:42` lists `describedBy → Description`, and `OTUs.js:167-169` calls `normalizeEntity("Specimen", …)` on the holotype, every typeSpecimen, and every identifiedSpecimen. Adding `describedBy` to the response is therefore self-cleaning: no normalize.js or OTUs.js change is required.

## Goals / Non-Goals

**Goals:**
- Show a per-specimen "Has Description" indicator on all three specimen tables on the standalone OTU page (Web and PDF).
- Keep the existing Holotype Description accordion working unchanged when `includeHolotypeDescription=true`.
- Avoid bloating the response when `includeHolotypeDescription=false`.

**Non-Goals:**
- No server-side schema change (`pbot-api`).
- No equivalent server-side `hasDescription: Boolean` `@cypher` field. Considered and deferred — see Decisions.
- No change to the workbench (non-standAlone) OTU query branch. `OTUweb`/`OTUpdf` are only rendered under `if (props.standalone)` in `OTUs.js:223`.
- No "show only specimens with descriptions" filter and no column sorting.
- No change to the existing rich-relationship normalization machinery.

## Decisions

### Decision: Client-side derivation from `describedBy.length`

Compute the boolean as `!!(s.Specimen.describedBy?.length)` in `SpecimenTable`. Render a checkmark when truthy, blank when not.

**Why:** All required wiring already exists. `RICH_REL_FIELDS.Specimen` already lists `describedBy`, and `normalizeEntity("Specimen", …)` is already called for holotype/type/identified specimens. The only changes needed are the GraphQL projection and the table column itself.

**Alternative considered:** A server-side `hasDescription: Boolean @cypher(...)` field on `Specimen`. Cheaper payload (one boolean vs. an edge list) and a single place to encode "has" semantics. Rejected because (a) this column is the only motivator today, (b) it would require a coordinated `pbot-api` schema change and redeploy, and (c) the array-fetch is small (`Description.pbotID` only) and short-circuited by Apollo's cache.

### Decision: Always-on minimal `describedBy`, gated heavy fields via inline fragment

On `holotypeSpecimen.Specimen.describedBy`, always fetch `Description.pbotID`. Wrap the existing heavy fields (`name`, `writtenDescription`, `notes`, `schema`, `characterInstances`) in an inline fragment with `@include(if: $includeHolotypeDescription)`. On `typeSpecimens` and `identifiedSpecimens`, add a new minimal `describedBy { Description { pbotID } }` projection (no gating — the heavy fields are not used here).

**Why:** The Has Description column needs presence-only data on every page load, but the heavy holotype-description fields are still expensive and only needed when the accordion is rendered. An inline fragment with `@include` keeps the gated fields colocated, avoids field-by-field directive repetition, and is spec-valid GraphQL that Apollo handles natively.

**Alternative considered:** Per-field `@include` directives on each heavy field. Equivalent in effect but verbose. Rejected for readability.

### Decision: Group-scoped semantics, accepted as-is

The column reads "has a description visible to the current viewer." A specimen with descriptions only in groups outside the viewer's scope renders as blank. No tooltip, no asterisk.

**Why:** Consistent with the rest of the page — every other description-related rendering on this page already filters by viewer-visible group scope. Surfacing "you can't see this" would leak information about other groups' content and is contrary to the existing privacy posture.

### Decision: PDF column widths re-balance, table layout unchanged

Add the new column to the existing 5-column StyleSheet table. Re-allocate widths to fit; do not introduce a horizontal scroll, page break change, or a separate landscape layout.

**Why:** A 6-column wide table still fits the existing PDF page width with sensible widths. Keeping the layout shape stable avoids regressions in printed/exported documents.

## Risks / Trade-offs

- **Risk:** Heavy holotype description fields silently disappear from the GraphQL response if the inline fragment is malformed → the accordion would render empty without an error.
  **Mitigation:** Verify the accordion still populates correctly when `includeHolotypeDescription=true` after the change. Smoke-test a known OTU with a holotype description.

- **Risk:** Payload growth on OTUs with very large `identifiedSpecimens` lists. Each specimen gains a list of `{pbotID}` description edges.
  **Mitigation:** Projection is intentionally minimal (single ID per edge). For a specimen with N descriptions, the added bytes are ~`N × uuid_size`. Acceptable given expected description counts per specimen.

- **Risk:** Group scoping invisibility could surprise users who know a description exists but don't see the checkmark.
  **Mitigation:** Explicitly accepted — see decision above. If user reports surface this confusion, revisit with a tooltip or scope-aware variant.

- **Risk:** A future reader changing the standalone GQL forgets the inline-fragment gating and accidentally always fetches the heavy fields.
  **Mitigation:** No structural mitigation; covered by code review and the proximity of the gated block to the always-on minimal one.

- **Trade-off:** Client-side derivation locks in per-OTU payload growth proportional to total specimens × descriptions. A server `hasDescription` field would have been O(1) per specimen. Accepted given current scale.
