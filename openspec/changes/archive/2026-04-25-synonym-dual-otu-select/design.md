## Context

`SynonymMutateForm.js` currently defines its own module-scoped `OTUSelect` (lines ~106–151) — a plain `formik-mui` `TextField` wired as a MUI multi-select that binds to `values.otus` and requires the user to pick exactly two OTUs from a flat alphabetized list. Validation enforces `Yup.array().min(2).max(2)`.

Meanwhile, `src/components/OTU/OTUSelect.js` exports a richer shared component used by `OTUMutateForm`, `SpecimenQueryForm`, `CollectionQueryForm`, and `OTUQueryForm`. It renders a single-select `InnerOTUSelect` alongside a magnifying-glass `IconButton` that opens `OTUDialog` — a full `OTUQueryForm` + `OTUQueryResults` search surface. Its public API is `{name, label, populateMode, exclude}`; it writes the chosen pbotID to `formikProps.setFieldValue(props.name, otu.pbotID)`.

The shared component has an `exclude` prop that is threaded through `InnerOTUSelect` and `OTUDialog → OTUQueryResults` but is **not honored** by any of them. No current caller passes it. Retrofitting `exclude` through `OTUQueryResults` is nontrivial — three GraphQL branches plus the shared `OTUFilterHelper` — and out of scope for this change.

Edit-mode loads an existing synonym via the in-file `SynonymSelect`, which populates `values.otus` with the loaded synonym's OTU pbotIDs as an array.

## Goals / Non-Goals

**Goals:**
- Replace the one-off local `OTUSelect` with two instances of the shared `OTUSelect` so users get the search-dialog affordance on each picker.
- Keep the Formik data shape (`values.otus` = array of two pbotIDs) and the submitted payload identical, so no server-side change is required.
- Keep the edit-mode populate path working with zero additional glue.
- Prevent the user from selecting the same OTU in both slots.

**Non-Goals:**
- Implementing `exclude` on `InnerOTUSelect`, `OTUDialog`, or `OTUQueryResults`. The prop remains vestigial across the codebase.
- Any change to the shared `OTUSelect` component itself.
- Any change to other callers of shared `OTUSelect`.
- Any change to the GraphQL schema, resolvers, or `pbot-api`.
- Any change to the visual layout of the rest of the Synonym form (accordion, labels, reference manager, group select).

## Decisions

### Decision: Bind to scalar Formik fields `otu0`/`otu1`, translate to `otus` array at the API boundary

Pass `name="otu0"` and `name="otu1"` to the two instances. The form's `initialValues` carries `otu0: ''` and `otu1: ''` and has no awareness of an `otus` array. `SynonymMutateResults.js` adapts the scalar form fields into `otus: [otu0, otu1]` (or `null` when both are empty) before passing to `Mutator` — the same form-to-API shape-adaptation pattern other `*MutateResults` components already follow.

