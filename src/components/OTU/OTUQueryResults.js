import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import OTUs from "./OTUs.js";
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import { OTUFilterHelper } from './OTUFilterHelper.js';
import { useFetchIntervals } from '../../util.js';

const commentFields = gql`
    fragment CommentFields on Comment {
        content
        enteredBy {
            Person {
                given
                surname
            }
        }
        references {
            Reference {
                pbotID
                title
            }
            order
        }
    }
`;

function OTUList(props) {
    console.log("OTUList");
    console.log(props);
    console.log(props.filters.genus);

    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const fuzzy = !props.standAlone && !!props.fuzzy;

    const groups = props.standAlone ? '' : '$groups: [ID!], ';
    //const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'

    const filter = OTUFilterHelper(filters, props);
    console.log(filter)

    //To support an AND query on mulitiple character instances, we must generate a
    //query clause for each. Set up the per-index variables (shared by both the
    //fuzzy and non-fuzzy branches).
    let schemaIDstrings = [], characterIDstrings = [], stateIDstrings = []
    if (!props.standAlone && filters.characterInstances) {
        filters.characterInstances.forEach((ci,i) => {
            schemaIDstrings[i] = `, $schema${i}: ID`;
            filters[`schema${i}`] = ci.schema;
            if (ci.character) {
                characterIDstrings[i] = `, $character${i}: ID`;
                filters[`character${i}`] = ci.character;
            }
            if (ci.state) {
                stateIDstrings[i] = `, $state${i}: ID`;
                filters[`state${i}`] = ci.state;
            }
        })
    }

    const fields = 
        props.standAlone ?
        `
            pbotID
            name
            authority
            diagnosis
            qualityIndex
            majorTaxonGroup
            pbdbParentTaxon
            additionalClades
            family
            genus
            pfnGenusLink
            species
            pfnSpeciesLink
            notes
            partsPreserved {
                type
            }
            notableFeatures {
                name
            }
            elementOf {
                name
            }
            enteredBy {
                timestamp {
                    formatted
                }
                type
                Person {
                    given
                    middle
                    surname
                }
            }
            synonyms @include(if: $includeSynonyms) {
                explanation
                references {
                    Reference {
                        pbotID
                        title
                    }
                    order
                }
                otus {
                    name
                    pbotID
                    family
                    genus
                    species
                    identifiedSpecimens {
                        Specimen {
                            name
                            pbotID
                        }
                    }
                }
                comments  @include(if: $includeComments) {
                    ...CommentFields
                    comments {
                        ...CommentFields
                        comments {
                            ...CommentFields
                            comments {
                                ...CommentFields
                                comments {
                                    ...CommentFields
                                }
                            }
                        }
                    }
                }
            }
            mergedDescription @include(if: $includeMergedDescription) {
                schema
                characterName
                stateName
                stateValue
                stateOrder
                characterDeepOrder
                stateDeepOrder
            }
            holotypeSpecimen @include(if: $includeHolotypeDescription) {
                Specimen {
                    name
                    pbotID
                    images {
                        pbotID
                        link
                        caption
                    }
                    collection {
                        pbotID
                        name
                        mininterval
                        maxinterval
                        stratigraphicGroup
                        stratigraphicFormation
                        stratigraphicMember
                        stratigraphicBed
                        lat
                        lon
                        country
                        state     
                    }
                     describedBy {
                        Description {
                            pbotID
                            name
                            writtenDescription
                            notes
                            schema {
                                pbotID
                                title
                            }
                            characterInstances {
                                pbotID
                                character {
                                    name
                                    deepOrder
                                }
                                state {
                                    State {
                                        name
                                        deepOrder
                                    }
                                    order
                                    value
                                }
                            }
                        }
                    }
                }
            }
            typeSpecimens {
                Specimen {
                    name
                    pbotID
                    images {
                        pbotID
                        link
                        caption
                    }
                    collection {
                        pbotID
                        name
                        mininterval
                        maxinterval
                        stratigraphicGroup
                        stratigraphicFormation
                        stratigraphicMember
                        stratigraphicBed
                        lat
                        lon
                        country
                        state                   
                    }
                }
            }
            identifiedSpecimens {
                Specimen {
                    name
                    pbotID
                    images {
                        pbotID
                        link
                        caption
                    }
                    collection {
                        pbotID
                        name
                        mininterval
                        maxinterval
                        stratigraphicGroup
                        stratigraphicFormation
                        stratigraphicMember
                        stratigraphicBed
                        lat
                        lon
                        country
                        state                   
                    }
                }
            }
        `
        : props.handleSelect ?
        `
            pbotID
            name
            authority
            diagnosis
            qualityIndex
            majorTaxonGroup
            pbdbParentTaxon
            family
            genus
            pfnGenusLink
            species
            pfnSpeciesLink
            additionalClades
            notes
            identifiedSpecimens {
            Specimen {
                name
                pbotID
            }
            }
            typeSpecimens {
            Specimen {
                name
                pbotID
            }
            }
            holotypeSpecimen {
                Specimen {
                    name
                    pbotID
                }
            }
            partsPreserved {
                pbotID
            }
            notableFeatures {
                pbotID
            }
            references (orderBy: order_asc) {
                Reference {
                    pbotID
                }
                order
            }
            elementOf {
                name
                pbotID
            }
        `
        :
        `
            pbotID
            name
            partsPreserved {
                type
            }
            enteredBy {
                type
                Person {
                    given
                    middle
                    surname
                }
            }
        `

    let gQL;
    if (fuzzy) {
        const fuzzyClauses = [`{elementOf_some: {pbotID_in: $groups}}`];
        if (filters.pbotID) fuzzyClauses.push(`{pbotID: $pbotID}`);
        if (filters.family) fuzzyClauses.push(`{family: $family}`);
        if (filters.genus) fuzzyClauses.push(`{genus: $genus}`);
        if (filters.species) fuzzyClauses.push(`{species: $species}`);
        if (filters.authority) fuzzyClauses.push(`{authority: $authority}`);
        if (filters.diagnosis) fuzzyClauses.push(`{diagnosis: $diagnosis}`);
        if (filters.qualityIndex) fuzzyClauses.push(`{qualityIndex: $qualityIndex}`);
        if (filters.majorTaxonGroup) fuzzyClauses.push(`{majorTaxonGroup: $majorTaxonGroup}`);
        if (filters.pbdbParentTaxon) fuzzyClauses.push(`{pbdbParentTaxon: $pbdbParentTaxon}`);
        if (filters.additionalClades) fuzzyClauses.push(`{additionalClades: $additionalClades}`);
        if (filters.partsPreserved) fuzzyClauses.push(`{partsPreserved_some: {pbotID_in: $partsPreserved}}`);
        if (filters.notableFeatures) fuzzyClauses.push(`{notableFeatures_some: {pbotID_in: $notableFeatures}}`);
        if (filters.identifiedSpecimens) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {pbotID_in: $identifiedSpecimens}}}`);
        if (filters.typeSpecimens) fuzzyClauses.push(`{typeSpecimens_some: {Specimen: {pbotID_in: $typeSpecimens}}}`);
        if (filters.holotypeSpecimen) fuzzyClauses.push(`{holotypeSpecimen: {Specimen: {pbotID: $holotypeSpecimen}}}`);
        if (filters.synonym) fuzzyClauses.push(`{AND: [{pbotID_not: $synonym}, {synonyms_some: {otus_some: {AND: [{pbotID: $synonym}, {pbotID_not: $pbotID}]}}}]}`);
        if (filters.mininterval) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {mininterval: $mininterval}}}}`);
        if (filters.maxinterval) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {maxinterval: $maxinterval}}}}`);
        if (filters.intervals) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {OR: [{mininterval_in: $intervals}, {maxinterval_in: $intervals}]}}}}`);
        if (filters.country) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {country: $country}}}}`);
        if (filters.state) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {state: $state}}}}`);
        if (filters.lat && filters.lon) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {location_distance_lt: {point: {latitude: $lat, longitude: $lon}, distance: 10000}}}}}`);
        if (filters.stratigraphicGroup) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {stratigraphicGroup: $stratigraphicGroup}}}}`);
        if (filters.stratigraphicFormation) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {stratigraphicFormation: $stratigraphicFormation}}}}`);
        if (filters.stratigraphicMember) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {stratigraphicMember: $stratigraphicMember}}}}`);
        if (filters.stratigraphicBed) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {stratigraphicBed: $stratigraphicBed}}}}`);
        if (filters.collection) fuzzyClauses.push(`{identifiedSpecimens_some: {Specimen: {collection: {pbotID: $collection}}}}`);
        if (filters.enterers) fuzzyClauses.push(`{enteredBy_some: {Person: {pbotID_in: $enterers}, type: "CREATE"}}`);
        if (filters.references) fuzzyClauses.push(`{references_some: {Reference: {pbotID_in: $references}}}`);
        if (filters.characterInstances) {
            filters.characterInstances.forEach((ci, i) => {
                let ciClause = `{identifiedSpecimens_some: {Specimen: {describedBy_some: {Description: {schema: {pbotID: $schema${i}}`;
                if (ci.character) {
                    ciClause += `, characterInstances_some: {character: {pbotID: $character${i}}`;
                    if (ci.state) {
                        ciClause += `, state: {State: {pbotID: $state${i}}}`;
                    }
                    ciClause += `}`;
                }
                ciClause += `}}}}}`;
                fuzzyClauses.push(ciClause);
            });
        }

        gQL = gql`
            query (
                $searchString: String!,
                $groups: [ID!]
                ${filters.pbotID ? ", $pbotID: ID" : ""}
                ${filters.family ? ", $family: String" : ""}
                ${filters.genus ? ", $genus: String" : ""}
                ${filters.species ? ", $species: String" : ""}
                ${filters.authority ? ", $authority: String" : ""}
                ${filters.diagnosis ? ", $diagnosis: String" : ""}
                ${filters.qualityIndex ? ", $qualityIndex: String" : ""}
                ${filters.majorTaxonGroup ? ", $majorTaxonGroup: String" : ""}
                ${filters.pbdbParentTaxon ? ", $pbdbParentTaxon: String" : ""}
                ${filters.additionalClades ? ", $additionalClades: String" : ""}
                ${filters.partsPreserved ? ", $partsPreserved: [ID!]" : ""}
                ${filters.notableFeatures ? ", $notableFeatures: [ID!]" : ""}
                ${schemaIDstrings}
                ${characterIDstrings}
                ${stateIDstrings}
                ${filters.identifiedSpecimens ? ", $identifiedSpecimens: [ID!]" : ""}
                ${filters.typeSpecimens ? ", $typeSpecimens: [ID!]" : ""}
                ${filters.holotypeSpecimen ? ", $holotypeSpecimen: ID!" : ""}
                ${filters.references ? ", $references: [ID!]" : ""}
                ${filters.synonym ? ", $synonym: ID!" : ""}
                ${filters.mininterval ? ", $mininterval: String" : ""}
                ${filters.maxinterval ? ", $maxinterval: String" : ""}
                ${filters.lat ? ", $lat: Float" : ""}
                ${filters.lon ? ", $lon: Float" : ""}
                ${filters.country ? ", $country: String" : ""}
                ${filters.state ? ", $state: String" : ""}
                ${filters.stratigraphicGroup ? ", $stratigraphicGroup: String" : ""}
                ${filters.stratigraphicFormation ? ", $stratigraphicFormation: String" : ""}
                ${filters.stratigraphicMember ? ", $stratigraphicMember: String" : ""}
                ${filters.stratigraphicBed ? ", $stratigraphicBed: String" : ""}
                ${filters.collection ? ", $collection: ID" : ""}
                ${filters.enterers ? ", $enterers: [ID!]" : ""}
                ${filters.intervals ? ", $intervals: [String!]" : ""}
            ) {
                OTU: fuzzyOTU (
                    searchString: $searchString,
                    filter: {AND: [${fuzzyClauses.join(',')}]}
                ) {
                    ${fields}
                }
            }
        `;
    } else if (!props.standAlone) {

        gQL = gql`
            query (
                $pbotID: ID, 
                ${filters.name ? ", $name: String" : ""}
                $family: String, 
                $genus: String, 
                $species: String, 
                $authority: String, 
                $diagnosis: String, 
                $qualityIndex: String, 
                $majorTaxonGroup: String, 
                $pbdbParentTaxon: String, 
                $additionalClades: String, 
                ${groups} 
                ${filters.partsPreserved ? ", $partsPreserved: [ID!]" : ""} 
                ${filters.notableFeatures ? ", $notableFeatures: [ID!]" : ""} 
                ${schemaIDstrings}
                ${characterIDstrings}
                ${stateIDstrings}
                ${filters.identifiedSpecimens ? ", $identifiedSpecimens: [ID!]" : ""} 
                ${filters.typeSpecimens ? ", $typeSpecimens: [ID!]" : ""} 
                ${filters.holotypeSpecimen ? ", $holotypeSpecimen: ID!" : ""} 
                ${filters.references ? ", $references: [ID!]" : ""} 
                ${filters.synonym ? ", $synonym: ID!" : ""}
                ${filters.mininterval ? ", $mininterval: String" : ""}
                ${filters.maxinterval ? ", $maxinterval: String" : ""}
                ${filters.lat ? ", $lat: Float" : ""}
                ${filters.lon ? ", $lon: Float" : ""}
                ${filters.country ? ", $country: String" : ""}
                ${filters.state ? ", $state: String" : ""}
                ${filters.stratigraphicGroup ? ", $stratigraphicGroup: String" : ""}
                ${filters.stratigraphicFormation ? ", $stratigraphicFormation: String" : ""}
                ${filters.stratigraphicMember ? ", $stratigraphicMember: String" : ""}
                ${filters.stratigraphicBed ? ", $stratigraphicBed: String" : ""}
                ${filters.collection ? ", $collection: ID" : ""} 
                ${filters.enterers ? ", $enterers: [ID!]" : ""} 
                ${filters.intervals ? ", $intervals: [String!]" : ""}
            ) {
                OTU (
                    pbotID: $pbotID, 
                    family: $family, 
                    genus: $genus, 
                    species: $species, 
                    authority: $authority, 
                    diagnosis: $diagnosis, 
                    qualityIndex: $qualityIndex, 
                    majorTaxonGroup: $majorTaxonGroup, 
                    pbdbParentTaxon: $pbdbParentTaxon, 
                    additionalClades: $additionalClades 
                    ${filter}
                ) {
                    ${fields}
                }
            }
        `
    } else {
        gQL = gql`
            ${commentFields}
            query (
                $pbotID: ${filters.pbotID && Array.isArray(filters.pbotID) ?
                    "[ID!]" : "ID"},
                $name: String,
                $family: String,
                $genus: String,
                $species: String,
                ${groups}
                $includeSynonyms: Boolean!,
                $includeComments: Boolean!,
                $includeHolotypeDescription: Boolean!,
                $includeMergedDescription: Boolean!
            ) {
                OTU (
                    ${filters.pbotID && !Array.isArray(filters.pbotID) ?
                        "pbotID: $pbotID" : ""}, 
                    name: $name,
                    family: $family, 
                    genus: $genus, 
                    species: $species 
                    ${filter}
                ) {
                    ${fields}
                }
            }
        `;
    }
 
        
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters,
            includeSynonyms: props.includeSynonyms,
            includeComments: props.includeComments,
            includeHolotypeDescription: props.includeHolotypeDescription,
            includeMergedDescription: props.includeMergedDescription,
            ...(fuzzy ? {searchString: props.searchString || ''} : {})
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
          
    console.log("data.OTU");
    console.log(data.OTU);
    
    return (
        <OTUs select={props.select} handleSelect={props.handleSelect} public={(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0])} data={data} standalone={props.standAlone} includeSynonyms={props.includeSynonyms} includeComments={props.includeComments} includeHolotypeDescription={props.includeHolotypeDescription} includeMergedDescription={props.includeMergedDescription} format={props.format} fuzzy={fuzzy}/>
    );

}

const OTUQueryResults = ({queryParams, select, handleSelect}) => {
    console.log("OTUQueryResults");
    console.log("queryParams");
    console.log(queryParams);

    const global = useContext(GlobalContext);

    const fuzzy = !!queryParams.fuzzy;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const intervals = useFetchIntervals(
        queryParams.mininterval,
        queryParams.maxinterval,
        queryParams.includeOverlappingIntervals, 
        setLoading, setError
    );

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error.message}</p>

    console.log("overlapping intervals")
    console.log(intervals)

    //To support an AND query on mulitiple character instances, we must generate a
    //query clause for each. A fully specified character instance includes a schema,
    //a character, and a state. There must be an explicit query variable for each 
    //schema, character, and state. These are set up here.
    //
    //To streamline the UI, we allow multiple states to be entered for a given 
    //character. This results in a nested array, which must be flattened.
    let characterInstances;
    if (queryParams.characterInstances && queryParams.characterInstances.length > 0) {
        characterInstances = queryParams.characterInstances.reduce((acc, ci) => {
            console.log(ci)
            if (ci.states && ci.states.length > 0) {
                ci.states.filter(n => n !== '').forEach((s) => {
                    console.log(s)
                    acc.push({
                        schema: ci.schema,
                        character: ci.character,
                        state: s.split("~,")[1]
                    });
                })
            } else if (ci.character) { 
                acc.push({
                    schema: ci.schema,
                    character: ci.character
                })
            } else {
                acc.push({
                    schema: ci.schema,
               })
            }
            return acc;
        }, [])
    }
    console.log("Flattened characterInstances")
    console.log(characterInstances)

    return (
        <OTUList 
            filters={{
                pbotID: queryParams.otuID || null,
                name: (!fuzzy && queryParams.name) ? `(?i).*${queryParams.name.replace(/\s+/, '.*')}.*` : null,
                family: queryParams.family || null, 
                genus: queryParams.genus || null, 
                pfnGenusLink: queryParams.pfnGenusLink || null, 
                species: queryParams.species || null, 
                pfnSpeciesLink: queryParams.pfnSpeciesLink || null, 
                authority: queryParams.authority || null,
                diagnosis: queryParams.diagnosis || null,
                qualityIndex: queryParams.qualityIndex || null,
                majorTaxonGroup: queryParams.majorTaxonGroup || null,
                pbdbParentTaxon: queryParams.pbdbParentTaxon || null,
                additionalClades: queryParams.additionalClades || null,
                identifiedSpecimens: queryParams.identifiedSpecimens && queryParams.identifiedSpecimens.length > 0 ? queryParams.identifiedSpecimens.map(s => s.pbotID) : null,
                typeSpecimens: queryParams.typeSpecimens && queryParams.typeSpecimens.length > 0 ? queryParams.typeSpecimens.map(s => s.pbotID) : null,
                holotypeSpecimen: queryParams.holotypeSpecimen || null,
                synonym: queryParams.synonym || null,
                references: queryParams.references && queryParams.references.length > 0 ? queryParams.references.map(r => r.pbotID) : null,
                characterInstances: characterInstances || null,
                partsPreserved: queryParams.partsPreserved && queryParams.partsPreserved.length > 0 ? queryParams.partsPreserved : null,
                notableFeatures: queryParams.notableFeatures && queryParams.notableFeatures.length > 0 ? queryParams.notableFeatures : null,
                mininterval: queryParams.mininterval && !queryParams.includeOverlappingIntervals ?
                    JSON.parse(queryParams.mininterval).name : null,
                maxinterval: queryParams.maxinterval && !queryParams.includeOverlappingIntervals ?
                    JSON.parse(queryParams.maxinterval).name : null,
                intervals: intervals,
                lat: parseFloat(queryParams.lat) || null, 
                lon: parseFloat(queryParams.lon) || null,
                country: queryParams.country || null,
                state: queryParams.state || null,
                stratigraphicGroup: queryParams.stratigraphicgroup || null,
                stratigraphicFormation: queryParams.stratigraphicformation || null,
                stratigraphicMember: queryParams.stratigraphicmember || null,
                stratigraphicBed: queryParams.stratigraphicbed || null,
                collection: queryParams.collection || null, 
                enterers: queryParams.enterers && queryParams.enterers.length > 0 ?queryParams.enterers.map(({pbotID}) => pbotID)  : null, 
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeSynonyms={queryParams.includeSynonyms} 
            includeComments={queryParams.includeComments} 
            includeHolotypeDescription={queryParams.includeHolotypeDescription} 
            includeMergedDescription={queryParams.includeMergedDescription} 
            includeOverlappingIntervals={queryParams.includeOverlappingIntervals}
            standAlone={queryParams.standAlone}
            select={select}
            handleSelect={handleSelect}
            format={queryParams.format}
            fuzzy={fuzzy}
            searchString={fuzzy ? (queryParams.name || '') : null}
        />
    );
};

export default OTUQueryResults;
