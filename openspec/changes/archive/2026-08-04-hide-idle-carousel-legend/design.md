## Context

`react-responsive-carousel` ships two rules governing the legend, in `node_modules/react-responsive-carousel/lib/styles/carousel.css`:

```css
.carousel .slide .legend        { opacity: 0.25; transition: opacity .35s ease-in-out; }  /* idle  → (0,3,0) */
.carousel:hover .slide .legend  { opacity: 1; }                                           /* hover → (0,4,0) */
```

We render our caption as `<p className="legend">` inside each slide, reusing the package's `.legend` class, so these rules apply to us. We want idle `opacity: 0` while keeping the hover fade-in.

CSS load order in the bundle (relevant because of specificity ties):

```
index.js:4  import './index.css'                                  ← our stylesheet (loads FIRST)
index.js:5  import App  ──▶ … ──▶ SpecimenQueryResults.js:9
                                  import '…/carousel.min.css'      ← package CSS (loads AFTER)
```

Because our stylesheet loads *before* the package's, any override that only *ties* the package on specificity loses the source-order tiebreak.

Legend-rendering sites (each already wrapped in `<div style={carousel}>`):

| File | Carousels |
|------|-----------|
| `src/components/OTU/OTUweb.js` | 3 (holotype, other-type, identified panels) |
| `src/components/Specimen/SpecimenWeb.js` | 1 |

## Goals / Non-Goals

**Goals:**
- Legend fully hidden when idle; fades in on hover (keep the package's `.35s` transition).
- Override that is immune to CSS import-order changes.
- Opt-in per carousel, self-documenting intent.

**Non-Goals:**
- No blanket global restyle of every `.legend` everywhere.
- No change to caption text/markup, the package, GraphQL, or the server.
- Not touching the leftover `Carousel`/CSS imports in `OTUs.js` / `SpecimenQueryResults.js`.

## Decisions

**Decision 1 — Scoped wrapper class over a global override.** Add `className="hideIdleLegend"` to the existing per-carousel wrapper `div` and scope the override through it. This is the key decision. Alternatives considered:

| Approach | Beats idle? | Keeps hover fade-in? | Order-safe? | Verdict |
|---|---|---|---|---|
| Equal-specificity global rule | No (loses tie) | — | No | Rejected — silently broken here |
| `!important` on idle opacity | Yes | **No** — also beats hover rule | Yes | Rejected — legend never returns |
| Inline `style={{opacity:0}}` on the `<p>` | Yes | **No** — inline can't be overridden by a parent-hover rule | Yes | Rejected — invisible even on hover |
| **Scoped wrapper class, override both states** | **Yes** | **Yes** | **Yes** | **Chosen** |

**Decision 2 — Override BOTH states through the wrapper.** The wrapper contributes one extra class to every selector, so:

```css
.hideIdleLegend .carousel .slide .legend       { opacity: 0; }   /* (0,4,0)  > package (0,3,0) */
.hideIdleLegend .carousel:hover .slide .legend  { opacity: 1; }   /* (0,5,0)  > package (0,4,0) */
```

Overriding only the idle state would leave the *hover* state to the package rule at `(0,4,0)`; since our scoped idle rule is also `(0,4,0)` we would reintroduce an order tie between our idle rule and the package hover rule. Restating the hover rule at `(0,5,0)` makes both states win by specificity outright — no order dependence.

**Decision 3 — Rules live in `src/index.css`.** Because specificity now wins outright, load order no longer matters, so the already-global `index.css` is a fine home; no new stylesheet or import-order juggling required.

**Decision 4 — Keep the package's transition.** The package sets `transition: opacity .35s` on `.legend`; we only change `opacity`, so hover still animates `0 → 1` smoothly. Nothing to add.

## Risks / Trade-offs

- **Four edit sites must all get the class**, or a carousel keeps the faint idle legend. Mitigation: only two files, four wrappers; verify each panel.
- **Coupling to the package's internal class names** (`.carousel`, `.slide`, `.legend`). This already exists (we render `.legend` ourselves); the override doesn't add new coupling beyond `.carousel .slide`. Mitigation: a short comment at the CSS rules noting they override `react-responsive-carousel`.
- **Future carousels** must opt in by adding the class. Acceptable — that is the intended, non-surprising default.
