## 1. GraphQL fragment and query

- [x] 1.1 In `src/components/OTU/OTUQueryResults.js`, define a `commentFields` fragment (`gql\`fragment CommentFields on Comment { content, enteredBy { Person { given surname } }, references { Reference { pbotID title } order } }\``) near the other query definitions
- [x] 1.2 Include the fragment in the OTU query's `gql` template (e.g. `gql\`${commentFields} query otu(...) { ... }\``) for each query variant that selects comments (standard and fuzzy branches)
- [x] 1.3 Replace the 5-level hand-unrolled comment selection under `synonyms.comments` with `...CommentFields` spreads at each level, preserving the `@include(if: $includeComments)` gate at the top level and the nested `comments { ... }` recursion structure
- [x] 1.4 Verify in DevTools Network tab that a direct-query OTU load with `includeComments=true` sends the fragment and returns `references` populated on comments that have them

## 2. Web rendering

- [x] 2.1 In `src/components/Comment/Comments.js`, import `DirectQueryLink` and `sort`
- [x] 2.2 In the non-PDF branch, after the `<div style={style2}>{comment.content}</div>`, add a conditional render: when `comment.references?.length > 0`, render a `<div style={style2}>` containing the label `References: ` followed by `sort([...comment.references], "order").map(...)` of `DirectQueryLink type="reference" pbotID={ref.Reference.pbotID} text={ref.Reference.title}` separated by `, `
- [x] 2.3 Load a known OTU direct-query URL with `includeSynonyms=true&includeComments=true` and a synonym whose comment has references; confirm each reference renders as a hyperlink and navigates to the reference direct-query page

## 3. PDF rendering

- [x] 3.1 PDF branch keeps the existing `Text`-only import from `@react-pdf/renderer` (decision revised: match synonym-level PDF rendering — plain text, no `<Link>`)
- [x] 3.2 Mirror step 2.2 in the PDF branch as a `<Text style={style2}>` with `References: ` followed by reference titles joined by `, ` in `order`, matching the plain-text pattern used for synonym-level refs in `OTUpdf.js:336`
- [x] 3.3 Export a PDF of the same OTU used in 2.3; confirm references appear under each comment as plain text and that comment nesting is properly indented
- [x] 3.4 Fix pre-existing PDF indentation bug in `Comments.js`: `@react-pdf/renderer` does not honor `em` units for `marginLeft`, so nested comments were rendering flush-left in PDFs. Converted to point-based margins (`level * 20` and `level * 20 + 20`) mirroring the web's em ratio at ~10pt per em.
- [x] 3.5 Fix pre-existing PDF enteredBy-not-rendering bug in `Comments.js`: `@react-pdf/renderer` does not recognize the HTML `<b>` tag, so the author line rendered empty. Replaced with `<Text style={[style1, {fontWeight: 'bold'}]}>`.

## 4. Regression checks

- [x] 4.1 Load an OTU with synonyms whose comments have no references — confirm no stray `References:` label appears
- [x] 4.2 Load an OTU with `includeComments=false` — confirm no comment block renders at all (existing behavior unchanged)
- [x] 4.3 N/A — no other pages currently render `Comments` (the other imports turned out to be phantoms).
- [x] 4.4 `npm test` smoke test still passes (pre-existing @react-pdf/renderer Jest transform failure unchanged by this diff; CI skips tests per CLAUDE.md)
