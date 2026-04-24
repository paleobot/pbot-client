## Context

Standalone OTU pages (`/query/otu/:id`, served by `OTUDirectQueryResults` → `OTUQueryResults` → `OTUs` → `OTUweb`/`OTUpdf`) render a synonyms accordion. Each synonym already displays its cited references via `DirectQueryLink`. Comments attached to those synonyms are rendered by the generic `src/components/Comment/Comments.js` component, which recurses to arbitrary depth and currently selects only `enteredBy`, `content`, and child `comments` — no `references`.

The GraphQL schema (`pbot-api/schema.graphql:296`) already defines `Comment.references: [CommentCitedBy]` with `{Reference, order}`, the same shape used for synonym references. So the gap is entirely on the client: the query doesn't ask for them and the renderer doesn't display them.

The OTU query's comment selection is unrolled by hand to 5 levels (`OTUQueryResults.js:108–152`). Adding one field means editing five places unless the shape is factored out.

## Goals / Non-Goals

**Goals:**
- Show cited references on every comment nested under a synonym, in both web and PDF output.
- Hyperlinked references using `DirectQueryLink` to each reference's direct-query page.
- Reduce the 5-way duplication of comment field selections to a single source of truth.

**Non-Goals:**
- No server changes — `Comment.references` already exists.
- No change to comment creation/editing — `CommentMutateForm` already persists references.
- No new toggle in the query form. References ride on `$includeComments`.
- No opt-out at the `Comments` component level — references are shown for all consumers, not just OTU.
- No change to how synonym-level references are rendered (unchanged).

## Decisions

### Decision 1: Use a `CommentFields` GraphQL fragment, not inline repetition

Extract comment leaf fields into a fragment defined alongside the OTU query in `OTUQueryResults.js`:

```js
const commentFields = gql`
    fragment CommentFields on Comment {
        content
        enteredBy { Person { given surname } }
        references { Reference { pbotID title } order }
    }
`;
```

Each of the 5 recursion levels becomes `...CommentFields` plus its nested `comments { ... }` block.

**Rationale:** The per-level shape is repeated verbatim 5 times today. Factoring it localizes future edits (adding `pbotID` or timestamps later is one line instead of five). Recursion across levels still has to be unrolled — GraphQL fragments cannot self-reference.

**Alternatives considered:**
- **Full nested-tree fragment on `Commentable`** — higher payoff if Specimen/Schema/etc. also select comments. For this change, OTU is the only consumer we need to touch; a leaf-only fragment is simpler and co-locates with the query that uses it.
- **Leave the hand-unrolled block alone** — adds references in 5 places instead of 1; rejected to keep the diff small and to prevent drift.

### Decision 2: Render references inline with each comment's content

In `Comments.js`, follow the existing two-`div`-per-comment layout and append a third line (or inline suffix) only when `comment.references?.length > 0`:

```
<author>
<content>
References: <link1>, <link2>, ...    ← new, only if refs exist
```

Each reference rendered as `<DirectQueryLink type="reference" pbotID={...} text={title}/>`, ordered by `ref.order` using the existing `sort` util.

**Rationale:** The explore-phase decision was "inline, hyperlinked." A boxed treatment like the synonym-level references would be visually heavy at comment depths 3–5 where comments are already deeply indented.

**Alternatives considered:**
- **Boxed with `<Typography variant="caption">References</Typography>`** — matches synonym-level style but clutters deep threads.
- **Tooltip / expandable** — unnecessary complexity for a small set of citations.

### Decision 3: Render in PDF branch too, as plain `<Text>`

The PDF branch of `Comments.js` already parallels the web branch with `<Text>` equivalents. References get the same inline treatment as plain `<Text>` — reference titles joined by `, ` in order. This matches how synonym-level references are already rendered in the PDF (`OTUpdf.js:336`, plain `<Text>` not `<Link>`), keeping the PDF visually consistent. Clickability is a web-only concern for this change.

### Decision 4: Indentation level matches content

The new references line uses the same left margin as the content line, so refs sit flush with the content they cite.

### Decision 5: Fix PDF indentation while touching this file

While verifying the PDF output, we found that `Comments.js`'s PDF branch used `marginLeft: "<n>em"` but `@react-pdf/renderer` does not honor `em` for margins — nested comments had been rendering flush-left in every exported PDF. Since we were already editing the PDF branch, we converted the indentation to point-based values (`level * 20` and `level * 20 + 20`) that mirror the web's em ratio at roughly 10pt per em. This is a pre-existing bug fix carried along with the reference-display change to avoid revisiting the file.

## Risks / Trade-offs

- **Risk:** `Comments` is used outside OTU synonyms (e.g., any `Comment/Comments` import elsewhere). Adding references there unconditionally is by design per the explore discussion, but it means any other consumer whose query doesn't select `references` will silently pass `undefined` → safe (we gate on `comment.references?.length > 0`), but any future consumer that forgets to add the selection will render no refs. → **Mitigation:** the fragment makes the selection shape obvious, and the render gate on `?.length > 0` ensures no crash if omitted.
- **Risk:** Deep comment threads with many cited refs could wrap awkwardly. → **Mitigation:** comma-separated inline layout flows naturally; reviewable in dev before shipping.
- **Trade-off:** Fragment indirection costs a small amount of readability for readers who want to see the whole query shape in one place. Acceptable because the fragment lives adjacent to the query.

## Migration Plan

Straight client-side edit. No data migration, no server deploy, no feature flag. Merge → dev auto-deploys via existing workflow.
