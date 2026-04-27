## Why

When viewing comments nested under OTU synonyms, readers can see who entered each comment but not when. The creation date is useful context for judging the freshness and provenance of taxonomic commentary, especially as proposed synonymies accumulate over time.

## What Changes

- Extend the `CommentFields` GraphQL fragment used by `OTUQueryResults` to additionally select the comment's `enteredBy.timestamp.formatted` (alongside the existing `Person` selection), so the timestamp is available at every comment nesting level under synonyms.
- Update the shared `Comments` component to render the creation timestamp inline next to the enterer's name, in parentheses, in both the web and PDF branches.
- Treat `enteredBy[0]` as the CREATE entry (consistent with how the component already accesses `enteredBy[0].Person`); no edit-history sorting is introduced because comments cannot be edited from the UI.

## Capabilities

### New Capabilities
- `synonym-comment-creation-date-display`: Rendering of the original creation timestamp alongside each comment nested within OTU synonyms, in both the web and PDF presentations.

### Modified Capabilities
<!-- None. The existing `synonym-comment-references-display` capability is scoped to references and remains unchanged; this adds a parallel capability over the same code surface. -->

## Impact

- `src/components/OTU/OTUQueryResults.js` — add `timestamp { formatted }` to the `CommentFields` fragment.
- `src/components/Comment/Comments.js` — render `enteredBy[0].timestamp.formatted` next to the enterer name in both render branches.
- No server changes: `Comment.enteredBy` already exposes `timestamp.formatted` via the existing `enteredBy` relationship, and is already used the same way for the OTU's own history display.
- No additional Apollo round-trips; one extra scalar per comment level in the existing query payload.
