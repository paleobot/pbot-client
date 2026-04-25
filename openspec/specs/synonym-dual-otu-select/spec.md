# synonym-dual-otu-select Specification

## Purpose
TBD - created by archiving change synonym-dual-otu-select. Update Purpose after archive.
## Requirements
### Requirement: Synonym mutate form SHALL present OTU selection as two separate pickers

The Synonym mutate form (`src/components/Synonym/SynonymMutateForm.js`) SHALL render two independent OTU pickers in its "Required fields" section, each implemented using the shared `OTUSelect` component from `src/components/OTU/OTUSelect.js`. The two pickers SHALL bind to scalar Formik fields `otu0` and `otu1` respectively. The form's `initialValues` SHALL include `otu0: ''` and `otu1: ''` and SHALL NOT include an `otus` field — the array shape is the API's concern, not the form's.

#### Scenario: Create mode displays two OTU pickers

- **WHEN** the user navigates to the Synonym mutate form in create mode
- **THEN** the "Required fields" accordion displays two distinct OTU selection controls, each labeled to distinguish slot 1 from slot 2, each backed by the shared `OTUSelect` component (including its magnifying-glass search-dialog affordance), bound to scalar fields `otu0` and `otu1`

#### Scenario: Edit mode populates both pickers from the loaded synonym

- **WHEN** the user selects an existing synonym via the synonym selector in edit mode
- **THEN** the form's `values.otu0` and `values.otu1` are populated with the loaded synonym's two OTU pbotIDs (in the order returned by the server), and the two pickers display the corresponding names

#### Scenario: Selecting an OTU via the picker's search dialog updates the form

- **WHEN** the user opens the magnifying-glass search dialog on either picker and clicks an OTU result
- **THEN** the corresponding scalar field (`otu0` or `otu1`) is updated and the picker visually reflects the selection in the form, identically to selecting via the inline dropdown

### Requirement: API payload SHALL be assembled in `SynonymMutateResults.js`

`SynonymMutateResults.js` SHALL translate the form's scalar `otu0` and `otu1` fields into the `otus: [pbotID, pbotID]` array expected by the `Mutator` / GraphQL contract, matching the existing pattern of doing form-to-API shape adaptation in `*MutateResults` components. The form file itself SHALL NOT perform this translation.

#### Scenario: Submission with both OTUs assembles the array

- **WHEN** the user submits the Synonym mutate form with both `otu0` and `otu1` populated
- **THEN** `SynonymMutateResults.js` passes `otus: [otu0, otu1]` to `Mutator`, preserving the GraphQL contract previously produced by the single multi-select

#### Scenario: Submission missing both OTUs falls back to null

- **WHEN** `SynonymMutateResults.js` is invoked with both `otu0` and `otu1` empty
- **THEN** it passes `otus: null` to `Mutator`, matching the prior null-fallback semantics of `queryParams.otus || null`

### Requirement: Synonym mutate form SHALL reject submissions missing an OTU or with duplicate OTUs

The Synonym mutate form's client-side Yup validation SHALL require that both `otu0` and `otu1` are populated AND that `otu1` differs from `otu0`. The form SHALL NOT invoke the submit handler until both conditions are satisfied.

#### Scenario: Only one slot populated

- **WHEN** the user fills exactly one of the two OTU slots and clicks Submit
- **THEN** the form displays a validation error indicating an OTU is required, and does not invoke the submit handler

#### Scenario: Both slots populated with the same OTU

- **WHEN** the user picks the same OTU in both slots and clicks Submit
- **THEN** the form displays a validation error "OTUs must be different", and does not invoke the submit handler

#### Scenario: Both slots populated with distinct OTUs

- **WHEN** the user picks two different OTUs (one per slot) and clicks Submit
- **THEN** the form invokes the submit handler with `values.otus` set to the two selected pbotIDs

### Requirement: The shared `OTUSelect` component and its other callers SHALL remain unchanged

This change SHALL NOT modify `src/components/OTU/OTUSelect.js`, `src/components/OTU/OTUQueryResults.js`, or any other caller of the shared `OTUSelect` (`OTUMutateForm`, `SpecimenQueryForm`, `CollectionQueryForm`, `OTUQueryForm`). The vestigial `exclude` prop on the shared `OTUSelect` SHALL remain threaded-but-unhonored.

#### Scenario: Other OTUSelect callers behave identically

- **WHEN** a developer renders `OTUSelect` from `OTUMutateForm`, `SpecimenQueryForm`, `CollectionQueryForm`, or `OTUQueryForm` after this change
- **THEN** the component's public API, rendered UI, and selection behavior are bit-for-bit identical to before the change

#### Scenario: `exclude` prop remains vestigial

- **WHEN** any caller passes the `exclude` prop to the shared `OTUSelect`
- **THEN** the prop is accepted and threaded to `InnerOTUSelect` and `OTUDialog` as before, but no filtering of the OTU list or dialog results occurs

