# otu-specimen-description-indicator

Display a per-specimen indicator of whether each specimen on the standalone OTU page has at least one description visible to the viewer.

## Requirements

### Requirement: SpecimenTable displays a Has Descriptions column

The `SpecimenTable` component used in the standalone OTU display (Web and PDF) SHALL include a "Has Descriptions" column (rendered as "Descriptions" in PDF). For each specimen row, the column SHALL render a visible indicator (a checkmark in the Web view, the text "Yes" in the PDF view) when the specimen has at least one description visible to the current viewer, and SHALL render blank otherwise.

#### Scenario: Specimen with at least one visible description

- **WHEN** a specimen row is rendered in `SpecimenTable` and the specimen's `describedBy` projection contains one or more `Description` rows after rich-relationship normalization
- **THEN** the column cell renders the indicator (✓ in Web, "Yes" in PDF)

#### Scenario: Specimen with no visible descriptions

- **WHEN** a specimen row is rendered in `SpecimenTable` and the specimen's `describedBy` projection is empty or absent after rich-relationship normalization
- **THEN** the column cell renders blank

#### Scenario: Column appears in all three specimen tables

- **WHEN** the standalone OTU page renders the holotype table, the other type specimens table, and the additional specimens table
- **THEN** each table includes the column

#### Scenario: PDF rendering preserves column layout

- **WHEN** the standalone OTU page is rendered in PDF format
- **THEN** the Descriptions column appears alongside the existing columns within the page width without introducing horizontal overflow

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

The Has Descriptions column SHALL NOT change the behavior of the Holotype Description accordion. When `includeHolotypeDescription=true`, the accordion SHALL render the same description content it rendered before this capability was introduced. When `includeHolotypeDescription=false`, the accordion SHALL render the "No holotype descriptions available" fallback rather than attempting to render incomplete description data.

#### Scenario: Holotype accordion renders description content

- **WHEN** the standalone OTU page is loaded with `includeHolotypeDescription=true` for an OTU whose holotype specimen has at least one visible description
- **THEN** the Holotype Description accordion renders the description schema title, written description, notes, and character instances

#### Scenario: Holotype accordion falls back when heavy fields not loaded

- **WHEN** the standalone OTU page is loaded with `includeHolotypeDescription=false`
- **THEN** the Holotype Description accordion renders "No holotype descriptions available" without attempting to read the gated heavy fields
