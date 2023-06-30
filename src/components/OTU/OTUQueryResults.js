import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import OTUs from "./OTUs.js";
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';

function OTUList(props) {
    console.log("OTUList");
    console.log(props);
    console.log(props.filters.genus);

    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    const groups = props.standAlone ? '' : '$groups: [ID!], ';
    //const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'

    let filter = '';
    if (!props.standAlone) {
        filter = ", filter: {"
        if (!filters.states && !filters.character && !filters.schema) {
            filter += "elementOf_some: {pbotID_in: $groups}"
        } else {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}";
            //TODO: the graphql path below will change from exampleSpecimens to whatever we call
            //the set of all specimens
            if (filters.states) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            describedBy: {
                                Description: { 
                                    characterInstances_some: {
                                        state: {
                                            State: {pbotID_in: $states}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }`
            } else if (filters.character) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            describedBy: {
                                Description: { 
                                    characterInstances_some: {
                                        character: {pbotID: $character}
                                    }
                                }
                            }
                        }
                    }
                }`
            } else if (filters.schema) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            describedBy: {
                                Description: { 
                                    schema: {pbotID: $schema}
                                }
                            }
                        }
                    }
                }`
            }
            filter +="]"
        }
        filter += "}"
    }
    console.log(filter)

    let gQL;
    if (!props.standAlone) {
        gQL = gql`
            query ($pbotID: ID, $family: String, $genus: String, $species: String, ${groups} ${filters.schema ? ", $schema: ID" : ""} ${filters.character ? ", $character: ID" : ""} ${filters.states ? ", $states: [ID!]" : ""}) {
                OTU (pbotID: $pbotID, family: $family, genus: $genus, species: $species ${filter}) {
                    pbotID
                    name
                }
            }
        `
    } else {
        gQL = gql`
            query ($pbotID: ID, $family: String, $genus: String, $species: String, ${groups} $includeSynonyms: Boolean!, $includeComments: Boolean!, $includeHolotypeDescription: Boolean!, $includeMergedDescription: Boolean!) {
                OTU (pbotID: $pbotID, family: $family, genus: $genus, species: $species ${filter}) {
                    pbotID
                    name
                    family
                    genus
                    species
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
                            describedBy {
                                Description {
                                    name
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
        <OTUs public={(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0])} otus={data.OTU} standalone={props.standAlone} includeSynonyms={props.includeSynonyms} includeComments={props.includeComments} includeHolotypeDescription={props.includeHolotypeDescription} includeMergedDescription={props.includeMergedDescription}/>
    );

}

const OTUQueryResults = ({queryParams}) => {
    console.log("OTUQueryResults");
    console.log("queryParams");
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <OTUList 
            filters={{
                pbotID: queryParams.otuID || null,
                family: queryParams.family || null, 
                genus: queryParams.genus || null, 
                species: queryParams.species || null, 
                schema: queryParams.character ? null : queryParams.schema || null,
                character: queryParams.states && queryParams.states.length > 0 ? null : queryParams.character || null,
                states: queryParams.states && queryParams.states.length > 0  ? queryParams.states.map(state => state.split("~,")[1]) : null,
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeSynonyms={queryParams.includeSynonyms} 
            includeComments={queryParams.includeComments} 
            includeHolotypeDescription={queryParams.includeHolotypeDescription} 
            includeMergedDescription={queryParams.includeMergedDescription} 
            standAlone={queryParams.standAlone} 
        />
    );
};

export default OTUQueryResults;
