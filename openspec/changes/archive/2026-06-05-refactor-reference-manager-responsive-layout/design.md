## Context

The `add-otu-published-in-reference-input` change introduced a responsive single-line row layout in `ReferenceManager`, but gated all of it behind `displayPublishedIn`. The gated bits fall into two groups:

- **Feature-specific** (OTU only): the "Published in" header label row and the per-row radio column.
- **General layout robustness** (should apply everywhere): `wrap="nowrap"`, `flexShrink: 0` + fixed widths on the order/delete columns, always-reserving the delete-column slot, and making the title column shrinkable (`fullWidth` + `minWidth: 0`).

The general-robustness group exists to fix a pre-existing bug — the delete (`X`) button wrapping to a second line or overflowing the accordion as the window narrows — that affects all ~10 consumers, not just OTU.

Consumers and the variant props they pass:

| Form | props |
|------|-------|
| OTU mutate | `displayPublishedIn` |
| Schema mutate | `single` |
| Collection mutate, Synonym mutate, Description mutate | (default) |
| Specimen mutate, Comment mutate | `optional` |
| OTU query, Collection query, Specimen query | `optional` + `omitOrder` |

## Goals / Non-Goals

**Goals:**
- One responsive single-line row layout for all consumers; delete-button wrap/overflow fixed everywhere.
- Remove layout conditionals; gate only the published-in header + radio column.
- Preserve `single` / `omitOrder` / `optional` / default behavior.
- Keep the published-in feature behavior identical (rebased onto the unified layout).

**Non-Goals:**
- Any change to GraphQL, server, or `publishedInReference` semantics.
- Redesigning the reference UI beyond the layout/columns (no new fields, no restyling of the controls themselves).

## Decisions

**Decision 1 — The title-select becomes full-width / shrinkable for everyone.** A clean `nowrap` row requires one column that can shrink; otherwise `nowrap` only trades "X wraps" for "X overflows". The title-select is the natural flexible column, so it becomes `fullWidth` with `minWidth: 0` on its cell and `Stack`. This is a deliberate, mildly visible change to the other ~9 forms (the title field grows to fill its cell instead of the theme's fixed ~400px). This is the key reviewable decision; the alternative (keep fixed ~400px elsewhere) was rejected because it preserves the wrap/overflow bug and forces two parallel layouts.

**Decision 2 — Fixed columns are truly fixed.** The order, published-in, and delete columns use fixed pixel widths with `flexShrink: 0`, so only the title column shrinks. This keeps columns aligned across the header and all rows at any width.

**Decision 3 — Always reserve the delete-column slot.** Rendering the delete column slot even when its button is absent (e.g. row 0 of a non-`optional` form) keeps every row's column structure identical, so columns align row-to-row. The button itself stays conditional on `optional || index > 0`.

**Decision 4 — Gate only the feature UI.** `displayPublishedIn` continues to gate exactly two things: the "Published in" header label and the per-row radio column. Everything else (nowrap, fixed columns, reserved delete slot, shrinkable title) becomes unconditional.

**Decision 5 — Drop the now-redundant `fullWidth` plumbing.** Since the title-select is full-width for all consumers, the OTU-only `fullWidth` prop threaded through `ReferenceSelect`/`InnerReferenceSelect` becomes unconditional (or is removed in favor of always-on), simplifying the prop surface.

**Decision 6 — `single` short-circuits the column machinery.** When `single`, the component renders just the title-select (no order/delete/radio/add-button), unchanged from today.

## Risks / Trade-offs

- **Visible change to 9 other forms.** The title field width changes. Mitigation: eyeball each consumer (query and mutate variants) across widths during apply; the spec enumerates every variant as a scenario.
- **Scope beyond the original feature.** This touches shared UI for all entities. Mitigation: it is its own change with its own verification, keeping the OTU change clean and archivable.
- **`omitOrder` + responsive interaction.** Query forms omit the order column; the remaining columns must still align and stay single-line. Covered by an explicit scenario.
- **Coupling not obvious to future readers.** Why the title must be shrinkable (to make `nowrap` safe) is non-obvious. Mitigation: a short code comment at the layout site.
