import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import Characters from "./Characters";

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

function Schemas(props) {
    console.log(props);
    console.log(props.filters.genus);
    let specs = Object.keys(props.filters).reduce((acc, key) => {
        console.log(key + ", " + props.filters[key]);
        if (props.filters[key]) acc += `, ${key}: "${props.filters[key]}"`;
        return acc;
    }, '');
    specs = specs === '' ? '' : `(${specs})`;
    console.log(specs);

    let schemaGQL;
    if (!props.includeCharacters) {
        schemaGQL = gql`
            query {
                Schema${specs} {
                    schemaID
                    title
                    year
                }            
            }
        `;
    } else {
        schemaGQL = gql`
            query {
                Schema ${specs} {
                    schemaID
                    title
                    year
                    characters {
                        characterID
                        name
                        states {
                            name
                            definition
                        }
                    }
                }
            }
        `;
    }
    
    const { loading, error, data } = useQuery(schemaGQL);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Schema.map(({ schemaID, title, year, characters }) => (
        <div key={schemaID} style={style}>
            {schemaID}: {title}, {year} <br />
            <Characters characters={characters} />
            <br />
        </div>
    ));

}

const SchemaQueryResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let schemas = queryEntity === "Schema" ? (
                    <Schemas 
                        filters={{
                            schemaID: queryParams.schemaID,
                            title: queryParams.title, 
                            year: queryParams.year, 
                        }}
                        includeCharacters={queryParams.includeCharacters} 
                    />
                ) : 
                '';
    
    return (
        <ApolloProvider client={client}>
            {schemas}
        </ApolloProvider>
    );
};

export default SchemaQueryResults;
