# Fuzzy Search

## Overview

Fuzzy search lets users find records by approximate matching on a name or title field, using Neo4j's fulltext index capabilities (Lucene edit-distance via the `~` operator). It is available on five core entities: Person, Reference, Schema, Collection, and OTU.

## Server contract (Pattern D)

The server exposes a sibling `fuzzy<Type>` query for each entity. See the pbot-api `add-fuzzy-search-core-entities` change (and `openspec/specs/fuzzy-search/spec.md`) for the authoritative contract. Each fuzzy query:

- Accepts a `searchString` (or for `fuzzyPerson`: `surname` / `given` / `middle`) used against the entity's fulltext index.
- Accepts a standard `filter: _<Type>Filter`, `first`, `offset`, `orderBy`, and `fuzzyLimit` (default `200`).
- Internally calls the fulltext index, injects a `pbotID_in` clause into the provided filter, then delegates to `neo4jgraphql()` so that filtering, projection, group scoping (`cypherParams`), and ordering all work identically to the non-fuzzy path.
- Returns results in Lucene score order by default; an explicit `orderBy` wins.

| Entity      | Query              | Fuzzy args                                    |
|-------------|--------------------|-----------------------------------------------|
| Person      | `fuzzyPerson`      | `surname`, `given`, `middle` (separate args)  |
| Reference   | `fuzzyReference`   | `searchString` (matches `title` only)         |
| Schema      | `fuzzySchema`      | `searchString` (matches `title`)              |
| Collection  | `fuzzyCollection`  | `searchString` (matches `name`)               |
| OTU         | `fuzzyOTU`         | `searchString` (matches `name`)               |

`fuzzyPersonSearch` is deprecated server-side and is no longer invoked from the client.

## Client shape

Every `*QueryForm` exposes a `fuzzy: false` boolean rendered as a `CheckboxWithLabel` adjacent to the target text field. The label is "Fuzzy title search" (Reference, Schema) or "Fuzzy name search" (Collection, OTU, Person).

Every `*QueryResults` branches on the `fuzzy` flag:

- **Fuzzy off** — the existing `<Entity>` query runs exactly as before, including `(?i).*X.*` regex wrapping of text fields and client-side sort. No observable behavior change from pre-adoption.
- **Fuzzy on** — the `fuzzy<Entity>` query runs with the raw user-entered value as `searchString` (no regex wrapping). Every other filter clause the non-fuzzy path uses is passed through unchanged under the fuzzy query's `filter: _<Type>Filter` argument. No client-side sort is applied — the server's score order is preserved.

The `<Entity>Select` search-icon Dialog path embeds `<Entity>QueryForm` + `<Entity>QueryResults` with `select={true}`, so it inherits the fuzzy checkbox automatically. The plain-dropdown `Inner<Entity>Select` pick-from-all path is out of scope and unchanged.

## Reference scope note

The non-fuzzy Reference path ORs a `bookTitle_regexp` clause alongside `title_regexp`. The fuzzy path targets `title` only (the server's fulltext index is built on `title`), so results that would have matched via `bookTitle` alone are not returned. The checkbox label "Fuzzy title search" communicates this.

## Required Neo4j fulltext indexes

The fuzzy queries will error unless the corresponding fulltext indexes exist. The server repo ships the setup commands in `pbot-api/cypher/setup-fuzzy-indexes.cypher`. For Person specifically:

```cypher
CALL db.index.fulltext.createNodeIndex('fuzzyPersonNameIndex', ['Person'], ['given', 'middle', 'surname'])
```

## Files

- `src/components/<Entity>/<Entity>QueryForm.js` — `fuzzy` init value + checkbox
- `src/components/<Entity>/<Entity>QueryResults.js` — fuzzy branch emits `fuzzy<Entity>(searchString, filter)`
- `src/components/OTU/OTUs.js` — skips `alphabetize` when `fuzzy` prop is true (alias `OTU: fuzzyOTU` keeps the downstream shape identical)
