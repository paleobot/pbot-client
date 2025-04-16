import React from 'react';
import { alphabetize, AlternatingTableRow } from '../../util.js';
import { List, ListItem, ListItemButton, ListItemText, Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';

function Persons(props) {
    console.log(props);
    
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
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
    ) : 
    (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="persons table">
                <TableBody>
                    {people.map((person) => (
                        <AlternatingTableRow key={person.pbotID}>
                            <TableCell align="left">
                                <b>{person.given} {person.middle ? `${person.middle} ` : ''}{person.surname}</b>
                                <div style={indent}><b>pbotID:</b> {person.pbotID}</div>
                                <div style={indent}><b>email:</b> {person.email}</div> 
                                <div style={indent}><b>orcid:</b> {person.orcid} </div>
                            </TableCell>
                            <TableCell align="left">
                                <div><b>registered:</b> {person.registered ? "yes" : "no"} </div>
                            </TableCell>
                            <TableCell align="left">
                                <div><b>bio:</b> {person.bio} </div>
                            </TableCell>
                        </AlternatingTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
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
