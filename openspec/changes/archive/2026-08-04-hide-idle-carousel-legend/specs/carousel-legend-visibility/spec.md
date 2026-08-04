## ADDED Requirements

### Requirement: Legend is hidden when the carousel is idle

The image-carousel legend (caption) SHALL be fully invisible (`opacity: 0`) when the pointer is not over the carousel.

#### Scenario: Pointer off the carousel

- **WHEN** a carousel with an image caption is displayed and the pointer is not over it
- **THEN** the legend is not visible (`opacity: 0`)

### Requirement: Legend fades in on hover

The legend SHALL fade in to fully visible (`opacity: 1`) when the pointer is over the carousel, preserving the package's opacity transition.

#### Scenario: Pointer over the carousel

- **WHEN** the pointer moves over a carousel that has a caption
- **THEN** the legend transitions to fully visible and, on leaving, transitions back to hidden

### Requirement: Override survives CSS load-order changes

The idle-hidden / hover-visible behavior SHALL be achieved by rules whose specificity exceeds the package rules, so it does not depend on our stylesheet loading after the package stylesheet.

#### Scenario: Our stylesheet loads before the package stylesheet

- **WHEN** the application stylesheet is bundled before `react-responsive-carousel`'s stylesheet (as it is today via `index.js`)
- **THEN** the legend is still hidden when idle and visible on hover, because the override wins on specificity rather than source order

### Requirement: Behavior is opt-in per carousel

The idle-hidden behavior SHALL apply only to carousels that opt in via the wrapper class, not to every `.legend` globally.

#### Scenario: Carousel wrapper without the opt-in class

- **WHEN** a carousel is rendered whose wrapper does not carry the opt-in class
- **THEN** its legend retains the package default (faint when idle), unaffected by this change

#### Scenario: Existing legend-bearing carousels opt in

- **WHEN** the OTU (holotype / other-type / identified) and Specimen image carousels are rendered
- **THEN** each carries the opt-in class and its legend is hidden when idle and fades in on hover
