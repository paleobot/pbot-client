import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { alphabetize } from '../../util.js';
import {publicGroupID} from '../Group/GroupSelect.js';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

function Persons(props) {
    console.log(props);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const gQL = gql`
            query ($pbotID: ID, $given: String, $surname: String, $email: String, $orcid: String, $groups: [ID!], $excludeList: [ID!]) {
                Person (pbotID: $pbotID, given: $given, surname: $surname, email: $email, orcid: $orcid, filter:{AND: [{memberOf_some: {pbotID_in: $groups}}, {pbotID_not_in: $excludeList}]}) {
                    pbotID
                    given
                    surname
                    email
                    orcid
                }
            }
        `;

    //For AuthorManager applications, omit persons that are already in the list
    const excludeIDs = props.exclude ? props.exclude.map(person => person.pbotID) : [];

    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters,
            excludeList: excludeIDs
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const people = alphabetize([...data.Person], "surname");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    if (props.select) {
        return (
            <List sx={{ pt: 0 }}>
            {people.map((person) => (
                <ListItem disableGutters key={person.pbotID}>
                    <ListItemButton onClick={() => props.handleSelect(person)} >
                        <ListItemText 
                        primary={person.given + " " + person.surname} secondary={`pbot id: ${person.pbotID}`} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        )
    }
    return (people.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : people.map((person) => (
        <div key={person.pbotID} style={style}>
            <b>{person.given} {person.surname}</b>
            <div style={indent}><b>pbotID:</b> {person.pbotID}</div>
            <div style={indent}><b>email:</b> {person.email}</div> 
            <div style={indent}><b>orcid:</b> {person.orcid} </div>
            <br />
        </div>
    ));

}

const PersonQueryResults = ({queryParams, select, handleSelect, exclude}) => {
    console.log(queryParams);

    return (
        <Persons 
            filters={{
                pbotID: queryParams.personID || null,
                given: queryParams.given || null, 
                surname: queryParams.surname || null, 
                email: queryParams.email || null, 
                orcid: queryParams.orcid || null, 
                groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
            }}
            select={select}
            handleSelect={handleSelect}
            exclude={exclude}
        />
    );
};

export default PersonQueryResults;
