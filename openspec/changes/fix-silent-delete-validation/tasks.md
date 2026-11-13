## 1. Mode-aware validation in the four forms

- [x] 1.1 `SchemaMutateForm.js`: change the `validationSchema` prop to `mode === "delete" ? Yup.object({ schema: Yup.string().required("Schema is required") }) : Yup.object({...existing rules unchanged...})`
- [x] 1.2 `OTUMutateForm.js`: same pattern with picker field `otu` (this also drops the async PBDB test from delete mode)
- [x] 1.3 `SpecimenMutateForm.js`: same pattern with picker field `specimen`
- [x] 1.4 `CollectionMutateForm.js`: same pattern with picker field `collection`

## 2. Verify

- [x] 2.1 Check that each delete-mode picker (`SchemaSelect` in SchemaMutateForm, `OTUSelect`, `SpecimenSelect`, `CollectionSelect`) shows a Formik error when submitted empty. Note any that don't (accepted per design)
- [x] 2.2 Run `npm run build` (or start the dev server) and confirm all four forms compile with no new warnings
- [x] 2.3 Manually: in delete mode, select `Sch-ddm-06-22-23c` and Submit. The delete result appears and the schema is gone
- [x] 2.4 Manually: delete one record each of OTU, Specimen and Collection (test data) and confirm the mutation runs
- [x] 2.5 Manually: in create mode for Schema, submit with no parts preserved and confirm "At least one part is required" still blocks submit (edit/create unchanged)
