import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import Characters from "../Character/Characters";
import { alphabetize } from '../../util.js';
import {publicGroupID} from '../Group/GroupSelect.js';

function Schemas(props) {
    console.log(props);
    console.log(props.filters.genus);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    let gQL;
    if (!props.includeCharacters) {
        gQL = gql`
            query ($pbotID: ID, $title: String, $year: String, $groups: [ID!]) {
                Schema (pbotID: $pbotID, title: $title, year: $year, filter:{elementOf_some: {pbotID_in: $groups}}) {
                    pbotID
                    title
                    year
                    authoredBy {
                        given
                        surname
                    }
                }            
            }
        `;
    } else {
        gQL = gql`
            query ($pbotID: ID, $title: String, $year: String, $groups: [ID!]) {
                Schema (pbotID: $pbotID, title: $title, year: $year, filter:{elementOf_some: {pbotID_in: $groups}}) {
                    pbotID
                    title
                    year
                    authoredBy {
                        given
                        surname
                    }
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
    const indent2 = {marginLeft:"4em"}
    return (schemas.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : schemas.map((schema) => (
        <div key={schema.pbotID} style={style}>
            <b>{schema.title}</b>
            <div style={indent}><b>pbotID:</b> {schema.pbotID}</div>
            <div style={indent}><b>year:</b> {schema.year} </div>
            <div style={indent}><b>authors:</b></div>
                {alphabetize([...schema.authoredBy], "surname").map(author => (
                    <div style={indent2}>{author.given} {author.surname}</div>
                ))}
            {schema.characters && schema.characters.length > 0 &&
            <div>
                <div style={indent}><b>characters:</b></div>
                <Characters characters={schema.characters} />
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
                            groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
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
