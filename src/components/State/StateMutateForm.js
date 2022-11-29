import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';

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
    */
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
                    dparentstate={state.stateOf.pbotID}
                >{state.name}</MenuItem>
            ))}
        </Field>
        <br />
        </>
    )
        
}

const StateMutateForm = ({handleSubmit, setShowResult, mode}) => {
    const initValues = {
                state: '',
                name: '',
                definition: '',
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
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleSubmit(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                definition: Yup.string().required(),
                schema: Yup.string().required(),
                character: Yup.string().required(),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleSubmit(values);
                setShowResult(true);
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
                    <CharacterSelect values={props.values} handleChange={props.handleChange} />
                }

                {(props.values.character !== "" && (mode === "edit" || mode === "delete")) &&
                    <StateSelect values={props.values} handleChange={props.handleChange}/>
                }
                 
                {((mode === "create" && props.values.character) || (mode === "edit" && props.values.state)) &&
                    <StateSelect values={props.values} parent handleChange={props.handleChange}/>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.state !== '')) &&
                    <>
                        <Field
                            component={TextField}
                            type="text"
                            name="name"
                            label="Name"
                            fullWidth 
                            disabled={false}
                        />
                        <br />

                        <Field
                            component={TextField}
                            type="text"
                            name="definition"
                            label="Definition"
                            fullWidth 
                            disabled={false}
                        />
                        <br />
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
