import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { alphabetize } from '../../util.js';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';

function Persons(props) {
    console.log(props);
    
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const gQL = gql`
            query ($pbotID: ID, $given: String, $surname: String, $email: String, $orcid: String, $groups: [ID!], $excludeList: [ID!]) {
                Person (pbotID: $pbotID, email: $email, orcid: $orcid, filter:{AND: [
                    {surname_regexp: $surname},
                    {given_regexp: $given},
                    {memberOf_some: {pbotID_in: $groups}}, 
                    {pbotID_not_in: $excludeList}
                ]}) {
                    pbotID
                    given
                    middle
                    surname
                    email
                    orcid
                    bio
                    registered
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
                        primary={`${person.given} ${person.middle ? `${person.middle} ` : ''}${person.surname}`} secondary={`pbot id: ${person.pbotID}`} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        )
    }
    return (people.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : people.map((person) => (
        <div key={person.pbotID} style={style}>
            <b>{person.given} {person.middle ? `${person.middle} ` : ''}{person.surname}</b>
            <div style={indent}><b>pbotID:</b> {person.pbotID}</div>
            <div style={indent}><b>email:</b> {person.email}</div> 
            <div style={indent}><b>orcid:</b> {person.orcid} </div>
            <div style={indent}><b>bio:</b> {person.bio} </div>
            <div style={indent}><b>registered:</b> {person.registered ? "yes" : "no"} </div>
            <br />
        </div>
    ));

}

const PersonQueryResults = ({queryParams, select, handleSelect, exclude}) => {
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <Persons 
            filters={{
                pbotID: queryParams.personID || null,
                given: queryParams.given ? `(?i).*${queryParams.given.replace(/\s+/, '.*')}.*` : null, 
                surname: queryParams.surname ? `(?i).*${queryParams.surname.replace(/\s+/, '.*')}.*` : null, 
                email: queryParams.email || null, 
                orcid: queryParams.orcid || null, 
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            select={select}
            handleSelect={handleSelect}
            exclude={exclude}
        />
    );
};

export default PersonQueryResults;
