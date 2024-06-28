import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import OTUs from "./OTUs.js";
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import { OTUFilterHelper } from './OTUFilterHelper.js';

function OTUList(props) {
    console.log("OTUList");
    console.log(props);
    console.log(props.filters.genus);

    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    const groups = props.standAlone ? '' : '$groups: [ID!], ';
    //const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'

    const filter = OTUFilterHelper(filters, props);
    console.log(filter)

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
            synonyms @include(if: $includeSynonyms) {
                otus {
                    name
                    pbotID
                    family
                    genus
                    species
                }
                comments  @include(if: $includeComments) {
                    enteredBy {
                        Person {
                            given
                            surname
                        }
                    }
                    content
                    comments {
                        enteredBy {
                            Person {
                                given
                                surname
                            }
                        }
                        content
                        comments {
                            enteredBy {
                                Person {
                                    given
                                    surname
                                }
                            }
                            content
                            comments {
                                enteredBy {
                                    Person {
                                        given
                                        surname
                                    }
                                }
                                content
                                comments {
                                    enteredBy {
                                        Person {
                                            given
                                            surname
                                        }
                                    }
                                    content
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
            }
            holotypeSpecimen @include(if: $includeHolotypeDescription) {
                Specimen {
                    name
                    pbotID
                    describedBy {
                        Description {
                            name
                            notes
                            schema {
                                pbotID
                                title
                            }
                            characterInstances {
                                pbotID
                                character {
                                    name
                                }
                                state {
                                    State {
                                        name
                                    }
                                    order
                                    value
                                }
                            }
                        }
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
    if (!props.standAlone) {
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
                ${filters.schema ? ", $schema: ID" : ""} 
                ${filters.character ? ", $character: ID" : ""} 
                ${filters.states ? ", $states: [ID!]" : ""} 
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
            query (
                $pbotID: ID, 
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
                    pbotID: $pbotID, 
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
            includeMergedDescription: props.includeMergedDescription
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
          
    console.log("data.OTU");
    console.log(data.OTU);
    
    return (
        <OTUs select={props.select} handleSelect={props.handleSelect} public={(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0])} otus={data.OTU} standalone={props.standAlone} includeSynonyms={props.includeSynonyms} includeComments={props.includeComments} includeHolotypeDescription={props.includeHolotypeDescription} includeMergedDescription={props.includeMergedDescription}/>
    );

}

const OTUQueryResults = ({queryParams, select, handleSelect}) => {
    console.log("OTUQueryResults");
    console.log("queryParams");
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <OTUList 
            filters={{
                pbotID: queryParams.otuID || null,
                name: queryParams.name ? `(?i).*${queryParams.name.replace(/\s+/, '.*')}.*` : null,
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
                schema: queryParams.character ? null : queryParams.schema || null,
                character: queryParams.states && queryParams.states.length > 0 ? null : queryParams.character || null,
                states: queryParams.states && queryParams.states.length > 0  ? queryParams.states.map(state => state.split("~,")[1]) : null,
                partsPreserved: queryParams.partsPreserved && queryParams.partsPreserved.length > 0 ? queryParams.partsPreserved : null,
                notableFeatures: queryParams.notableFeatures && queryParams.notableFeatures.length > 0 ? queryParams.notableFeatures : null,
                mininterval: queryParams.mininterval || queryParams.maxinterval,
                maxinterval: queryParams.maxinterval || null,
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
            standAlone={queryParams.standAlone} 
            select={select}
            handleSelect={handleSelect}
        />
    );
};

export default OTUQueryResults;
