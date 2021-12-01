import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import Descriptions from "./Descriptions.js";

function DescriptionList(props) {
    console.log("DescriptionList");
    console.log(props);
    console.log(props.filters.genus);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    let descriptionGQL;
    if (!props.includeComplex) {
        descriptionGQL = gql`
            query ($type: String, $pbotID: ID, $family: String, $genus: String, $species: String) {
                Description (type: $type, pbotID: $pbotID, family: $family, genus: $genus, species: $species) {
                    pbotID
                    name
                    family
                    genus
                    species
                }            
            }
        `;
    } else {
        descriptionGQL = gql`
            query ($type: String, $pbotID: ID, $family: String, $genus: String, $species: String) {
                Description (type: $type, pbotID: $pbotID, family: $family, genus: $genus, species: $species) {
                    pbotID
                    type
                    name
                    family
                    genus
                    species
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
        <Descriptions descriptions={data.Description}/>
    );

}

const DescriptionQueryResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let descriptions = queryEntity === "Description" ? (
                    <DescriptionList 
                        filters={{
                            type: queryParams.type || null,
                            pbotID: queryParams.descriptionID || null,
                            family: queryParams.family || null, 
                            genus: queryParams.genus || null, 
                            species: queryParams.species || null, 
                        }}
                        includeComplex={queryParams.includeComplex} 
                    />
                ) : 
                '';
    
    return (
        <div>
            {descriptions}
        </div>
    );
};

export default DescriptionQueryResults;
