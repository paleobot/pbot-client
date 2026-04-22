#!/usr/bin/env node
// Dev-only sanity check: verify src/util/normalize.js RICH_REL_FIELDS matches
// the rich-relationship fields present in ../pbot-api/schema.graphql.
//
// Usage: node scripts/check-rich-rel-map.js
//
// Exits 0 when the map matches the schema for every entity it claims to
// cover. Exits 1 with a human-readable diff otherwise. Entities not present
// in RICH_REL_FIELDS are ignored (the client only tracks the entities it
// renders).

const fs = require("fs");
const path = require("path");

const SCHEMA_PATH = path.resolve(__dirname, "../../pbot-api/schema.graphql");
const NORMALIZE_PATH = path.resolve(__dirname, "../src/util/normalize.js");

function readFile(p) {
    try {
        return fs.readFileSync(p, "utf8");
    } catch (e) {
        console.error(`Could not read ${p}: ${e.message}`);
        process.exit(2);
    }
}

// Parse rich-rel wrapper types: `type X @relation(name: "...") { from: A to: B ... }`.
// Returns { WrapperName: { from, to } }.
function parseWrapperTypes(schema) {
    const wrappers = {};
    const typeRe = /type\s+(\w+)\s+@relation\s*\(\s*name:\s*"[^"]+"\s*\)\s*\{([^}]*)\}/g;
    let m;
    while ((m = typeRe.exec(schema)) !== null) {
        const name = m[1];
        const body = m[2];
        const fromM = body.match(/\bfrom\s*:\s*(\w+)/);
        const toM = body.match(/\bto\s*:\s*(\w+)/);
        if (fromM && toM) {
            wrappers[name] = { from: fromM[1], to: toM[1] };
        }
    }
    return wrappers;
}

// Parse fields on an entity type. Handles both `[Wrapper]` and
// `[Wrapper!]!` list markers, and singular `Wrapper` / `Wrapper!`.
function parseEntityFields(schema, entityName) {
    const typeRe = new RegExp(
        `type\\s+${entityName}\\b[^{]*\\{([\\s\\S]*?)\\n\\}`,
        "m"
    );
    const m = schema.match(typeRe);
    if (!m) return null;
    const body = m[1];
    const fields = [];
    const fieldRe = /^\s*(\w+)\s*(?:\([^)]*\))?\s*:\s*(\[)?(\w+)(!)?(\])?(!)?/gm;
    let f;
    while ((f = fieldRe.exec(body)) !== null) {
        const fieldName = f[1];
        const isList = !!f[2];
        const fieldType = f[3];
        if (fieldName === "from" || fieldName === "to") continue;
        fields.push({ field: fieldName, type: fieldType, isList });
    }
    return fields;
}

// Derive expected rich-rel fields for `entityName` from the schema.
// Returns { lists: [{field, inner}], singulars: [{field, inner}] }.
function expectedFor(entityName, schema, wrappers) {
    const fields = parseEntityFields(schema, entityName);
    if (!fields) return null;
    const lists = [];
    const singulars = [];
    for (const f of fields) {
        const wrapper = wrappers[f.type];
        if (!wrapper) continue;
        // Inner entity key is whichever of from/to is NOT the owning entity.
        const inner = wrapper.from === entityName ? wrapper.to : wrapper.from;
        (f.isList ? lists : singulars).push({ field: f.field, inner });
    }
    return { lists, singulars };
}

// Load RICH_REL_FIELDS from normalize.js without requiring a bundler.
// normalize.js uses ESM `export`; strip to a plain object literal and eval.
function loadRichRelFields(src) {
    const m = src.match(/export\s+const\s+RICH_REL_FIELDS\s*=\s*(\{[\s\S]*?\n\});/);
    if (!m) {
        console.error("Could not locate RICH_REL_FIELDS in normalize.js");
        process.exit(2);
    }
    // eslint-disable-next-line no-eval
    return eval(`(${m[1]})`);
}

function compareFieldSet(actual, expected, kind, entity, mismatches) {
    const actualByField = new Map(actual.map(x => [x.field, x.inner]));
    const expectedByField = new Map(expected.map(x => [x.field, x.inner]));

    for (const [field, inner] of expectedByField) {
        if (!actualByField.has(field)) {
            mismatches.push(`  ${entity}.${field} (${kind}): missing from map — schema says inner key is "${inner}"`);
        } else if (actualByField.get(field) !== inner) {
            mismatches.push(`  ${entity}.${field} (${kind}): map says inner key "${actualByField.get(field)}", schema says "${inner}"`);
        }
    }
    for (const [field, inner] of actualByField) {
        if (!expectedByField.has(field)) {
            mismatches.push(`  ${entity}.${field} (${kind}): in map with inner "${inner}" but not a rich-rel field in schema`);
        }
    }
}

function main() {
    const schema = readFile(SCHEMA_PATH);
    const normalizeSrc = readFile(NORMALIZE_PATH);
    const wrappers = parseWrapperTypes(schema);
    const map = loadRichRelFields(normalizeSrc);

    const mismatches = [];
    for (const entity of Object.keys(map)) {
        const expected = expectedFor(entity, schema, wrappers);
        if (!expected) {
            mismatches.push(`  ${entity}: entity type not found in schema`);
            continue;
        }
        compareFieldSet(map[entity].lists,     expected.lists,     "list",     entity, mismatches);
        compareFieldSet(map[entity].singulars, expected.singulars, "singular", entity, mismatches);
    }

    if (mismatches.length === 0) {
        console.log(`RICH_REL_FIELDS matches schema for ${Object.keys(map).length} entities.`);
        process.exit(0);
    }
    console.error("RICH_REL_FIELDS is out of sync with pbot-api/schema.graphql:");
    for (const line of mismatches) console.error(line);
    process.exit(1);
}

main();
