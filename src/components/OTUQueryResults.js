import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import CharacterInstances from "./CharacterInstances";

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

function OTUs(props) {
    console.log(props);
    console.log(props.filters.genus);
    const specs = Object.keys(props.filters).reduce((acc, key) => {
        console.log(key + ", " + props.filters[key]);
        if (props.filters[key]) acc += `, ${key}: "${props.filters[key]}"`;
        return acc;
    }, 'type: "OTU"');
    console.log(specs);

    let otuGQL;
    if (!props.includeComplex) {
        otuGQL = gql`
            query {
                Description(${specs}) {
                    descriptionID
                    name
                    family
                    genus
                    species
                }            
            }
        `;
    } else {
        otuGQL = gql`
            query {
                Description (${specs}) {
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
    
    const { loading, error, data } = useQuery(otuGQL);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Description.map(({ descriptionID, name, family, genus, species, characterInstances }) => (
        <div key={descriptionID} style={style}>
            {descriptionID}: {name}, {family}, {genus}, {species} <br />
            <CharacterInstances characterInstances={characterInstances} />
            <br />
        </div>
    ));

}

const OTUQueryResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let otus = queryEntity === "OTU" ? (
                    <OTUs 
                        filters={{
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
            {otus}
        </ApolloProvider>
    );
};

export default OTUQueryResults;
