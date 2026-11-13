## Context

The Schema, OTU, Specimen and Collection mutate forms each wrap one Formik instance and pass it a single inline `validationSchema={Yup.object({...})}`. In delete mode the form renders only the record picker (`schema` / `otu` / `specimen` / `collection`) and a Cascade checkbox. Picking a record copies all of its existing values into the Formik `values`. Only after that can validation pass, and only when the stored record still meets every create-time rule (`min(1)` on parts preserved, required strings, and so on).

Formik doesn't call `onSubmit` while validation errors exist. The failing fields aren't rendered in delete mode, so no error message appears. The `Delete<Entity>` mutation built by `Mutator` sends only `pbotID` and `cascade`.

`mode` is a prop of each form component (`<Entity>MutateForm({handleSubmit, mode})`), and the components re-render when it changes. The project uses Yup 0.32 and Formik 2.

## Goals / Non-Goals

**Goals:**
- Deleting works for any existing record, whatever its other field values.
- If no record is selected in delete mode, a visible message appears; the form never fails silently.
- Create and edit validation stays exactly as it is.

**Non-Goals:**
- Fixing edit mode for records that break current create rules. There, the fields are visible and show their errors.
- Building a generic "form errors summary" component.
- Changing Reference or the mutate-only forms.
- Server-side or `Mutator` changes.

## Decisions

### Choose the validation schema by `mode` at the `validationSchema` prop
Each form's `validationSchema` prop becomes an inline ternary: `mode === "delete" ? Yup.object({ <pickerField>: Yup.string().required("<Entity> is required") }) : Yup.object({...})`. The existing rules stay in place, unchanged, as the second branch.

Alternatives considered:
- *Wrap every field in `.when('mode', ...)`*: too verbose, easy to miss a field, and the async PBDB test in OTU makes it awkward.
- *`validateOnSubmit={false}` / skipping validation via `validate` when deleting*: Formik has no clean per-submit opt-out, and we still want the record-selected check.
- *Only show hidden errors*: users still couldn't delete records that break today's rules. That's the actual bug.

### Picker field names
Schema → `schema`, OTU → `otu`, Specimen → `specimen`, Collection → `collection`. These are the `name` props of the delete-mode select in each form. The required message appears through the picker's own Formik field (`formik-mui` `TextField` select / the `*Select` components), which already renders `helperText` from Formik errors.

### Inline ternary rather than named schema variables
Moving each form's rules into a `fullValidation` variable would re-indent dozens of lines, including OTU's async PBDB test, for no change in behavior. The inline ternary keeps each form's diff to a few lines, and the existing rules stay where reviewers expect them. As before, the schemas are built on every render, which is negligible.

## Risks / Trade-offs

- [The picker component may not show Formik errors (e.g. a custom `*Select` that ignores `meta.error`)] → Check each picker during implementation. If one doesn't show the error, accept it: an empty picker in delete mode is an obvious state, and still far better than the current silent failure on valid selections.
- [Formik caches the schema between mode switches] → The forms already reset values on every render via `formikRef.resetForm`, and `validationSchema` is read on each validation run, so a mode switch takes effect right away.
- [Someone deletes a record they didn't mean to, now that validation no longer acts as an accidental guard] → Not a real safeguard today. Delete already requires picking the record explicitly, and permissions are enforced server-side.
