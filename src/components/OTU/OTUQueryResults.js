import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import OTUs from "./OTUs.js";
import {publicGroupID} from '../Group/GroupSelect.js';

function OTUList(props) {
    console.log("OTUList");
    console.log(props);
    console.log(props.filters.genus);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    let gQL = gql`
        query ($pbotID: ID, $family: String, $genus: String, $species: String, $groups: [ID!], $includeSynonyms: Boolean!, $includeComments: Boolean!, $includeHolotypeDescription: Boolean!, $includeMergedDescription: Boolean!) {
            OTU (pbotID: $pbotID, family: $family, genus: $genus, species: $species,  filter:{elementOf_some: {pbotID_in: $groups}}) {
                pbotID
                name
                family
                genus
                species
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
                holotype @include(if: $includeHolotypeDescription) {
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
        <OTUs public={(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0])} otus={data.OTU}/>
    );

}

const OTUQueryResults = ({queryParams, queryEntity}) => {
    console.log("queryParams");
    console.log(queryParams);

    let otus = queryEntity === "OTU" ? (
                    <OTUList 
                        filters={{
                            pbotID: queryParams.otuID || null,
                            family: queryParams.family || null, 
                            genus: queryParams.genus || null, 
                            species: queryParams.species || null, 
                            groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
                        }}
                        includeSynonyms={queryParams.includeSynonyms} 
                        includeComments={queryParams.includeComments} 
                        includeHolotypeDescription={queryParams.includeHolotypeDescription} 
                        includeMergedDescription={queryParams.includeMergedDescription} 
                    />
                ) : 
                '';
    
    return (
        <div>
            {otus}
        </div>
    );
};

export default OTUQueryResults;
