## ADDED Requirements

### Requirement: Schema direct-query page SHALL display entry history

The Schema direct-query page (web view) and Schema PDF export SHALL display a history section listing every entry event recorded against the Schema record, sorted by timestamp. Each entry SHALL show the timestamp, the action type (e.g. CREATE), and the full name of the person who performed the action.

#### Scenario: Web display renders the history accordion

- **WHEN** a user visits a Schema direct-query URL (e.g. `/query/schema/<pbotID>`) and the server returns the Schema with one or more `enteredBy` edges
- **THEN** the rendered page SHALL include a collapsed accordion titled "History" at the end of the existing accordion stack
- **AND** expanding the accordion SHALL show a table with one row per `enteredBy` edge, with columns for timestamp, action type, and person name (given + middle + surname)
- **AND** rows SHALL be sorted by timestamp

#### Scenario: PDF export includes the history section

- **WHEN** a user exports a Schema direct-query page to PDF
- **THEN** the PDF SHALL include a History section with one row per `enteredBy` edge
- **AND** if the Schema has no `enteredBy` edges, the PDF SHALL display the text "No history available"

#### Scenario: Workbench list view is unaffected

- **WHEN** a user runs a Schema query from the workbench (non-standAlone mode, including fuzzy search)
- **THEN** the GraphQL query sent to the server SHALL NOT request `enteredBy`
- **AND** no history UI SHALL be rendered for any Schema in the list

### Requirement: Collection direct-query page SHALL display entry history

The Collection direct-query page (web view) and Collection PDF export SHALL display a history section listing every entry event recorded against the Collection record, sorted by timestamp. Each entry SHALL show the timestamp, the action type, and the full name of the person who performed the action.

#### Scenario: Web display renders the history accordion

- **WHEN** a user visits a Collection direct-query URL (e.g. `/query/collection/<pbotID>`) and the server returns the Collection with one or more `enteredBy` edges
- **THEN** the rendered page SHALL include a collapsed accordion titled "History" at the end of the existing accordion stack
- **AND** expanding the accordion SHALL show a table with one row per `enteredBy` edge, with columns for timestamp, action type, and person name
- **AND** rows SHALL be sorted by timestamp

#### Scenario: PDF export includes the history section

- **WHEN** a user exports a Collection direct-query page to PDF
- **THEN** the PDF SHALL include a History section with one row per `enteredBy` edge
- **AND** if the Collection has no `enteredBy` edges, the PDF SHALL display the text "No history available"

#### Scenario: Workbench list view and fuzzy search are unaffected

- **WHEN** a user runs a Collection query from the workbench (non-standAlone mode, including fuzzy search)
- **THEN** the GraphQL query sent to the server SHALL NOT request `enteredBy`
- **AND** no history UI SHALL be rendered for any Collection in the list

### Requirement: Reference direct-query page SHALL display entry history

The Reference direct-query page (web view) and Reference PDF export SHALL display a history section listing every entry event recorded against the Reference record, sorted by timestamp. Each entry SHALL show the timestamp, the action type, and the full name of the person who performed the action.

#### Scenario: Web display renders the history accordion

- **WHEN** a user visits a Reference direct-query URL (e.g. `/query/reference/<pbotID>`) and the server returns the Reference with one or more `enteredBy` edges
- **THEN** the rendered page SHALL include a collapsed accordion titled "History" at the end of the existing accordion stack
- **AND** expanding the accordion SHALL show a table with one row per `enteredBy` edge, with columns for timestamp, action type, and person name
- **AND** rows SHALL be sorted by timestamp

#### Scenario: PDF export includes the history section

- **WHEN** a user exports a Reference direct-query page to PDF
- **THEN** the PDF SHALL include a History section with one row per `enteredBy` edge
- **AND** if the Reference has no `enteredBy` edges, the PDF SHALL display the text "No history available"

#### Scenario: Workbench list view is unaffected

- **WHEN** a user runs a Reference query from the workbench (non-standAlone mode)
- **THEN** the GraphQL query sent to the server SHALL NOT request `enteredBy`
- **AND** no history UI SHALL be rendered for any Reference in the list

### Requirement: History fetching SHALL be scoped to the standAlone query path

For each of Schema, Collection, and Reference, the `enteredBy` GraphQL selection SHALL appear only in the standAlone query variant of the entity's `*QueryResults.js` component. The non-standAlone and fuzzy-search query variants SHALL NOT include `enteredBy` in their selection sets.

#### Scenario: Massage step does not run when enteredBy is absent

- **WHEN** the entity's `*QueryResults.js` renders a result from a non-standAlone or fuzzy-search query
- **THEN** the component SHALL NOT attempt to build a `history` array from `enteredBy`
- **AND** the component SHALL NOT throw a runtime error due to `enteredBy` being undefined or null

#### Scenario: Massage step runs on standAlone path

- **WHEN** the entity's `*QueryResults.js` renders a result from the standAlone query path
- **THEN** the component SHALL construct `entity.history` by mapping each `enteredBy` edge to an object with `timestamp`, `type`, and `person` (full name) fields, sorted by timestamp
- **AND** this `history` array SHALL be passed to the `*Web.js` and `*Pdf.js` components for rendering
