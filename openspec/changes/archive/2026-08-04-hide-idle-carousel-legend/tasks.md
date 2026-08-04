## 1. Add the scoped override rules

- [x] 1.1 In `src/index.css`, add `.hideIdleLegend .carousel .slide .legend { opacity: 0; }` and `.hideIdleLegend .carousel:hover .slide .legend { opacity: 1; }`.
- [x] 1.2 Add a short comment noting these override `react-responsive-carousel`'s idle/hover legend opacity and are scoped so specificity (not load order) wins.

## 2. Opt each carousel in

- [x] 2.1 `src/components/OTU/OTUweb.js` — add `className="hideIdleLegend"` to the holotype panel wrapper `div` (currently `<div style={carousel}>`, ~line 38).
- [x] 2.2 `src/components/OTU/OTUweb.js` — same for the other-type panel wrapper (~line 58).
- [x] 2.3 `src/components/OTU/OTUweb.js` — same for the identified-specimen panel wrapper (~line 78).
- [x] 2.4 `src/components/Specimen/SpecimenWeb.js` — add `className="hideIdleLegend"` to the carousel wrapper `div` (~line 113).

## 3. Verify

- [x] 3.1 OTU detail page: on each image tab (holotype / other type / identified), the caption is invisible when the pointer is off the carousel and fades in on hover. _(Verified in running app.)_
- [x] 3.2 Specimen detail page: caption invisible when idle, fades in on hover. _(Verified in running app.)_
- [x] 3.3 Confirm the fade is smooth (package `.35s` transition retained), not an instant snap. _(Verified in running app.)_
- [x] 3.4 Production build compiles with no new warnings. _(`npx craco build` → compiled; CSS bundle +29 B; only pre-existing `no-unused-vars` warnings on import lines.)_
