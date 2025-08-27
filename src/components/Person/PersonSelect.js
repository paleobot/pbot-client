import React, { useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Stack, Tooltip } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";
import PersonQueryForm from './PersonQueryForm.js';
import SearchIcon from '@mui/icons-material/Search';
import PersonQueryResults from './PersonQueryResults.js';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';

export const InnerPersonSelect = (props) => {
    console.log("InnerPersonSelect");
    console.log(props);
    
    const gQL = "person" === props.name ? //This is a standalone PersonSelect for Person edit/delete
        gql`
            query {
                Person {
                    pbotID
                    given
                    middle
                    surname
                    email
                    orcid
                    memberOf {
                        pbotID
                    }
                }            
            }
        ` : //This is one of possibly several PersonSelects in AuthorManager
        gql`
            query  ($excludeList: [ID!]){
                Person (filter: {AND: [{given_not: "guest"}, {surname_not: "guest"}, {pbotID_not_in: $excludeList}]}) {
                    pbotID
                    given
                    middle
                    surname
                }            
            }
        `;

       //For AuthorManager applications, omit authors that are already in the list
        const excludeIDs = props.exclude ? props.exclude.map(person => person.pbotID) : [];

        const { loading: loading, error: error, data: data } = useQuery(gQL, {        
            variables: {
                excludeList: excludeIDs
            },
            fetchPolicy: "cache-and-network"
        });

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
                                    
        console.log(data.Person);
        
        //const persons = alphabetize([...data.Person], "surname");
        const persons = alphabetize(
            data.Person.map((person, x) => {
                return {
                    ...person,
                    index: x
                }
            }),  
            "surname"
        );
        console.log(persons)
        
        const style = {minWidth: "12ch"}
        return "person" === props.name ? //This is a standalone PersonSelect for Person edit/delete
            (
                <Field
                    style={style}
                    component={TextField}
                    type="text"
                    name="person"
                    label="Person"
                    fullWidth 
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    disabled={false}
                    onChange={(event,child) => {
                        props.handleSelect(JSON.parse(child.props.dperson))
                    }}
                >
                    {persons.map((person) => (
                        <MenuItem 
                            key={person.pbotID} 
                            value={person.pbotID}
                            dperson={JSON.stringify(person)}
                        >{person.given}{person.middle ? ` ${person.middle}` : ''} {person.surname}</MenuItem>
                    ))}
                </Field>
            )            
        : //This is one of possibly several PersonSelects in AuthorManager
            (
                <Field
                    component={TextField}
                    type="text"
                    name={props.name || "persons"}
                    label="Name"
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    disabled={props.disabled}
                    onChange={(e,c) => {
                        console.log("click")
                        props.handleSelect(JSON.parse(c.props.dperson))
                    }}
                >
                    {persons.map((person) => (
                        <MenuItem 
                            key={person.pbotID} 
                            value={person.pbotID}
                            dperson={JSON.stringify({...person, searchName: person.surname})}
                            dsearchname={person.surname}
                        >{person.given}{person.middle ? ` ${person.middle}` : ''} {person.surname}</MenuItem>
                    ))}
                </Field>
            )
}


const PersonDialog = (props) => {
    console.log("PersonDialog")

    const [showResult, setShowResult] = useState(false);
    const [queryParams, setQueryParams] = useState([]);

    const handleSubmit = (values) => {
        setQueryParams(values);
        setShowResult(true);
    }

    return (
        <Dialog fullWidth={true} open={props.open}>
        <DialogTitle>
            Search for Person             
        </DialogTitle>
        <DialogContent>
            {!showResult &&
            <PersonQueryForm handleSubmit={handleSubmit}/>
            }
            {showResult &&
            <PersonQueryResults queryParams={queryParams} exclude={props.exclude} select={true} handleSelect={props.handleSelect}/>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export const PersonSelect = (props) => {
    console.log("PersonSelect");
    console.log(props)

    const global = useContext(GlobalContext);

    const formikProps = useFormikContext()

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (person) => {
        console.log("handleSelect")
        console.log(person);
        console.log(formikProps)
        console.log(person.pbotID)

        formikProps.setFieldValue(props.name, person.pbotID);
        
        if ("person" === props.name) { //Standalone PersonSelect
            const groups = person.memberOf ? person.memberOf.map(group => {return group.pbotID}) : [];

            formikProps.setFieldValue("given", person.given || '');
            formikProps.setFieldValue("middle", person.middle || '');
            formikProps.setFieldValue("surname", person.surname || '');
            formikProps.setFieldValue("email", person.email || '');
            formikProps.setFieldValue("orcid", person.orcid || '');
            formikProps.setFieldValue("groups", groups || '');
            formikProps.setFieldValue("public", groups.includes(global.publicGroupID));
        } else {
            formikProps.setFieldValue(props.name.replace(/\.pbotID$/, ".order"), (props.maxOrder+1).toString() )
            const searchName = `${props.name.slice(0,-6)}searchName`;
            formikProps.setFieldValue(searchName, person.surname);
        }

        setOpen(false);
    };

    return (
        <Stack direction="row" key={props.name}>
            <InnerPersonSelect disabled={props.disabled} name={props.name} exclude={props.exclude} values={formikProps.values} handleSelect={handleSelect}/>
            <Tooltip title="Search using a query form"><span>
                <IconButton
                    color="secondary" 
                    size="large"
                    onClick={()=>{setOpen(true)}}
                    disabled={props.disabled}
                >
                    <SearchIcon/>
                </IconButton>
            </span></Tooltip>
            {open &&
                <PersonDialog open={open} handleClose={handleClose} handleSelect={handleSelect} exclude={props.exclude} />
            }
        </Stack>
    );
}