import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import { StateSelect } from "../State/StateSelect.js"
import { CharacterSelect } from "../Character/CharacterSelect.js"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";

const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    const gQL = gql`
            query {
                Schema {
                    pbotID
                    title
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Reference);
    
    const schemas = alphabetize([...data.Schema], "title");
    console.log(schemas)
    
    return (
        <>
        <Field
            component={TextField}
            type="text"
            name="schema"
            label="Schema"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={event => {
                console.log("State onChange");
                console.log(props);
                console.log(props.parent);
                if (!props.parent) {
                    props.values.character = '';
                    props.values.parentState = '';
                }
                props.handleChange(event);
            }}
        >
            {schemas.map(({ pbotID, title }) => (
                <MenuItem key={pbotID} value={pbotID}>{title}</MenuItem>
            ))}
        </Field>
        <br />
        </>

    )
}

/*
const CharacterSelect = (props) => {
    console.log("CharacterSelect");
    console.log(props);
    console.log(props.schema);
    /*
    const characterGQL = gql`
            query {
                Schema (pbotID: "${props.schema}") {
                    characters {
                        pbotID
                        name
                    }
                }            
            }
        `;
    *
    const characterGQL = gql`
        query ($schemaID: String!) {
            GetAllCharacters (schemaID: $schemaID)  {
                pbotID
                name
                definition
                characterOf {
                  ... on Character {
                    pbotID
                  }
                  ... on Schema {
                    pbotID
                  }
                }
            }
        }
    `;

    const { loading: characterLoading, error: characterError, data: characterData } = useQuery(characterGQL, {fetchPolicy: "cache-and-network", variables: {schemaID: props.values.schema}});

    if (characterLoading) return <p>Loading...</p>;
    if (characterError) return <p>Error :(</p>;
                                 
    //console.log(characterData.Schema[0].characters);
    const characters = alphabetize([...characterData.GetAllCharacters], "name");
    
    return (
        <>
        <Field
            component={TextField}
            type="text"
            name="character"
            label="Character"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={event => {
                console.log("State onChange");
                console.log(props);
                console.log(props.parent);
                if (!props.parent) {
                    props.values.parentState = '';
                }
                props.handleChange(event);
            }}
        >
            {characters.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
        <br />
        </>
    )
        
}
*/

/*
const StateSelect = (props) => {
    console.log("StateSelect");
    console.log(props);
    console.log(props.values.character);
    
    const stateGQL = gql`
        query ($characterID: String!) {
            GetAllStates (characterID: $characterID)  {
                pbotID
                name
                definition
                order
                stateOf {
                  ... on Character {
                    pbotID
                  }
                  ... on State {
                    pbotID
                  }
                }
            }
        }
    `;
    const { loading: stateLoading, error: stateError, data: stateData } = useQuery(stateGQL, {fetchPolicy: "cache-and-network", variables: {characterID: props.values.character}});

    if (stateLoading) return <p>Loading...</p>;
    if (stateError) return <p>Error :(</p>;
                                 
    //console.log(stateData.Schema[0].characters);
    const states = alphabetize([...stateData.GetAllStates], "name");
    
    const label = props.parent ? "Parent state" : "State";
    const name =  props.parent ? "parentState" : "state";
    
    return states.length === 0 ? null : (
        <>
        <Field
            component={TextField}
            type="text"
            name={name}
            label={label}
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                console.log("State onChange");
                console.log(props);
                console.log(props.parent);
                if (!props.parent) {
                    props.values.name = child.props.dname || '';
                    props.values.definition = child.props.ddefinition || '';
                    props.values.order = child.props.dorder || '';
                    props.values.parentState = child.props.dparentstate || '';
                }
                props.handleChange(event);
            }}
        >
            {states.map((state) => (
                <MenuItem 
                    key={state.pbotID} 
                    value={state.pbotID}
                    dname={state.name}
                    ddefinition={state.definition}
                    dorder={state.order}
                    dparentstate={state.stateOf.pbotID}
                >{state.name}</MenuItem>
            ))}
        </Field>
        <br />
        </>
    )
        
}
*/

const StateMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                state: '',
                quantitative: false,
                name: '',
                definition: '',
                order: '',
                schema: '',
                character: '',
                parentState: '',
                cascade: false,
                mode: mode,
    };

    //To clear form when mode changes (this and the innerRef below). formikRef points to the Formik DOM element, 
    //allowing useEffect to call resetForm
    const formikRef = React.useRef();
    React.useEffect(() => {
        if (formikRef.current) {
            formikRef.current.resetForm({values:initValues});
        }
    });
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                definition: Yup.string(),
                order: Yup.number().integer(),
                schema: Yup.string().required(),
                character: Yup.string().required(),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>
            
                <Field 
                    component={TextField}
                    name="mode" 
                    sx={{display:"none"}}
                    disabled={false}
                />
                
                <SchemaSelect values={props.values} handleChange={props.handleChange}/>
                
                {props.values.schema !== '' &&
                    <>
                    <CharacterSelect source="state" values={props.values} handleChange={props.handleChange} />
                    <br />
                    </>
                }

                {(props.values.character !== "" && (mode === "edit" || mode === "delete")) &&
                    <>
                    <StateSelect source="state" values={props.values} handleChange={props.handleChange}/>
                    <br />
                    </>
                }
                 
                {((mode === "create" && props.values.character) || (mode === "edit" && props.values.state)) &&
                    <>
                    <StateSelect source="state" values={props.values} parent handleChange={props.handleChange}/>
                    <br />
                    </>
                }
                
                {((mode === "create" && props.values.character) || (mode === "edit" && props.values.state !== '')) &&
                    <>
                    <Accordion style={accstyle} defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="required-content"
                            id="required-header"                        
                        >
                            Required fields
                        </AccordionSummary>
                        <AccordionDetails>
                
                            <Field
                                type="checkbox"
                                component={CheckboxWithLabel}
                                name="quantitative"
                                Label={{ label: 'Quantitative' }}
                                onChange={event => {
                                    if (props.values.quantitative) {
                                        props.values.name=""
                                    } else {
                                        props.values.name="quantity"
                                    }
                                    props.handleChange(event);
                                }}
                            />
                            <br />

                            <Field
                                component={TextField}
                                type="text"
                                name="name"
                                label="Name"
                                fullWidth 
                                disabled={props.values.quantitative}
                            />
                            <br />


                        </AccordionDetails>
                    </Accordion>

                    <Accordion style={accstyle}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="optional-content"
                            id="optional-header"                        
                        >
                            Optional fields
                        </AccordionSummary>
                        <AccordionDetails>
                            <Field
                                component={TextField}
                                type="text"
                                name="definition"
                                label="Definition"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={TextField}
                                type="text"
                                name="order"
                                label="Order"
                                fullWidth 
                                disabled={false}
                            />
                            <br />
                     
                        </AccordionDetails>
                    </Accordion>
                    </>
                }
                
                {(mode === "delete") &&
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        Label={{ label: 'Cascade' }}
                    />
                }
                
                <br />
                <br />
                
                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default StateMutateForm;
