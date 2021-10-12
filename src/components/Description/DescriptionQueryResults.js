import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import Descriptions from "./Descriptions.js";

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

function DescriptionList(props) {
    console.log("DescriptionList");
    console.log(props);
    console.log(props.filters.genus);
    
    //TODO: Pretty sure these params can be passed through the gql rather than built into a string
    let specs = Object.keys(props.filters).reduce((acc, key) => {
        console.log(key + ", " + props.filters[key]);
        if (key === "type" && props.filters[key] === "all") return acc;
        if (props.filters[key]) acc += `, ${key}: "${props.filters[key]}"`;
        return acc;
    }, '');
    console.log("specs");
    console.log(specs);
    specs = specs ? 
                "(" + specs + ")" :
                "";
    
    let descriptionGQL;
    if (!props.includeComplex) {
        descriptionGQL = gql`
            query {
                Description ${specs} {
                    descriptionID
                    name
                    family
                    genus
                    species
                }            
            }
        `;
    } else {
        descriptionGQL = gql`
            query {
                Description ${specs} {
                    descriptionID
                    type
                    name
                    family
                    genus
                    species
                    characterInstances {
                        characterInstanceID
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
    
    const { loading, error, data } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

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
                            type: queryParams.type,
                            descriptionID: queryParams.descriptionID,
                            family: queryParams.family, 
                            genus: queryParams.genus, 
                            species: queryParams.species, 
                        }}
                        includeComplex={queryParams.includeComplex} 
                    />
                ) : 
                '';
    
    return (
        <ApolloProvider client={client}>
            {descriptions}
        </ApolloProvider>
    );
};

export default DescriptionQueryResults;
