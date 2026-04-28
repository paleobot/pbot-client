## ADDED Requirements

### Requirement: SpecimenTable displays a Has Description column

The `SpecimenTable` component used in the standalone OTU display (Web and PDF) SHALL include a "Has Description" column. For each specimen row, the column SHALL render a visible checkmark when the specimen has at least one description visible to the current viewer, and SHALL render blank otherwise.

#### Scenario: Specimen with at least one visible description

- **WHEN** a specimen row is rendered in `SpecimenTable` and the specimen's `describedBy` projection contains one or more `Description` rows after rich-relationship normalization
- **THEN** the "Has Description" cell renders a checkmark

#### Scenario: Specimen with no visible descriptions

- **WHEN** a specimen row is rendered in `SpecimenTable` and the specimen's `describedBy` projection is empty or absent after rich-relationship normalization
- **THEN** the "Has Description" cell renders blank

#### Scenario: Column appears in all three specimen tables

- **WHEN** the standalone OTU page renders the holotype table, the other type specimens table, and the additional specimens table
- **THEN** each table includes the "Has Description" column

#### Scenario: PDF rendering preserves column layout

- **WHEN** the standalone OTU page is rendered in PDF format
- **THEN** the "Has Description" column appears alongside the existing columns within the page width without introducing horizontal overflow

### Requirement: Standalone OTU query fetches minimal describedBy on every specimen set

The standalone OTU GraphQL query in `OTUQueryResults.js` SHALL request `describedBy { Description { pbotID } }` on `holotypeSpecimen.Specimen`, on every `typeSpecimens.Specimen`, and on every `identifiedSpecimens.Specimen`, regardless of any optional include flags.

#### Scenario: Query without includeHolotypeDescription

- **WHEN** the standalone OTU page is loaded with `includeHolotypeDescription=false`
- **THEN** the GraphQL response contains `describedBy { Description { pbotID } }` for the holotype, type, and identified specimens
- **AND** the response does NOT contain the heavy holotype description fields (`name`, `writtenDescription`, `notes`, `schema`, `characterInstances`)

#### Scenario: Query with includeHolotypeDescription

- **WHEN** the standalone OTU page is loaded with `includeHolotypeDescription=true`
- **THEN** the GraphQL response contains the minimal `describedBy { Description { pbotID } }` projection for all three specimen sets
- **AND** the response contains the full holotype description fields needed by the existing Holotype Description accordion

### Requirement: Existing Holotype Description accordion remains functional

Adding the Has Description column SHALL NOT change the behavior of the Holotype Description accordion. When `includeHolotypeDescription=true`, the accordion SHALL render the same description content it rendered before this change.

#### Scenario: Holotype accordion renders description content

- **WHEN** the standalone OTU page is loaded with `includeHolotypeDescription=true` for an OTU whose holotype specimen has at least one visible description
- **THEN** the Holotype Description accordion renders the description schema title, written description, notes, and character instances exactly as before this change