**Why not bracket-paths.** The first implementation attempt used `name="otus[0]"` / `name="otus[1]"` with `initialValues.otus = []`, intending to keep the `otus` array shape live in the form. In Formik 2.2.9 + `formik-mui` 4.0.0-alpha.3 this produced an asymmetry: the inline-dropdown path (which routes through Formik's `handleChange`) wrote to `values.otus[0]` correctly, but the dialog-path selection (which calls `setFieldValue("otus[0]", pbotID)`) silently failed to manifest in the rendered `Field`. Rather than chase the exact path-resolution mismatch in this combination of libraries — and rather than carry a fragile dependency on bracket-path support across the rest of the codebase, where every existing caller of the shared `OTUSelect` uses scalar names — we moved the array-shape concern to the API boundary.

**Alternatives considered:**
- *Bind to `otus[0]`/`otus[1]` (bracket paths).* Rejected after the dialog-path failure described above.
- *Bind to `otus.0`/`otus.1` (dot notation).* Not separately tested; rejected by the same reasoning since it relies on the same path-resolution behavior.
- *Keep a single multi-select but wrap the shared `OTUSelect`.* Rejected: the shared component is purpose-built as single-select; making it multi would leak back into every other caller or require a parallel component.

### Decision: Translate `otu0`/`otu1` → `otus` in `SynonymMutateResults.js`, not `SynonymMutateForm.js`

`SynonymMutateResults.js` already adapts a handful of form fields into the API shape (e.g., `groups: queryParams.public ? [global.publicGroupID] : queryParams.groups`). The new `otus` array assembly fits the same pattern and keeps the form file focused on UI/validation:

```js
otus: (queryParams.otu0 && queryParams.otu1) ?
    [queryParams.otu0, queryParams.otu1] : null,
```

Doing the translation in `onSubmit` of the form was tried briefly but mixes concerns — the form ended up with both scalar `otu0`/`otu1` fields *and* an `otus` array in `initValues`, plus an `onSubmit` rewrite step. Moving the translation to the boundary lets the form drop `otus` from `initValues` entirely.

### Decision: Enforce "both set, and distinct" via Yup on the scalar fields

Replace the current `otus: Yup.array().min(2).max(2)` with separate rules for the two scalar fields:

```js
otu0: Yup.string().required("OTU is required"),
otu1: Yup.string()
    .required("OTU is required")
    .test(
        "distinct",
        "OTUs must be different",
        function (v) { return !v || v !== this.parent.otu0; }
    ),
```

The cross-field `distinct` test uses Yup's `function (v) { ... }` form (not an arrow) so `this.parent` resolves to the surrounding object and we can compare `otu1` against the sibling `otu0`.

**Rationale:** With two slots each backed by the shared `OTUSelect`, a slot can end up empty or contain the same pbotID as the other slot. The server-side relationship may or may not reject a self-synonym — we enforce distinctness client-side rather than rely on that.

**Alternatives considered:**
- *Rely on the (unimplemented) `exclude` filter to prevent duplicates at the UI level and skip the Yup `distinct` test.* Rejected in this change because `exclude` remains vestigial; even if we implemented it on `InnerOTUSelect`, the search dialog path would still let a user pick a duplicate. Yup is the backstop that works regardless.

### Decision: Do not pass `populateMode` to either `OTUSelect`

The shared `OTUSelect`'s "full" `populateMode` writes a large set of OTU fields (name, authority, diagnosis, family, genus, species, references, …) into the surrounding Formik form on selection — that behavior is specific to `OTUMutateForm`'s edit flow. For Synonym, we only want the pbotID. Omitting the prop leaves only the `setFieldValue(props.name, otu.pbotID)` write, which is exactly what we want.

### Decision: Leave the shared `OTUSelect`'s `exclude` prop untouched

Documented in Non-Goals. The prop remains threaded-but-unhonored across `InnerOTUSelect`, `OTUDialog`, and `OTUQueryResults`. A future change can implement it without affecting this one; the Yup `distinct` test covers the immediate need.

## Risks / Trade-offs

- [A user picks the same OTU in both slots via the dialog path] → Yup `distinct` test on `otu1` blocks submit with "OTUs must be different". Not prevented at the dropdown level, but a user can see both slots' current values in the form and correct the mistake before submit.
- [Edit-mode ordering] → The server returns `otus` in an order not guaranteed to match the order the user originally entered. Because the two slots are symmetric (no senior/junior distinction), this is acceptable; users editing a synonym may see the two OTUs swapped compared to their prior entry, but the semantics are identical.
- [Reset behavior] → `resetForm({values: initValues})` in `onSubmit` and `useEffect` resets `otu0`/`otu1` to `''`; both shared `OTUSelect` instances rebind to empty scalars cleanly because Formik re-initializes.
- [Loss of dropdown-level duplicate prevention] → Accepted. A future change can implement `exclude` on `InnerOTUSelect` (and optionally `OTUQueryResults`) to filter out the other slot's selection from the menu; until then, Yup catches it at submit time.
- [Translation lives outside the form] → `SynonymMutateResults.js` is now coupled to the form's specific `otu0`/`otu1` field names. Any future change to the field naming requires editing both files. This matches how the rest of the file already handles `groups`/`public` adaptation, so the coupling is consistent with prevailing pattern.
