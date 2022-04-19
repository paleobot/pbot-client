import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { alphabetize } from '../../util.js';
import {publicGroupID} from '../Group/GroupSelect.js';

function References(props) {
    console.log(props);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const gQL = gql`
            query ($pbotID: ID, $title: String, $year: String, $publisher: String, $groups: [ID!]) {
                Reference (pbotID: $pbotID, title: $title, year: $year, publisher: $publisher, filter:{elementOf_some: {pbotID_in: $groups}}) {
                    pbotID
                    title
                    year
                    publisher
                    doi
                    authoredBy {
                        Person {
                            given
                            surname
                        }
                        order
                    }
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
    const indent2 = {marginLeft:"4em"}
    return (references.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : references.map((reference) => (
        <div key={reference.pbotID} style={style}>
            <b>{reference.title}</b>
            <div style={indent}><b>pbotID:</b> {reference.pbotID}</div>
            <div style={indent}><b>publisher:</b> {reference.publisher}</div> 
            <div style={indent}><b>year:</b> {reference.year} </div>
            <div style={indent}><b>doi:</b> {reference.doi || "not specified"} </div>
            <div style={indent}><b>authors:</b></div>
                {alphabetize([...reference.authoredBy], "order").map(author => (
                    <div style={indent2}>{author.Person.given} {author.Person.surname}</div>
                ))}
            
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
                            groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
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
