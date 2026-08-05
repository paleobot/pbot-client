## ADDED Requirements

### Requirement: GBIF ID entry field
The Specimen mutate form SHALL provide a text input labeled "GBIF ID" in the "Other" tab of the Optional-fields accordion, bound to the `gbifID` value. The stored value SHALL be a bare GBIF occurrence key (e.g. `6168470317`), never a full URL. The field SHALL be initialized to an empty string for new specimens and populated from the existing `gbifID` when editing.

#### Scenario: Manual entry of a GBIF ID
- **WHEN** a user types a GBIF occurrence key into the "GBIF ID" field and submits the form
- **THEN** the specimen is saved with that key stored in `gbifID`

#### Scenario: Editing a specimen that already has a GBIF ID
- **WHEN** a user opens an existing specimen with a non-empty `gbifID` for editing
- **THEN** the "GBIF ID" field is pre-populated with the stored key

### Requirement: GBIF search button
Next to the "GBIF ID" field the form SHALL provide a search button (icon button using the same `ManageSearchIcon` as the iDigBio search control). The button SHALL be enabled only when the required Specimen number field (`name`) is non-empty, and SHALL carry a tooltip explaining it searches GBIF using the specimen number.

#### Scenario: Button disabled without a specimen number
- **WHEN** the Specimen number field is empty
- **THEN** the GBIF search button is disabled

#### Scenario: Button enabled with a specimen number
- **WHEN** the Specimen number field is non-empty
- **THEN** the GBIF search button is enabled

### Requirement: GBIF occurrence search dialog
Clicking the enabled search button SHALL query the GBIF occurrence search API by catalog number (`https://api.gbif.org/v1/occurrence/search?catalogNumber=<specimen number>`) and open a dialog presenting the outcome. While the request is in flight the dialog SHALL show a loading indicator. The dialog SHALL provide a way to cancel/close without changing the field.

#### Scenario: Results found
- **WHEN** the GBIF query returns one or more occurrences
- **THEN** the dialog lists each result with identifying details (scientific name, institution code, catalog number, country, year) and its GBIF `key`

#### Scenario: No results
- **WHEN** the GBIF query succeeds but returns zero occurrences
- **THEN** the dialog informs the user that no matching GBIF occurrences were found

#### Scenario: Query failure
- **WHEN** the GBIF query fails (network or API error)
- **THEN** the dialog informs the user that GBIF could not be reached / returned an error

### Requirement: Selecting a GBIF occurrence populates the field
Selecting a result in the dialog SHALL write that occurrence's `key` into the `gbifID` field and close the dialog.

#### Scenario: User selects a result
- **WHEN** a user clicks one of the listed GBIF occurrences
- **THEN** the `gbifID` field is set to that occurrence's `key` and the dialog closes

### Requirement: GBIF link display on specimen detail views
The specimen detail presentation SHALL display the GBIF reference when `gbifID` is present. The web view (`SpecimenWeb`) SHALL render it as an active hyperlink pointing to the human-readable GBIF portal page (`https://www.gbif.org/occurrence/<gbifID>`), opening in a new tab. The PDF view (`SpecimenPdf`) SHALL render it as plain text with no hyperlink. When `gbifID` is absent, neither view SHALL render a broken or empty link.

#### Scenario: Web view with a GBIF ID
- **WHEN** a specimen with a non-empty `gbifID` is shown in the web detail view
- **THEN** a GBIF link is rendered that navigates to `https://www.gbif.org/occurrence/<gbifID>` in a new tab

#### Scenario: PDF view with a GBIF ID
- **WHEN** a specimen with a non-empty `gbifID` is rendered to PDF
- **THEN** the GBIF reference appears as plain, non-hyperlinked text
