# synonym-comment-creation-date-display

Rendering of the original creation timestamp alongside each comment nested within OTU synonyms, in both the web and PDF presentations of OTU direct-query results.

## Requirements

### Requirement: Fetch creation timestamp for nested synonym comments

When the OTU query is executed with `$includeComments: true`, the client SHALL request `timestamp { formatted }` on the `enteredBy` selection within the shared `CommentFields` fragment, so that the creation timestamp is fetched for every level of comments nested under `synonyms.comments`.

#### Scenario: Timestamp requested at all nesting levels

- **WHEN** an OTU direct-query page loads with `includeSynonyms=true&includeComments=true`
- **THEN** the GraphQL query sent to the server SHALL include `enteredBy { timestamp { formatted } Person { given surname } }` on each of the 5 comment recursion levels under `synonyms.comments`

#### Scenario: Comments not requested

- **WHEN** the OTU direct-query page loads with `includeComments=false`
- **THEN** no `comments` selection is sent (existing `@include(if: $includeComments)` behavior), and therefore no comment timestamps are fetched

### Requirement: Display creation timestamp inline with enterer name

For each comment, the `Comments` component SHALL render the comment's creation timestamp inline on the same line as the enterer's name, enclosed in parentheses immediately following the name. The component SHALL read the timestamp from `enteredBy[0].timestamp.formatted`, treating `enteredBy[0]` as the CREATE entry (consistent with how `enteredBy[0].Person` is already accessed).

#### Scenario: Comment with timestamp

- **WHEN** a comment has a non-empty `enteredBy` array whose first element exposes `timestamp.formatted`
- **THEN** the comment's name line is rendered as `<given> <surname> (<timestamp.formatted>)`

#### Scenario: Indentation matches existing name line

- **WHEN** a comment at recursion level N renders its name+timestamp line
- **THEN** the line uses the same left indentation as the existing comment name line at level N (no change to layout other than the appended parenthesised timestamp)

### Requirement: Web and PDF parity

The creation timestamp SHALL be rendered in both the web and PDF branches of the `Comments` component with identical content (the unmodified `enteredBy[0].timestamp.formatted` string, in parentheses) and identical placement (appended to the enterer's name line).

#### Scenario: Web rendering

- **WHEN** `Comments` is rendered without `format="pdf"`
- **THEN** the timestamp is appended in parentheses to the bold enterer-name `<div>`

#### Scenario: PDF rendering

- **WHEN** `Comments` is rendered with `format="pdf"`
- **THEN** the timestamp is appended in parentheses to the bold enterer-name `<Text>`
