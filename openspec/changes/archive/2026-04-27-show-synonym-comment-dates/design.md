## Context

Comments nested under OTU synonyms are rendered by the shared `Comments` component (`src/components/Comment/Comments.js`), which is reached from both `OTUweb.js` and `OTUpdf.js`. Comment field shape is centralised in a single `CommentFields` GraphQL fragment defined in `OTUQueryResults.js` and reused at every comment-recursion level (currently 5). The `Comment.enteredBy` relationship already exposes `timestamp { formatted }` on the server — it is the same shape as `OTU.enteredBy`, which is already consumed for the OTU's own history table.

Comments cannot be edited from the UI, so each comment has exactly one `enteredBy` entry (CREATE). The component already relies on this implicitly by reading `enteredBy[0].Person` directly.

## Goals / Non-Goals

**Goals:**
- Show the original creation date+time of each comment, on the same line as the enterer name, in both web and PDF.
- Keep the change narrow: one fragment edit, one component edit (two render branches).

**Non-Goals:**
- Sorting/filtering `enteredBy` to find a "most recent" entry — UI prevents edits, so `enteredBy[0]` is unambiguously the CREATE entry.
- Custom date formatting. Render `timestamp.formatted` as-is on first cut; iterate later if it looks ugly.
- Surfacing comment timestamps on entities other than synonym comments. The `Comments` component is only used under `synonyms.comments` today; if it is later reused elsewhere, that consumer will inherit the change without further work.
- Server changes. The field already exists.

## Decisions

**Decision 1: Use `enteredBy[0]` directly rather than searching for `type === "CREATE"`.**
Rationale: the `Comments` component already does this for the `Person` selection. Adopting a different access pattern just for `timestamp` would be inconsistent and would imply a possibility (multiple `enteredBy` entries) that the UI does not produce. If editing is ever added, both the name and timestamp accesses will need to change together — keeping them parallel makes that future change trivial.
Alternative considered: filter `enteredBy.find(e => e.type === "CREATE")`. Rejected as premature defensiveness.

**Decision 2: Render `timestamp.formatted` verbatim, in parentheses on the name line.**
Rationale: matches the user's stated preference ("date and timestamp", "same line as name, in parentheses"). The OTU history table already shows the raw formatted string, so visual precedent exists. Keeps the diff minimal.
Alternative considered: split on `T`, or format via `Intl.DateTimeFormat`. Deferred — easy to add later once we see how the raw string looks in context.

**Decision 3: Extend `CommentFields` rather than introducing a new fragment.**
The existing fragment is the single point of truth for comment field selection (this is the explicit purpose recorded in `synonym-comment-references-display`'s "Shared comment fragment" requirement). Adding `timestamp { formatted }` to it propagates to all 5 nesting levels automatically.

## Risks / Trade-offs

- **Payload growth**: 5× comment recursion × extra timestamp scalar per comment. Negligible in practice; comments are typically few.
- **Raw ISO string may be ugly**: mitigated by Decision 2 — easy follow-up to format if needed; not blocking.
- **Future edit-comment feature** would change the semantics of `enteredBy[0]`: at that point both the name and timestamp accesses must be revisited together (Decision 1 keeps them in lockstep).
