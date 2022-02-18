import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import Characters from "../Character/Characters";
import { alphabetize } from '../../util.js';

function Schemas(props) {
    console.log(props);
    console.log(props.filters.genus);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    let gQL;
    if (!props.includeCharacters) {
        gQL = gql`
            query ($pbotID: ID, $title: String, $year: String) {
                Schema (pbotID: $pbotID, title: $title, year: $year) {
                    pbotID
                    title
                    year
                }            
            }
        `;
    } else {
        gQL = gql`
            query ($pbotID: ID, $title: String, $year: String) {
                Schema (pbotID: $pbotID, title: $title, year: $year) {
                    pbotID
                    title
                    year
                    characters {
                        pbotID
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
           
    const schemas = alphabetize([...data.Schema], "title");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    return schemas.map(({ pbotID, title, year, characters }) => (
        <div key={pbotID} style={style}>
            <b>{title}</b>
            <div style={indent}><b>pbotID:</b> {pbotID}</div>
            <div style={indent}><b>year:</b> {year} </div>
            {characters && characters.length > 0 &&
            <div>
                <div style={indent}><b>characters:</b></div>
                <Characters characters={characters} />
            </div>
            }
            <br />
        </div>
    ));

}

const SchemaQueryResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let schemas = queryEntity === "Schema" ? (
                    <Schemas 
                        filters={{
                            pbotID: queryParams.schemaID,
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
