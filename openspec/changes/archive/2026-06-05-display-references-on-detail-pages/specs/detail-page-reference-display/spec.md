## ADDED Requirements

### Requirement: OTU detail page SHALL display the OTU's references with an authority indicator

The OTU direct-query page (web view) and OTU PDF export SHALL display the OTU's own entity-level references (the `CITED_BY` / `OTUCitedBy` edges), ordered by the edge `order`. Each reference SHALL show its title and year and link to the reference's detail page. Any reference whose `OTUCitedBy.publishedInReference` is `true` SHALL be visually marked as the taxonomic authority with the text `(authority source)`.

#### Scenario: standAlone query fetches references and the authority flag

- **WHEN** the OTU `*QueryResults.js` issues the standAlone (detail) query
- **THEN** the GraphQL selection SHALL include `references` with the nested `Reference { pbotID title year }`, the edge `order`, and `publishedInReference`
- **AND** the resulting `references` array SHALL be passed to the OTU web and PDF components

#### Scenario: Web display renders the References accordion before History

- **WHEN** a user visits an OTU direct-query URL (e.g. `/query/otu/<pbotID>`) and the OTU has one or more reference edges
- **THEN** the rendered page SHALL include a collapsed accordion titled "References" positioned immediately before the History accordion
- **AND** each reference SHALL render as a link (to `/query/reference/<pbotID>`) showing its title and year, ordered by the edge `order`
- **AND** a reference whose `publishedInReference` is `true` SHALL additionally render the text `(authority source)`

#### Scenario: PDF export includes the references before History

- **WHEN** a user exports an OTU direct-query page to PDF
- **THEN** the PDF SHALL include a References section positioned immediately before the History section
- **AND** a reference whose `publishedInReference` is `true` SHALL be marked `(authority source)`

### Requirement: Specimen detail page SHALL display the Specimen's references

The Specimen direct-query page (web view) and Specimen PDF export SHALL display the Specimen's own references (the `SpecimenCitedBy` edges), ordered by the edge `order`. Each reference SHALL show its title and year and link to the reference's detail page.

#### Scenario: Query selection includes the reference pbotID

- **WHEN** the Specimen `*QueryResults.js` issues a query whose `references` selection feeds the detail display
- **THEN** the nested `Reference` selection SHALL include `pbotID` (in addition to `title` and `year`) so each reference can link to `/query/reference/<pbotID>`

#### Scenario: Web display renders the References accordion before History

- **WHEN** a user visits a Specimen direct-query URL and the Specimen has one or more reference edges
- **THEN** the rendered page SHALL include a collapsed accordion titled "References" positioned immediately before the History accordion
- **AND** each reference SHALL render as a link to `/query/reference/<pbotID>` showing its title and year, ordered by the edge `order`

#### Scenario: PDF export includes the references before History

- **WHEN** a user exports a Specimen direct-query page to PDF
- **THEN** the PDF SHALL include a References section positioned immediately before the History section

### Requirement: Schema detail page SHALL display references in a dedicated block before History

The Schema direct-query page (web view) and Schema PDF export SHALL display the Schema's references (the `SchemaCitedBy` edges) in a dedicated accordion/section positioned immediately before History, rather than inline within the top key-information block. The Schema block SHALL be titled **"Reference"** (singular). Each reference SHALL show its title and year and link to the reference's detail page.

#### Scenario: References are removed from the top key-information block

- **WHEN** a user visits a Schema direct-query URL
- **THEN** the top key-information block SHALL NOT contain the references listing
- **AND** the references SHALL instead appear in a dedicated block before History

#### Scenario: Web display renders the Reference accordion before History

- **WHEN** a user visits a Schema direct-query URL and the Schema has one or more reference edges
- **THEN** the rendered page SHALL include a collapsed accordion titled "Reference" positioned immediately before the History accordion
- **AND** each reference SHALL render as a link to `/query/reference/<pbotID>` showing its title and year, ordered by the edge `order`

#### Scenario: PDF export includes the references before History

- **WHEN** a user exports a Schema direct-query page to PDF
- **THEN** the PDF SHALL include a Reference section positioned immediately before the History section
- **AND** this section SHALL NOT be duplicated in the key-information area

### Requirement: Collection References block SHALL be positioned immediately before History

The Collection direct-query page (web view) and Collection PDF export SHALL position the existing References block immediately before the History block. On the web view this moves the References accordion from before Specimens to before History; in the PDF it moves the References section to immediately before History.

#### Scenario: Web References accordion sits before History

- **WHEN** a user visits a Collection direct-query URL
- **THEN** the References accordion SHALL appear immediately before the History accordion in the accordion stack
- **AND** the displayed reference content (title, year, link) SHALL be unchanged from the prior behavior

#### Scenario: PDF References section sits before History

- **WHEN** a user exports a Collection direct-query page to PDF
- **THEN** the References section SHALL appear immediately before the History section

### Requirement: Reference display SHALL be scoped to the detail (standAlone) path

The reference-display additions SHALL affect only the entity detail pages (web + PDF) and the standAlone/detail query selections that feed them. Workbench list views and fuzzy-search query variants SHALL NOT be changed by this work.

#### Scenario: Workbench list and fuzzy search are unaffected

- **WHEN** a user runs an OTU, Specimen, or Schema query from the workbench (non-standAlone mode, including fuzzy search)
- **THEN** no new entity-level References UI SHALL be rendered for items in the list
- **AND** the non-standAlone query selections SHALL be unchanged except where they already requested references
