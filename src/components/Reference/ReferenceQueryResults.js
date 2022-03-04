import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { alphabetize } from '../../util.js';

function References(props) {
    console.log(props);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const gQL = gql`
            query ($pbotID: ID, $title: String, $year: String, $publisher: String) {
                Reference (pbotID: $pbotID, title: $title, year: $year, publisher: $publisher) {
                    pbotID
                    title
                    year
                    publisher
                }
            }
        `;
        
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const references = alphabetize([...data.Reference], "title");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    return references.map(({ pbotID, title, year, publisher }) => (
        <div key={pbotID} style={style}>
            <b>{title}</b>
            <div style={indent}><b>pbotID:</b> {pbotID}</div>
            <div style={indent}><b>publisher:</b> {publisher}</div> 
            <div style={indent}><b>year:</b> {year} </div>
            <br />
        </div>
    ));

}

const ReferenceQueryResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let references = queryEntity === "Reference" ? (
                    <References 
                        filters={{
                            pbotID: queryParams.referenceID || null,
                            title: queryParams.title || null, 
                            year: queryParams.year || null, 
                            publisher: queryParams.publisher || null, 
                        }}
                    />
                ) : 
                '';
    
    return (
        <div>
            {references}
        </div>
    );
};

export default ReferenceQueryResults;
