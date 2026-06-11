# Collection CSV export — exploration notes

**Status: Explored, not pursued (2026-06-10).** Captured for the next time someone
asks "can we get Collection query results as CSV?" so we don't re-derive it.

## The request

A user asked whether Collection query results (single and multiple) could be
provided as CSV. The request is under-specified: a Collection is mostly *nested
arrays of objects* (specimens → OTUs, references, enteredBy, preservationModes),
and "flat CSV" doesn't have an obvious meaning for that shape. We did not commit
to building it.

## Minimal approach if revisited

The plumbing is nearly free — there's already a `format` param flowing end-to-end
(`json`, `pdf`) and a JSON branch to copy in `CollectionQueryResults.js`:

```js
// CollectionQueryResults.js (standalone branch, ~:579)
if (props.format && "JSON" === props.format.toUpperCase()) {
    return (<><pre>{JSON.stringify(data, null, 2)}</pre></>)
}
```

The plan:
- Add `json-2-csv` (not currently a dependency).
- Run the already-fetched `collections` array through json2csv with **defaults**.
- Surface it as a "CSV link"/download next to the existing JSON and PDF link
  boxes in the workbench multi-result view (`CollectionQueryResults.js` ~:687-692).
- Single vs. multiple falls out for free — the multi-result links just re-point at
  the standalone URL with a different `format`, same as JSON/PDF today.

Estimated ~30 min for the default-mode version.

## The two traps

json2csv's array handling is the whole decision. **Stay on defaults.**

| Knob | Output | Verdict |
|---|---|---|
| **defaults** (`expandArrayObjects:false`) | 1 row per collection; scalars = clean columns; each array = one cell holding a JSON string | The quick-and-dirty win. Take this. |
| `expandArrayObjects:true` | indexed columns `specimens.0.name`, `specimens.1.name`, … | Ragged & ugly; column count = the widest collection. Avoid. |
| `unwindArrays:true` | multiple rows per collection | Cartesian explosion across the ~4 independent arrays. Useless. Avoid. |

Plain nested *objects* (e.g. `location { latitude, longitude }`) flatten cleanly to
dot columns (`location.latitude`) — those were never the problem. Arrays are.

## Honest tradeoff

Default mode gives a genuinely usable spreadsheet of **collection-level metadata**
(name, country, lat/lon, lithology, intervals, ages) — one row each, real columns —
with the deep specimen/OTU data quarantined as JSON strings in a few cells you can
ignore. That serves the most likely real need (Excel/R/GIS import). It is *not* a
relational export of specimens. If someone actually wants that, it's a different,
larger design conversation (scalar whitelist + `;`-joined summary columns), not
json2csv.

## Open decisions (deferred)

1. **Download vs. rendered text.** Prefer a Blob download (click handler builds the
   CSV and triggers a `.csv` save) over rendering CSV in a `<pre>`. A `<pre>` can't
   be "Save as foo.csv", and json2csv may be async depending on version — a click
   handler can `await` cleanly, whereas a render-time `<pre>` branch would force
   `useEffect`+`useState`. Button-only download also sidesteps the render-timing
   issue entirely.

2. **Button-only vs. `?format=csv` URL.** Mirroring JSON/PDF would also make CSV
   reachable by direct URL. That route is what reintroduces the render-time async
   handling; a button-only download avoids it. Decide based on whether direct-URL
   parity matters.

## Pre-existing constraint (not caused by CSV)

The workbench JSON/PDF/CSV links cram every collection's UUID into the URL path,
comma-joined (`CollectionQueryResults.js` ~:688). At hundreds of collections that's
a ~11k-char URL — some proxies cap ~8k. CSV doesn't make this worse (JSON/PDF
already do it), but the rich nested fetch + this URL ceiling are the real cost at
scale, not the json2csv conversion (which is negligible at hundreds of rows). Fix,
if ever needed, is shared across all three links (POST a body / stash IDs in
session) and is out of scope for the minimal CSV feature.
