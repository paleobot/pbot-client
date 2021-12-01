import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";

function Persons(props) {
    console.log(props);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const gQL = gql`
            query ($pbotID: ID, $given: String, $surname: String, $email: String, $orcid: String) {
                Person (pbotID: $pbotID, given: $given, surname: $surname, email: $email, orcid: $orcid) {
                    pbotID
                    given
                    surname
                    email
                    orcid
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
           
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Person.map((person) => (
        <div key={person.pbotID} style={style}>
            {person.pbotID}, {person.given} {person.surname}, {person.email}, {person.orcid} <br />
            <br />
        </div>
    ));

}

const PersonQueryResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let persons = queryEntity === "Person" ? (
                    <Persons 
                        filters={{
                            pbotID: queryParams.personID || null,
                            given: queryParams.given || null, 
                            surname: queryParams.surname || null, 
                            email: queryParams.email || null, 
                            orcid: queryParams.orcid || null, 
                        }}
                    />
                ) : 
                '';
    
    return (
        <div>
            {persons}
        </div>
    );
};

export default PersonQueryResults;
