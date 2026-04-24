## Why

On standalone OTU pages, each synonym shows its own cited references, but the comments nested on those synonyms do not show their references. Commenters cite sources when qualifying or disputing a synonymy, and that provenance is currently invisible to readers — making the discussion harder to evaluate and follow back to primary literature.

## What Changes

- Fetch `references { Reference { pbotID title } order }` for each nested comment on synonyms in the OTU query (all 5 comment-recursion levels).
- Factor the per-level comment field selection into a shared `CommentFields` GraphQL fragment so adding/editing comment fields is a one-line change instead of a 5-way edit.
- Render comment references inline with each comment's content in `Comments.js`, as hyperlinked `DirectQueryLink`s to each reference's direct-query page (comma-separated, ordered by `order`).
- Apply the same rendering in both the web and PDF branches of `Comments.js`.
- Piggyback on the existing `$includeComments` flag — no new toggle, no new prop. References are shown unconditionally whenever comments are shown.

## Capabilities

### New Capabilities
- `synonym-comment-references-display`: Rendering of cited references on comments nested within OTU synonyms, in both the web and PDF presentations of OTU direct-query results.

### Modified Capabilities
<!-- None. No existing capability spec covers synonym or comment rendering. -->

## Impact

- **Client query**: `src/components/OTU/OTUQueryResults.js` — query gains a `CommentFields` fragment, comment subselection shrinks from a hand-unrolled 5-level block to fragment spreads.
- **Client rendering**: `src/components/Comment/Comments.js` — adds reference rendering to both web and PDF branches; imports `DirectQueryLink` and `sort`.
- **Other consumers of `Comments`**: will also start showing comment references. Per the explore discussion, this is desired everywhere — no opt-out prop.
- **Server**: no changes. `Comment.references: [CommentCitedBy]` already exists in `pbot-api/schema.graphql`.
- **Mutator/forms**: no changes. `CommentMutateForm` already persists comment references.
