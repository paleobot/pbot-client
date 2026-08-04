## Why

`react-responsive-carousel` styles its image `.legend` (our caption) at `opacity: 0.25` when idle and `opacity: 1` on carousel hover. The faint-but-visible idle caption is distracting; we want the legend to be fully hidden when the mouse is off the carousel and to fade in only on hover.

The naive fix — a `.carousel .slide .legend { opacity: 0 }` rule in a global stylesheet — silently fails in this codebase. It ties the package's idle rule on specificity `(0,3,0)`, so **source order** decides, and `src/index.css` is imported (`index.js:4`) *before* the package CSS (`SpecimenQueryResults.js:9`), so the package wins the tie. A raw `!important` override "works" but also outranks the non-important hover rule, so the legend would never reappear on hover.

## What Changes

- Hide the carousel legend entirely when idle (`opacity: 0`) while preserving the package's hover-to-`opacity: 1` fade-in.
- Do this with a **scoped wrapper class** (`hideIdleLegend`) on the existing per-carousel wrapper `div`, overriding **both** the idle and hover states through that wrapper. This raises specificity to `(0,4,0)` / `(0,5,0)`, strictly above the package's `(0,3,0)` / `(0,4,0)`, so the override is immune to CSS import order — the exact fragility that breaks the naive approach.
- The override is opt-in per carousel, not a blanket global rule, so it can't surprise a future carousel that wants the default behavior.

## Capabilities

### New Capabilities
- `carousel-legend-visibility`: The visibility contract for image-carousel legends (captions) — hidden when idle, fading in on hover — and the requirement that the override survive CSS load-order changes.

## Impact

- `src/index.css` — add two scoped override rules (`.hideIdleLegend .carousel .slide .legend { opacity: 0 }` and `.hideIdleLegend .carousel:hover .slide .legend { opacity: 1 }`).
- `src/components/OTU/OTUweb.js` — add `className="hideIdleLegend"` to the three carousel wrapper `div`s (holotype / other-type / identified panels).
- `src/components/Specimen/SpecimenWeb.js` — add `className="hideIdleLegend"` to the one carousel wrapper `div`.
- No change to the caption content, the `<p className="legend">` elements, the package, GraphQL, or the server.
- Out of scope: the leftover `Carousel`/CSS imports in `OTUs.js` and `SpecimenQueryResults.js` (they render no legend themselves), and any change to the shared `carousel` inline style object.
