## ADDED Requirements

### Requirement: Real description header SHALL show the description name and a linked schema

On the Specimen "Descriptions" accordion and the OTU "Holotype descriptions" accordion, each real (non-merged) description's header SHALL be rendered as `<description name> from schema "<schema name>"`, in both the web and PDF views.

- The description name SHALL render as plain bold text (no hyperlink), because there is no Description detail page.
- In the **web** view, the schema name SHALL be a hyperlink to that schema's detail page at `/query/schema/<schema pbotID>`.
- In the **PDF** view, the schema name SHALL render as plain text.

#### Scenario: Web view renders name and linked schema

- **WHEN** `SpecimenWeb.js` or `OTUweb.js` renders a real description that has a `name` and a `schema` with `pbotID` and `title`
- **THEN** the header reads `<name> from schema "<schema title>"`
- **AND** the description name is plain bold text with no link
- **AND** the schema title is a hyperlink whose target is `/query/schema/<schema pbotID>`

#### Scenario: PDF view renders name and plain-text schema

- **WHEN** `SpecimenPdf.js` or `OTUpdf.js` renders a real description that has a `name` and a `schema` with `title`
- **THEN** the header reads `<name> from schema "<schema title>"`
- **AND** neither the description name nor the schema title is a hyperlink

### Requirement: Real description SHALL display a references subsection

Each real (non-merged) description on the Specimen "Descriptions" accordion and the OTU "Holotype descriptions" accordion SHALL display a references subsection beneath the header, positioned after the `notes:` row alongside the existing `written description:` / `notes:` rows. The subsection SHALL list the description's references (the `DescriptionCitedBy` edges).

- In the **web** view, each reference title SHALL be a hyperlink to that reference's detail page, rendered via the existing `DirectQueryLink` component (`type="reference"`).
- In the **PDF** view, each reference title SHALL render as plain text.
- When a description has no references, the references subsection SHALL be omitted.

#### Scenario: Web view lists hotlinked references

- **WHEN** `SpecimenWeb.js` or `OTUweb.js` renders a real description whose `references` array is non-empty
- **THEN** a references subsection is rendered after the notes row
- **AND** each reference title is a `DirectQueryLink` of `type="reference"` targeting that reference's detail page

#### Scenario: PDF view lists plain-text references

- **WHEN** `SpecimenPdf.js` or `OTUpdf.js` renders a real description whose `references` array is non-empty
- **THEN** a references subsection is rendered after the notes row
- **AND** each reference title is plain text with no hyperlink

#### Scenario: Description with no references

- **WHEN** a real description's `references` array is empty or absent
- **THEN** no references subsection is rendered for that description

### Requirement: Query selections SHALL provide the schema id and reference fields

The client GraphQL selections that feed the Specimen and OTU detail descriptions SHALL request the fields needed to render the linked schema and the references subsection, without any server-side schema change.

#### Scenario: Specimen query selects schema pbotID and references

- **WHEN** `SpecimenQueryResults.js` builds the `describedBy.Description` selection
- **THEN** the description's `schema { }` selection includes `pbotID`
- **AND** the selection includes `references { Reference { pbotID title year } order }`

#### Scenario: OTU holotype query selects references

- **WHEN** `OTUQueryResults.js` builds the holotype `describedBy.Description` selection
- **THEN** the selection includes `references { Reference { pbotID title year } order }`
- **AND** the existing `name` and `schema { pbotID title }` selections are unchanged

### Requirement: Merged exemplar descriptions SHALL remain unchanged

The OTU "Merged exemplar descriptions" accordion SHALL retain its existing rendering in both web and PDF: the header `From schema "<schema name>"` with no hyperlink and no references subsection. This change SHALL NOT alter the merged-exemplar code paths in `OTUweb.js` or `OTUpdf.js`, and SHALL NOT require any API change.

#### Scenario: Merged section is untouched

- **WHEN** `OTUweb.js` or `OTUpdf.js` renders the "Merged exemplar descriptions" accordion
- **THEN** the header still reads `From schema "<schema name>"`
- **AND** the schema name is not hyperlinked
- **AND** no references subsection is added
