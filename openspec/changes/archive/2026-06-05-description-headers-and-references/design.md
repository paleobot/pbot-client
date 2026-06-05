## Context

Descriptions appear in three places across the detail pages:

| Section | Component(s) | Data source | Kind |
|---|---|---|---|
| Specimen → "Descriptions" | `SpecimenWeb.js` / `SpecimenPdf.js` | `specimen.describedBy[].Description` | real |
| OTU → "Holotype descriptions" | `OTUweb.js` / `OTUpdf.js` | `otu.holotypeSpecimen.Specimen.describedBy[].Description` | real |
| OTU → "Merged exemplar descriptions" | `OTUweb.js` / `OTUpdf.js` | `otu.mergedDescription[]` (`PseudoCharacterInstance`) | merged |

All three currently render a header of the form `From schema "<schema.title>"`. The two **real** sections render a `Description` node that carries `pbotID`, `name`, `writtenDescription`, `notes`, a `schema` relation, and `characterInstances`. The **merged** section is a flattened, de-duped projection produced by a `@cypher` field on the server (`schema.graphql`), where `schema` is only the title string and there is no schema `pbotID`.

`Description.references` exists on the server (`DescriptionCitedBy { from: Reference, to: Description, order }`) but is not currently selected by either detail query. Schema and Reference both have established detail routes (`/query/schema/:id`, `/query/reference/:id`) and the reusable `DirectQueryLink` component (`util.js`) already wraps the reference route.

## Goals / Non-Goals

**Goals:**
- Re-label real descriptions as `<description name> from schema "<schema name>"`.
- Link the schema name to its detail page (web only).
- Show each real description's references inline, hotlinked in web and plain text in PDF.
- Achieve this with client-only changes (no `pbot-api` edits).

**Non-Goals:**
- No Description detail page and no link from the description name (out of scope; users only asked for the name and its references).
- No change to the merged-exemplar rendering, and therefore no schema link there (would require a server change to expose the schema `pbotID`).
- No change to `characterInstances` rendering or the existing `written description:` / `notes:` rows.

## Decisions

- **Header format.** Render `<name> from schema "<schema title>"`. The name is plain bold text; the schema title is wrapped in the existing schema `Link` pattern (`<Link href={/query/schema/<pbotID>?includeCharacters=true}>`) in web, plain text in PDF. Mirror the exact link/styling already used in `SchemaQueryResults.js` for consistency.
- **References subsection placement.** Add it after the `notes:` row inside the same description cell, styled with the existing `indent` block like `written description:` and `notes:`. Render only when `references.length > 0`.
- **Web reference links.** Reuse `DirectQueryLink type="reference"` with `text={Reference.title}` (optionally `title, year` to match the entity-level References accordion). PDF lists titles as plain `<Text>`.
- **Query selections (no API change).**
  - `SpecimenQueryResults.js`: add `pbotID` to the description `schema { }` (currently `title` only) and add `references { Reference { pbotID title year } order }`.
  - `OTUQueryResults.js`: add `references { Reference { pbotID title year } order }` to the holotype `describedBy.Description` block; `name` and `schema { pbotID title }` are already present.
- **Merged section is read-only here.** Leave `OTUweb.js` / `OTUpdf.js` merged-exemplar code paths byte-for-byte unchanged.
- **Visibility flags.** References ride inside the same `Description` selection already gated by `includeDescriptions` (Specimen) / `includeHolotypeDescription` (OTU), so they appear exactly when the description does — no new flag needed.

## Risks / Trade-offs

- **Asymmetry between real and merged sections.** After this change, real descriptions link their schema but the merged section does not. This is intentional and accepted (merged has no `pbotID` without a server change); the differing presentation is a known trade-off.
- **No description link.** The description name is unlinked, which may later prompt a request for a Description detail page. Out of scope now; the references subsection covers the actual user need.
- **PDF/web parity is content-only.** PDF reproduces the same titles but without links, consistent with how PDF export already handles in-app navigation.
