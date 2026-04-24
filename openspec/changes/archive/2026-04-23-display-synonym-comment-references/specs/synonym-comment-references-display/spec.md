## ADDED Requirements

### Requirement: Fetch references for nested synonym comments

When the OTU query is executed with `$includeComments: true`, the client SHALL request the `references { Reference { pbotID title } order }` selection on every level of comments nested under `synonyms.comments`, to the full depth the client supports (currently 5 levels).

#### Scenario: Comments requested at all nesting levels

- **WHEN** an OTU direct-query page loads with `includeSynonyms=true&includeComments=true`
- **THEN** the GraphQL query sent to the server SHALL include `references { Reference { pbotID title } order }` on each of the 5 comment recursion levels under `synonyms.comments`

#### Scenario: Comments not requested

- **WHEN** the OTU direct-query page loads with `includeComments=false`
- **THEN** no `comments` selection is sent (existing `@include(if: $includeComments)` behavior), and therefore no comment references are fetched

### Requirement: Shared comment fragment

Comment field selection under `synonyms` in the OTU query SHALL be defined via a single reusable GraphQL fragment (`CommentFields` on `Comment`) so that comment field shape is specified in exactly one place.

#### Scenario: Fragment drives all levels

- **WHEN** a developer adds or changes a field selected on comments
- **THEN** the change is made once in the `CommentFields` fragment and automatically propagates to every nesting level

### Requirement: Display comment references inline

For each comment that has one or more cited references, the `Comments` component SHALL render an additional line beneath the comment's content listing each reference as a hyperlinked direct-query link to that reference.

#### Scenario: Comment with references

- **WHEN** a comment has a non-empty `references` array
- **THEN** an additional line is rendered beneath the comment's content, introduced by the label `References:` and containing each reference title as a `DirectQueryLink` of `type="reference"` pointing to the reference's `pbotID`, separated by `, `, sorted ascending by `order`

#### Scenario: Comment without references

- **WHEN** a comment has an empty or missing `references` array
- **THEN** no references line is rendered for that comment

#### Scenario: Indentation matches content

- **WHEN** a comment at recursion level N renders its references line
- **THEN** the references line uses the same left indentation as the comment's content line at level N

### Requirement: Web and PDF parity

Comment references SHALL be rendered in both the web and PDF branches of the `Comments` component with equivalent content and ordering. In the web branch references SHALL be hyperlinked; in the PDF branch references SHALL be plain text, matching how synonym-level references are already rendered in the PDF.

#### Scenario: Web rendering

- **WHEN** `Comments` is rendered without `format="pdf"`
- **THEN** comment references are rendered using `DirectQueryLink`

#### Scenario: PDF rendering

- **WHEN** `Comments` is rendered with `format="pdf"`
- **THEN** comment references are rendered as plain `<Text>` (reference titles joined by `, ` in order), consistent with the PDF's existing treatment of synonym-level references
