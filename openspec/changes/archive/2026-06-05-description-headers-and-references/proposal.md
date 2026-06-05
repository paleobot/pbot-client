## Why

On the Specimen and OTU detail pages, each description is currently labeled only by its schema (`From schema "<schema name>"`), giving no way to tell descriptions apart and no path to a description's source references. Users have asked to see the description's own name and its references inline.

## What Changes

- On **real (non-merged) descriptions** — the Specimen "Descriptions" accordion and the OTU "Holotype descriptions" accordion, in both web and PDF — change the header from `From schema "<schema name>"` to `<description name> from schema "<schema name>"`.
  - The description name renders as plain bold text (there is no Description detail page to link to).
  - The schema name is hotlinked to its schema detail page (`/query/schema/:id`) in the **web** view, and rendered as plain text in the **PDF** view.
- Add a **references subsection** beneath each real description (after the `notes:` row, mirroring the existing `written description:` / `notes:` rows):
  - **Web** renders the description's reference titles as hotlinks to each reference's detail page (via `DirectQueryLink`).
  - **PDF** renders the same reference titles as plain text, for content parity.
- The OTU **"Merged exemplar descriptions"** accordion is left completely unchanged (it is a cross-description merge with no single name, and its schema projection has no `pbotID` to link without a server change).
- No API/server changes. Two client-side query selections gain fields:
  - `SpecimenQueryResults.js` — add `pbotID` to the description's `schema { }` and add a `references { Reference { pbotID title year } order }` block.
  - `OTUQueryResults.js` — add the same `references { }` block to the holotype `describedBy.Description` selection (`name` and `schema.pbotID` are already selected).

## Capabilities

### New Capabilities
- `description-display`: How an individual description is rendered on the Specimen and OTU detail pages — the header label (description name + linked schema) and the inline references subsection, across web and PDF, excluding the merged-exemplar view.

### Modified Capabilities
<!-- None: existing specs cover description indicators and entity-level references, not the rendering of an individual description's header/references. -->

## Impact

- Client only; no `pbot-api` changes.
- Query selections: `src/components/Specimen/SpecimenQueryResults.js`, `src/components/OTU/OTUQueryResults.js`.
- Display: `src/components/Specimen/SpecimenWeb.js`, `src/components/Specimen/SpecimenPdf.js`, `src/components/OTU/OTUweb.js`, `src/components/OTU/OTUpdf.js`.
- No change to the merged-exemplar rendering in `OTUweb.js` / `OTUpdf.js`.
- Reuses existing `DirectQueryLink` (`util.js`) and the established `/query/schema/:id` and `/query/reference/:id` routes.
