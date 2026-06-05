## Context

The client renders entity detail pages through a shared `<Entity>Web.js` (MUI accordions) + `<Entity>Pdf.js` (`@react-pdf/renderer`) pair, fed by the standAlone branch of `<Entity>QueryResults.js`. Collection already implements an end-to-end references display; this change brings OTU, Specimen, and Schema to parity and normalizes placement across all four.

Current per-entity state:
- **Collection** — References accordion exists (`CollectionWeb.js:362`) but sits before Specimens; PDF section before Specimens (`CollectionPDF.js:254`). Query fetches `Reference { pbotID title year }`.
- **Schema** — references rendered inline inside the top key-info `Paper` (`SchemaWeb.js:90`) and inline in the PDF key area (`SchemaPdf.js:80`). Query fetches `Reference { pbotID title year }`.
- **Specimen** — query fetches `references { Reference { title year } order }` (`SpecimenQueryResults.js:90,204`) but no `pbotID`, and nothing renders them.
- **OTU** — standAlone query fetches NO top-level `references` (only `synonyms.references`); nothing renders OTU-level references. `OTUCitedBy.publishedInReference` exists server-side but is not fetched.

## Goals / Non-Goals

**Goals:**
- Show each entity's own references on its detail page (web + PDF), placed immediately before History.
- Surface the OTU taxonomic-authority flag (`publishedInReference`) as `(authority source)`.
- Make every rendered reference a link to `/query/reference/<pbotID>`.

**Non-Goals:**
- No server/schema changes (`references`, `publishedInReference` already exist).
- No changes to workbench list views or fuzzy-search query variants.
- No changes to synonym-nested or comment-nested reference displays.

## Decisions

**1. Reuse the Collection accordion/section pattern verbatim.** The web accordion uses the existing `accstyle` + `ExpandMoreIcon` idiom and `sort([...refs], "#order")`; the PDF uses `styles.sectionContainer` + `styles.subheading`. Rationale: consistency with Collection and the rest of each page; minimal new surface area. Alternative (a shared `<References>` component) was rejected — the four pages differ enough in styling/import sets that a shared component adds indirection for little gain, and the codebase convention is per-entity copies (see CLAUDE.md).

**2. Placement is "immediately before History" everywhere.** For OTU/Specimen/Schema the new block is inserted just above the History accordion/section. For Collection the existing block is relocated there (web: from before Specimens; PDF: from before Specimens). Rationale: the proposal makes uniform placement the explicit goal.

**3. Schema label is singular "Reference"; all others plural "References".** Per the user's request, Schema only. The Schema inline listing is deleted from the key-info `Paper`/PDF key area and recreated as a dedicated block to avoid duplication.

**4. OTU query gains references + publishedInReference in the standAlone block only.** Add to `OTUQueryResults.js` standAlone field set:
```
references (orderBy: order_asc) {
    Reference { pbotID title year }
    order
    publishedInReference
}
```
`OTUweb.js`/`OTUpdf.js` destructure `references` and render the authority tag when `publishedInReference === true`. The workbench table fragment (`OTUQueryResults.js:24`, title-only) is left untouched.

**5. Specimen query gains `pbotID`.** Add `pbotID` to both `references → Reference` selections in `SpecimenQueryResults.js` so the rendered links resolve; this is the only query change needed since `title`/`year`/`order` are already fetched.

**6. Empty-state: always render the block.** Matching Collection/Schema today, the accordion/section renders even when there are no references (it simply shows nothing inside), rather than conditionally hiding. Keeps behavior uniform across the four entities.

## Risks / Trade-offs

- **OTU standAlone query is large and shared by the detail tab and `OTUDirectQueryResults`** → Adding `references` there affects both, which is intended; verify no name collision with the existing `synonyms.references` (different nesting level, so safe).
- **Schema references moved, not copied** → If the move misses a consumer that relied on the inline listing, references could vanish from the key-info area unexpectedly. Mitigation: the inline block is only a display detail in `SchemaWeb.js`/`SchemaPdf.js`; the underlying `schema.references` data is unchanged and simply rendered in the new location.
- **PDF `(authority source)` formatting** → react-pdf has no inline markup; render the tag as adjacent `<Text>` so it stays on the reference line. Low risk, visual only.

## Migration Plan

Pure client display change; no data migration. Ships via the normal `master` → dev-host deploy. Rollback is a straight revert of the client commits.
