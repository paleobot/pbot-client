# fuzzy-search-ui

### Requirement: Each core-entity query form exposes a fuzzy-search checkbox

The `ReferenceQueryForm`, `SchemaQueryForm`, `CollectionQueryForm`, and `OTUQueryForm` components SHALL expose a boolean form field named `fuzzy` (default `false`) rendered as a `CheckboxWithLabel`. `PersonQueryForm` already exposes this field and SHALL continue to do so.

The checkbox label SHALL be "Fuzzy title search" for entities whose fuzzy target is a `title` field (Reference, Schema) and "Fuzzy name search" for entities whose fuzzy target is a `name` field (Collection, OTU) or a name-cluster (Person).

The checkbox SHALL be placed immediately adjacent to the form text field whose matching behavior it modifies.

#### Scenario: Checkbox present on Reference form

- **WHEN** a user opens `ReferenceQueryForm`
- **THEN** the form renders a checkbox labeled "Fuzzy title search"
- **AND** the checkbox appears next to the "Title" text field

#### Scenario: Checkbox present on Schema form

- **WHEN** a user opens `SchemaQueryForm`
- **THEN** the form renders a checkbox labeled "Fuzzy title search"

#### Scenario: Checkbox present on Collection form

- **WHEN** a user opens `CollectionQueryForm`
- **THEN** the form renders a checkbox labeled "Fuzzy name search"

#### Scenario: Checkbox present on OTU form

- **WHEN** a user opens `OTUQueryForm`
- **THEN** the form renders a checkbox labeled "Fuzzy name search"

#### Scenario: Checkbox defaults to unchecked

- **WHEN** any of the five query forms is opened or reset
- **THEN** the `fuzzy` field value is `false`

### Requirement: Fuzzy-off path preserves existing regex behavior

When the `fuzzy` field is `false`, each `*QueryResults` component SHALL execute exactly the query it executes today, with the same filter clauses, the same `(?i).*X.*` regex wrapping of text fields, and the same client-side sort.

This change MUST NOT alter any observable behavior of the non-fuzzy search path.

#### Scenario: Non-fuzzy Reference search unchanged

- **GIVEN** a user types "Origin" into the `title` field of `ReferenceQueryForm` with `fuzzy` unchecked
- **WHEN** the user submits
- **THEN** the GraphQL query executed is the existing `Reference(filter: { AND: [{ title_regexp: "(?i).*Origin.*" }, ...] })` query
- **AND** the results are sorted client-side by year then title, as today

#### Scenario: Non-fuzzy Person search unchanged

- **GIVEN** a user types "Darwin" into the `surname` field of `PersonQueryForm` with `fuzzy` unchecked
- **WHEN** the user submits
- **THEN** the GraphQL query executed is the standard `Person` query with `surname_regexp: "(?i).*Darwin.*"` inside `_PersonFilter`
- **AND** the results are alphabetized by surname, as today

### Requirement: Fuzzy-on path calls the matching server fuzzy query

When the `fuzzy` field is `true`, each `*QueryResults` component SHALL issue the corresponding server-side fuzzy query:

| Form                    | Fuzzy query      | `searchString` source                        |
|-------------------------|------------------|----------------------------------------------|
| `ReferenceQueryResults` | `fuzzyReference` | `title`                                      |
| `SchemaQueryResults`    | `fuzzySchema`    | `title`                                      |
| `CollectionQueryResults`| `fuzzyCollection`| `name`                                       |
| `OTUQueryResults`       | `fuzzyOTU`       | `name`                                       |
| `PersonQueryResults`    | `fuzzyPerson`    | `surname`, `given`, `middle` as separate args|

The raw user-entered value(s) SHALL be passed as the fuzzy argument(s) without regex wrapping.

#### Scenario: Fuzzy Reference calls fuzzyReference

- **GIVEN** a user types "Origin" into the `title` field with `fuzzy` checked
- **WHEN** the user submits
- **THEN** the GraphQL query executed targets `fuzzyReference(searchString: "Origin", filter: { ... })`
- **AND** the `title_regexp` clause is NOT present in the filter

#### Scenario: Fuzzy Person calls fuzzyPerson

- **GIVEN** a user types "Darwen" into `surname` with `fuzzy` checked
- **WHEN** the user submits
- **THEN** the GraphQL query executed targets `fuzzyPerson(surname: "Darwen", filter: { ... })`
- **AND** the `surname_regexp` clause is NOT present in the filter
- **AND** the query does NOT call `fuzzyPersonSearch`

### Requirement: Fuzzy-on path preserves non-target filters

When the `fuzzy` field is `true`, every filter clause other than the fuzzy target SHALL be passed through unchanged in the `filter: _<Type>Filter` argument of the fuzzy query.

This includes scalar equality (`year`, `publicationType`, etc.), nested relationship filters (`authoredBy_some`, `elementOf_some`, `memberOf_some`, `specimens_some`, etc.), exclusion lists (`pbotID_not_in`), and any form-specific filter clauses already in use.

#### Scenario: Reference year filter applies in fuzzy mode

- **GIVEN** a user types "Origin" into `title`, enters "1859" into `year`, and checks `fuzzy`
- **WHEN** the user submits
- **THEN** `fuzzyReference(searchString: "Origin", filter: { ... year: "1859" ... })` is executed
- **AND** the response contains only References whose title fuzzy-matches "Origin" AND whose year equals "1859"

#### Scenario: OTU stratigraphy filter applies in fuzzy mode

