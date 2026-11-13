## Why

Deleting some Schemas, OTUs, Specimens and Collections fails without any message: you click Submit and nothing happens. Each mutate form applies one Yup `validationSchema` to every mode, including delete. Delete mode only renders the record picker (and Cascade), but it still checks every create-time required field against values copied from the selected record. If that record breaks a current create rule, validation fails on a field that isn't on screen. Formik then blocks submit, and the error is never shown. Example: Schema `Sch-ddm-06-22-23c` has `partsPreserved: []`. The `Delete<Entity>` mutation only uses `pbotID` and `cascade`, so none of those fields matter for a delete.

## What Changes

- In delete mode, the Schema, OTU, Specimen and Collection mutate forms validate only that a record has been selected. Create and edit validation stays the same.
- If no record is selected in delete mode, the form shows a visible error on the picker instead of failing silently.
- Side benefit: OTU delete no longer runs the async PBDB lookup on `pbdbParentTaxon`, so a PBDB outage can no longer block deletes.

## Capabilities

### New Capabilities
- `mutate-form-delete-validation`: In delete mode, entity mutate forms validate only what the delete mutation needs (the selected record), and never block submit on fields that aren't displayed.

### Modified Capabilities
<!-- none -->

## Impact

- `src/components/Schema/SchemaMutateForm.js`
- `src/components/OTU/OTUMutateForm.js`
- `src/components/Specimen/SpecimenMutateForm.js`
- `src/components/Collection/CollectionMutateForm.js`
- No server, API or `Mutator` changes. `*MutateResults` already pass `pbotID` + `cascade` for deletes.
- Other mutate-only forms (Reference, Synonym, Group, etc.) are out of scope. They may have the same latent issue and can be checked separately.
