import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import Descriptions from "./Descriptions.js";
import {publicGroupID} from '../Group/GroupSelect.js';

function DescriptionList(props) {
    console.log("DescriptionList");
    console.log(props);
    console.log(props.filters.genus);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    let descriptionGQL;
    if (!props.includeComplex) {
        descriptionGQL = gql`
            query ($type: String, $pbotID: ID, $family: String, $genus: String, $species: String, $groups: [ID!]) {
                Description (type: $type, pbotID: $pbotID, family: $family, genus: $genus, species: $species, filter:{elementOf_some: {pbotID_in: $groups}}) {
                    pbotID
                    name
                    family
                    genus
                    species
                    references {
                        Reference {
                            title
                            publisher
                            year
                        }
                        order
                    }
                }            
            }
        `;
    } else {
        descriptionGQL = gql`
            query ($type: String, $pbotID: ID, $family: String, $genus: String, $species: String, $groups: [ID!]) {
                Description (type: $type, pbotID: $pbotID, family: $family, genus: $genus, species: $species, filter:{elementOf_some: {pbotID_in: $groups}}) {
                    pbotID
                    type
                    name
                    family
                    genus
                    species
                    references {
                        Reference {
                            title
                            publisher
                            year
                        }
                        order
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
                            value
                            order
                        }
                    }
                }
            }
        `;
    }
    
    const { loading, error, data } = useQuery(descriptionGQL, {
        variables: {
            ...filters
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    return (
        <Descriptions public={(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0])} descriptions={data.Description}/>
    );

}

const DescriptionQueryResults = ({queryParams}) => {
    console.log(queryParams);

    return (
        <DescriptionList 
            filters={{
                type: queryParams.type || null,
                pbotID: queryParams.descriptionID || null,
                family: queryParams.family || null, 
                genus: queryParams.genus || null, 
                species: queryParams.species || null, 
                groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
            }}
            includeComplex={queryParams.includeComplex} 
        />
    );
};

export default DescriptionQueryResults;
