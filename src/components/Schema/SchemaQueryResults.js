import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import Characters from "../Character/Characters";

function Schemas(props) {
    console.log(props);
    console.log(props.filters.genus);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    let gQL;
    if (!props.includeCharacters) {
        gQL = gql`
            query ($schemaID: ID, $title: String, $year: String) {
                Schema (schemaID: $schemaID, title: $title, year: $year) {
                    schemaID
                    title
                    year
                }            
            }
        `;
    } else {
        gQL = gql`
            query ($schemaID: ID, $title: String, $year: String) {
                Schema (schemaID: $schemaID, title: $title, year: $year) {
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
    
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters
        },
        fetchPolicy: "cache-and-network"
    });

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
        <div>
            {schemas}
        </div>
    );
};

export default SchemaQueryResults;
