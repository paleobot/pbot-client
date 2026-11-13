## ADDED Requirements

### Requirement: Delete mode validates only the selected record
In delete mode, the Schema, OTU, Specimen and Collection mutate forms SHALL require only that a record is selected in the form's record picker (`schema`, `otu`, `specimen`, `collection` respectively). They SHALL NOT apply create/edit field validation rules (required fields, minimum list lengths, URL formats, external lookups such as the PBDB parent-taxon check) in delete mode.

#### Scenario: Deleting a record that violates current create rules
- **WHEN** a user in delete mode selects a Schema whose stored `partsPreserved` list is empty (e.g. `Sch-ddm-06-22-23c`) and clicks Submit
- **THEN** the form submits and the delete mutation is sent with that record's `pbotID` and the chosen `cascade` value

#### Scenario: Deleting a valid record
- **WHEN** a user in delete mode selects any OTU, Specimen, Collection or Schema and clicks Submit
- **THEN** the form submits and the delete mutation is sent

#### Scenario: OTU delete does not depend on PBDB
- **WHEN** a user in delete mode selects an OTU and clicks Submit while the PBDB API is unreachable
- **THEN** the form submits without running the PBDB parent-taxon lookup

### Requirement: Delete mode reports a missing selection visibly
When a user submits a delete-mode form without selecting a record, the form SHALL NOT submit and SHALL show a visible "required" error on the record picker.

#### Scenario: Submit with no record selected
- **WHEN** a user in delete mode clicks Submit without choosing a record
- **THEN** no mutation is sent and the record picker shows a required-field error

### Requirement: Create and edit validation unchanged
In create and edit modes, the Schema, OTU, Specimen and Collection mutate forms SHALL keep applying their full existing validation rules.

#### Scenario: Creating a Schema without parts preserved
- **WHEN** a user in create mode fills in a Schema with no parts preserved and clicks Submit
- **THEN** the form does not submit and the parts-preserved field shows "At least one part is required"
