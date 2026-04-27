## 1. GraphQL fragment

- [x] 1.1 In `src/components/OTU/OTUQueryResults.js`, extend the `CommentFields` fragment's `enteredBy` selection to also fetch `timestamp { formatted }` alongside the existing `Person { given surname }`.
- [ ] 1.2 Verify (via browser network panel or `console.log`) that an OTU direct-query with `includeSynonyms=true&includeComments=true` returns `timestamp.formatted` on each of the 5 nested comment levels.

## 2. Render timestamp in `Comments` component

- [x] 2.1 In `src/components/Comment/Comments.js`, web branch (`Comments.js:58`): append ` (${comment.enteredBy[0].timestamp.formatted})` after the `<given> <surname>` text inside the bold name `<div>`.
- [x] 2.2 In the same file, PDF branch (`Comments.js:31`): append the same parenthesised timestamp string after the `<given> <surname>` text inside the bold name `<Text>`.

## 3. Verify

- [ ] 3.1 Load an OTU direct-query page (web) for an OTU known to have synonym comments; confirm each comment's bold name line ends with ` (<timestamp>)`.
- [ ] 3.2 Trigger the PDF export for the same OTU and confirm the PDF shows the same `<name> (<timestamp>)` line for each comment, including nested levels.
- [ ] 3.3 Confirm comments without references and comments with references both render the new timestamp; existing references-line behaviour is unchanged.
