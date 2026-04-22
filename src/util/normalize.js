// Normalization for phantom rows in neo4j-graphql-js rich-relationship fields.
//
// Trigger: neo4j-graphql-js projects a rich-rel field like
//   identifiedAs: [IdentifiedSpecimenOf]
// into Cypher that iterates matched edges and, for each edge, projects
// { <InnerKey>: <target-with-filters-applied>, ...rel-props }. When an edge
// matches but the target node fails a WHERE predicate — in PBOT, the group-
// scope filter our pbot-api fork adds to every entity match — the library
// still emits a projection row but with the target evaluated to null. The
// client sees e.g. [{ __typename: "_SpecimenIdentifiedAs", OTU: null }]
// instead of []. Singular rich-rel fields collapse to { Inner: null }
// instead of null. (Stock neo4j-graphql-js without our group filter does
// not exhibit this — the trigger is the filtered-out-target interaction,
// not the base library.)
//
// This module scrubs both shapes before UI components see the data.
//
// Source of truth for which fields are rich rels:
//   ../../pbot-api/schema.graphql
// Drift detection:
//   scripts/check-rich-rel-map.js
//
// normalizeEntity mutates in place. Apollo's InMemoryCache returns frozen
// objects, so callers must deep-clone at the data seam before normalizing.
// Use cloneEntity() below — JSON round-trip is fine for GraphQL responses
// (plain JSON only) and works on older browsers that lack structuredClone.

export function cloneEntity(obj) {
    return obj == null ? obj : JSON.parse(JSON.stringify(obj));
}

// Per entity: list rich-rel fields (plural) and singular rich-rel fields,
// each with the JSON key under which the target entity appears in the
// response. That key is always the target type name in this codebase's
// queries, but is spelled out here for clarity.
export const RICH_REL_FIELDS = {
    Specimen: {
        lists: [
            { field: "identifiedAs", inner: "OTU" },
            { field: "typeOf",       inner: "OTU" },
            { field: "holotypeOf",   inner: "OTU" },
            { field: "describedBy",  inner: "Description" },
            { field: "references",   inner: "Reference" },
            { field: "enteredBy",    inner: "Person" },
        ],
        singulars: [],
    },
    OTU: {
        lists: [
            { field: "identifiedSpecimens", inner: "Specimen" },
            { field: "typeSpecimens",       inner: "Specimen" },
            { field: "references",          inner: "Reference" },
            { field: "enteredBy",           inner: "Person" },
        ],
        singulars: [
            { field: "holotypeSpecimen", inner: "Specimen" },
        ],
    },
    Collection: {
        lists: [
            { field: "references", inner: "Reference" },
            { field: "enteredBy",  inner: "Person" },
        ],
        singulars: [],
    },
    Reference: {
        lists: [
            { field: "authoredBy", inner: "Person" },
            { field: "enteredBy",  inner: "Person" },
        ],
        singulars: [],
    },
    Schema: {
        lists: [
            { field: "references", inner: "Reference" },
            { field: "authoredBy", inner: "Person" },
            { field: "enteredBy",  inner: "Person" },
        ],
        singulars: [],
    },
    Description: {
        lists: [
            { field: "specimens",  inner: "Specimen" },
            { field: "references", inner: "Reference" },
            { field: "enteredBy",  inner: "Person" },
        ],
        singulars: [],
    },
    Synonym: {
        lists: [
            { field: "references", inner: "Reference" },
            { field: "enteredBy",  inner: "Person" },
        ],
        singulars: [],
    },
    Comment: {
        lists: [
            { field: "references", inner: "Reference" },
            { field: "enteredBy",  inner: "Person" },
        ],
        singulars: [],
    },
};

// Single-level, mutating. No-op on null/undefined so callers can chain with
// optional chaining. Callers that fetch nested rich rels must walk the
// nesting themselves and normalize each level, innermost first.
export function normalizeEntity(type, obj) {
    if (obj == null) return obj;
    const spec = RICH_REL_FIELDS[type];
    if (!spec) return obj;

    for (const { field, inner } of spec.lists) {
        if (Array.isArray(obj[field])) {
            obj[field] = obj[field].filter(row => row != null && row[inner] != null);
        }
    }
    for (const { field, inner } of spec.singulars) {
        if (obj[field] != null && obj[field][inner] == null) {
            obj[field] = null;
        }
    }
    return obj;
}
