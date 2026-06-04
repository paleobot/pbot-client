## ADDED Requirements

### Requirement: ReferenceManager exposes an opt-in published-in control

The `ReferenceManager` component SHALL accept a `displayPublishedIn` prop that defaults to falsy. The published-in radio control SHALL render only when `displayPublishedIn` is truthy, so all existing consumers that do not pass the prop remain visually and behaviorally unchanged.

#### Scenario: Consumer does not opt in

- **WHEN** `ReferenceManager` is rendered without `displayPublishedIn` (or with a falsy value)
- **THEN** no "Published in" column or radio control is rendered, and the reference rows look exactly as they did before this change

#### Scenario: Consumer opts in

- **WHEN** `ReferenceManager` is rendered with `displayPublishedIn` truthy
- **THEN** each reference row renders a radio control under a "Published in" column header

### Requirement: At most one reference may be flagged as published-in

When the published-in control is enabled, the form SHALL allow at most one reference row to be flagged with `publishedInReference === true`, mirroring the server constraint.

#### Scenario: Selecting a reference

- **WHEN** the curator clicks the published-in radio on a reference row that is not currently flagged
- **THEN** that row's `publishedInReference` becomes `true` and every other row's `publishedInReference` is set to `false`

#### Scenario: Switching the selection

- **WHEN** one row is already flagged and the curator clicks the radio on a different row
- **THEN** the newly clicked row becomes the only flagged row and the previously flagged row is cleared

### Requirement: Re-clicking the selected radio clears the flag

The published-in radio SHALL support toggle-off: clicking the currently selected radio clears the flag, leaving no reference flagged.

#### Scenario: Clearing via re-click

- **WHEN** the curator clicks the published-in radio on the row that is currently flagged
- **THEN** that row's `publishedInReference` becomes `false` and no reference row is flagged

### Requirement: Published-in radio is disabled until a reference is chosen

A reference row's published-in radio SHALL be disabled while the row has no reference selected (its `pbotID` is empty), so the empty trailing "add reference" stub cannot be flagged.

#### Scenario: Empty reference row

- **WHEN** a reference row has an empty `pbotID`
- **THEN** its published-in radio is disabled and cannot be clicked

#### Scenario: Reference chosen

- **WHEN** the curator selects a reference for a row whose `pbotID` was empty
- **THEN** that row's published-in radio becomes enabled

### Requirement: OTU mutation form enables and round-trips published-in

The OTU mutation form SHALL enable the published-in control and SHALL persist and pre-fill the `publishedInReference` value.

#### Scenario: Creating an OTU with a published-in reference

- **WHEN** the curator flags a reference as published-in and submits a new OTU
- **THEN** the submitted `references` input carries `publishedInReference: true` for that reference and `false` for the others

#### Scenario: Editing an existing OTU

- **WHEN** the curator opens an existing OTU that already has a reference flagged as published-in
- **THEN** the form pre-selects that reference's published-in radio

#### Scenario: Other entities are unaffected

- **WHEN** an entity other than OTU renders its reference manager
- **THEN** the published-in control does not appear, because only the OTU mutation form passes `displayPublishedIn`
