## 1. Unify the layout in ReferenceManager

- [x] 1.1 Make the row container `wrap="nowrap"` and `alignItems="center"` unconditionally (drop the `displayPublishedIn` ternary on `wrap`).
- [x] 1.2 Make the order and delete columns fixed-width with `flexShrink: 0` unconditionally; give the title-select cell `minWidth: 0` unconditionally.
- [x] 1.3 Always reserve the delete-column slot (button conditional on `optional || index > 0` inside it) unconditionally.
- [x] 1.4 Keep gated on `displayPublishedIn` ONLY: the "Published in" header label row and the per-row radio column.
- [x] 1.5 Ensure the `single` path still renders just the title-select (no order/delete/radio/add-button).

## 2. ReferenceSelect: full-width title for all consumers

- [x] 2.1 Make the `ReferenceManager`-variant title-select `fullWidth` unconditionally (kept the prop, pass it always from ReferenceManager).
- [x] 2.2 Apply `minWidth: 0` / `width: 100%` to the `Stack` so the title-select shrinks with its cell for all consumers.
- [x] 2.3 Kept the `fullWidth` prop rather than removing it: ReferenceManager always passes it, so the standalone `reference` editor select (not routed through ReferenceManager) stays untouched. Lower risk than hardcoding into the shared `Stack`/`InnerReferenceSelect`.

## 3. Rebase the published-in UI

- [x] 3.1 Confirm the OTU "Published in" header + radio column still render correctly on the now-unconditional layout (no behavior change). _(Code unchanged for the gated bits; build compiles.)_

## 4. Verify across all consumers and widths

- [x] 4.1 OTU mutate (`displayPublishedIn`): header centered, radios aligned, X contained, at narrow and wide widths. _(Verified in running app.)_
- [x] 4.2 Schema mutate (`single`): only the title-select renders; no regressions. _(Verified in running app.)_
- [x] 4.3 Default forms — Collection mutate, Synonym mutate, Description mutate: rows single-line, X contained, columns aligned. _(Verified in running app.)_
- [x] 4.4 `optional` forms — Specimen mutate, Comment mutate: delete on every row; aligned and contained. _(Verified in running app.)_
- [x] 4.5 `optional` + `omitOrder` query forms — OTU query, Collection query, Specimen query: no order column; aligned and contained. _(Verified in running app.)_
- [x] 4.6 Confirm title-select full-width appearance is acceptable in every form. _(Verified in running app.)_
- [x] 4.7 Production build compiles with no new warnings. _(`npx craco build` → Compiled with warnings; all pre-existing.)_