- **GIVEN** a user types "Glossopteris" into `name`, selects a stratigraphic formation, and checks `fuzzy`
- **WHEN** the user submits
- **THEN** `fuzzyOTU(searchString: "Glossopteris", filter: { ... })` is executed with the stratigraphic-formation clause present in the filter
- **AND** results respect both the fuzzy match and the formation filter

#### Scenario: Group scoping applies in fuzzy mode

- **GIVEN** a user runs a fuzzy search with the default groups (public group only)
- **WHEN** the query executes
- **THEN** the filter includes `elementOf_some: { pbotID_in: $groups }` (or `memberOf_some: ...` for Person) just as the non-fuzzy path does

### Requirement: Fuzzy-on path preserves server score order

When the `fuzzy` field is `true`, each `*QueryResults` component SHALL render results in the order returned by the server, and SHALL NOT apply any client-side `alphabetize` or `sort` call to the fuzzy results.

#### Scenario: Fuzzy Reference results are not re-sorted

- **GIVEN** `fuzzyReference` returns R1, R2, R3 in that order (score-descending)
- **WHEN** `ReferenceQueryResults` renders them
- **THEN** the rendered order is R1, R2, R3
- **AND** `sort(...)` is NOT applied to the fuzzy result array

#### Scenario: Non-fuzzy results still sort client-side

- **GIVEN** the non-fuzzy `Reference` query returns results in server order
- **WHEN** `ReferenceQueryResults` renders them with `fuzzy` unchecked
- **THEN** the existing client-side `sort(references, "year", "title")` runs as today

### Requirement: PersonQueryResults migrates off fuzzyPersonSearch

`PersonQueryResults` SHALL no longer call `fuzzyPersonSearch`. The `fuzzy`-on branch SHALL call `fuzzyPerson` and pass the same `_PersonFilter` shape used by the non-fuzzy branch (with `surname_regexp` / `given_regexp` omitted).

The client-side post-filter block (given/email/orcid/pbotID/groups/excludeList) SHALL be removed. The `memberOf { pbotID }` projection SHALL be removed (group scoping now flows through `_PersonFilter` and `cypherParams`, same as the non-fuzzy path).

#### Scenario: fuzzyPersonSearch is no longer referenced

- **WHEN** the codebase is searched for `fuzzyPersonSearch`
- **THEN** no call sites remain in `src/components/Person/`

#### Scenario: Fuzzy Person with email+surname applies both server-side

- **GIVEN** a user enters surname "Darwen", email "charles@example.com", and checks `fuzzy`
- **WHEN** the query executes
- **THEN** `fuzzyPerson(surname: "Darwen", filter: { ... email: "charles@example.com" ... })` is called
- **AND** no client-side filtering of the returned list by email occurs after the query resolves

### Requirement: Reference fuzzy match targets title only; bookTitle excluded

When `fuzzy` is `true` in `ReferenceQueryForm`, `ReferenceQueryResults` SHALL pass the user-entered title as `searchString` and SHALL NOT include the `bookTitle_regexp` OR-clause that the non-fuzzy path includes.

The "Fuzzy title search" label on the checkbox SHALL communicate this scope limitation.

#### Scenario: Reference fuzzy excludes bookTitle

- **GIVEN** a Reference exists where the user-typed string substring-matches `bookTitle` but not `title`
- **WHEN** a user runs a fuzzy search for that string
- **THEN** the Reference is NOT returned
- **AND** the same string with `fuzzy` unchecked would return it (via `bookTitle_regexp`)

### Requirement: Select search-dialog path inherits fuzzy automatically

Each `<Entity>Select` component renders a search-icon button that opens a Dialog containing `<Entity>QueryForm` and `<Entity>QueryResults` (with `select={true}`). The Dialog path SHALL therefore present the fuzzy checkbox and support the fuzzy-on query without any changes to the `Select` components themselves.

The plain-dropdown `Inner<Entity>Select` path (pick-from-all-records menu) is explicitly out of scope for this change and SHALL remain unchanged.

#### Scenario: ReferenceSelect dialog offers fuzzy

- **WHEN** a user clicks the search icon in a `ReferenceSelect` (e.g., within `ReferenceManager` inside `OTUMutateForm`)
- **THEN** the Dialog presents `ReferenceQueryForm` including the "Fuzzy title search" checkbox
- **AND** checking the box + submitting executes `fuzzyReference`
- **AND** selecting a result populates the parent form as today

#### Scenario: InnerReferenceSelect dropdown unchanged

- **WHEN** a user interacts with the plain `Reference` dropdown in `InnerReferenceSelect`
- **THEN** the dropdown continues to list Reference records in its existing alphabetized order
- **AND** no fuzzy query is invoked

### Requirement: FUZZY_SEARCH.md documents the new pattern

`src/components/Person/FUZZY_SEARCH.md` SHALL be rewritten to:
- Describe the Pattern D architecture as implemented across all five entities (Person, Reference, Schema, Collection, OTU).
- Remove the "Future Improvement: Server-Side Filtering" section (that improvement has now shipped).
- Remove the table documenting the client-side post-filter (that post-filter has been deleted).
- Reference the server-side change `add-fuzzy-search-core-entities` for the server contract.
- Note that `fuzzyPersonSearch` is deprecated server-side and no longer called from the client.

#### Scenario: FUZZY_SEARCH.md reflects the shipped pattern

- **WHEN** a developer reads `src/components/Person/FUZZY_SEARCH.md`
- **THEN** the document describes `fuzzyPerson` (not `fuzzyPersonSearch`) as the Person fuzzy query
- **AND** the document lists `fuzzyReference`, `fuzzySchema`, `fuzzyCollection`, `fuzzyOTU` as sibling queries with the same Pattern D flow
- **AND** no "Future Improvement: Server-Side Filtering" section exists
