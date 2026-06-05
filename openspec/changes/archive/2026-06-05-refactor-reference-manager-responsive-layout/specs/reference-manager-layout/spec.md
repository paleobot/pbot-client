## ADDED Requirements

### Requirement: Reference rows stay on a single line as the container narrows

`ReferenceManager` SHALL lay out each reference row on a single line whose columns do not wrap or overflow their container as the window narrows. The title-select column SHALL absorb the shrinkage; the order, published-in, and delete columns SHALL keep fixed widths.

#### Scenario: Narrow container

- **WHEN** the form is displayed and the window is narrowed
- **THEN** the delete (`X`) button remains on the same line as its row and inside the container bounds, and the title-select column shrinks rather than the row wrapping or overflowing

#### Scenario: Wide container

- **WHEN** the form is displayed in a wide window
- **THEN** the title-select column grows to fill the available space and the fixed columns remain at their set widths

### Requirement: Columns align across the header and every row

When a header row is shown (published-in case) and across all data rows, columns SHALL align vertically regardless of width — including rows that do not render a delete button.

#### Scenario: Row without a delete button

- **WHEN** a row has no delete button (e.g. the first row in a non-`optional` form)
- **THEN** its columns still align with rows that do have a delete button, because the delete column slot is reserved

#### Scenario: Published-in header alignment

- **WHEN** the published-in header is shown at any window width
- **THEN** the "Published in" label stays centered over the radio column

### Requirement: Layout robustness is not gated on the published-in feature

The single-line responsive layout SHALL apply to all `ReferenceManager` consumers. Only the published-in header label and the radio column SHALL be gated behind `displayPublishedIn`.

#### Scenario: Non-OTU consumer

- **WHEN** a consumer that does not pass `displayPublishedIn` is rendered (e.g. Collection, Schema, Comment)
- **THEN** it receives the same responsive single-line row behavior, but renders no "Published in" header and no radio column

#### Scenario: OTU consumer

- **WHEN** the OTU mutate form passes `displayPublishedIn`
- **THEN** it receives the responsive layout plus the "Published in" header and per-row radio

### Requirement: All existing prop variants are preserved

The unified layout SHALL preserve the behavior of every existing prop variant: `single`, `omitOrder`, `optional`, and the default.

#### Scenario: single

- **WHEN** a consumer passes `single`
- **THEN** only the title-select is rendered (no order column, no delete button, no "Add reference" button, no radio)

#### Scenario: omitOrder

- **WHEN** a consumer passes `omitOrder`
- **THEN** the order column is not rendered, and the remaining columns stay aligned and single-line

#### Scenario: optional

- **WHEN** a consumer passes `optional`
- **THEN** the delete button is available on every row including the first

#### Scenario: default

- **WHEN** a consumer passes neither `single`, `omitOrder`, nor `optional`
- **THEN** the order column is shown and the delete button is shown on every row except the first
