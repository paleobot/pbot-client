import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';
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
                    schemaID
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
        >
            {schemas.map(({ schemaID, title }) => (
                <MenuItem key={schemaID} value={schemaID}>{title}</MenuItem>
            ))}
        </Field>
    )
}

const CharacterSelect = (props) => {
    console.log("CharacterSelect");
    console.log(props);
    console.log(props.schema);
    const characterGQL = gql`
            query {
                Schema (schemaID: "${props.schema}") {
                    characters {
                        characterID
                        name
                    }
                }            
            }
        `;

    const { loading: characterLoading, error: characterError, data: characterData } = useQuery(characterGQL, {fetchPolicy: "cache-and-network"});

    if (characterLoading) return <p>Loading...</p>;
    if (characterError) return <p>Error :(</p>;
                                 
    console.log(characterData.Schema[0].characters);
    const characters = alphabetize([...characterData.Schema[0].characters], "name");
    
    return (
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
        >
            {characters.map(({ characterID, name }) => (
                <MenuItem key={characterID} value={characterID}>{name}</MenuItem>
            ))}
        </Field>
    )
        
}

const StateSelect = (props) => {
    console.log("StateSelect");
    console.log(props);
    console.log(props.values.character);
    const stateGQL = gql`
        query {
            GetAllStates (characterID: "${props.values.character}")  {
                stateID
                name
                definition
            }
        }
    `;

    const { loading: stateLoading, error: stateError, data: stateData } = useQuery(stateGQL, {fetchPolicy: "cache-and-network"});

    if (stateLoading) return <p>Loading...</p>;
    if (stateError) return <p>Error :(</p>;
                                 
    //console.log(stateData.Schema[0].characters);
    const states = alphabetize([...stateData.GetAllStates], "name");
    
    const label = props.mode === "edit" ? "State" : "Parent state";
    
    return (
        <Field
            component={TextField}
            type="text"
            name="state"
            label={label}
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={event => {
                console.log("State onChange");
                console.log(props);
                console.log(props.mode);
                if (props.mode === "edit") {
                    props.values.name = event.currentTarget.dataset.name || '';
                    props.values.definition = event.currentTarget.dataset.definition || '';
                }
                props.handleChange(event);
            }}
        >
            {states.map(({ stateID, name, definition }) => (
                <MenuItem 
                    key={stateID} 
                    value={stateID}
                    data-name={name}
                    data-definition={definition}
                >{name}</MenuItem>
            ))}
        </Field>
    )
        
}

const StateMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                state: '',
                name: '',
                definition: '',
                schema: '',
                character: '',
                state: '',
    };
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={initValues}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
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
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>
                <SchemaSelect />
                <br />

                {props.values.schema !== '' &&
                    <div>
                        <CharacterSelect schema={props.values.schema} />
                        <br />
                    </div>
                }

                {props.values.character !== "" &&
                    <div>
                        <StateSelect values={props.values} mode={mode} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.state !== '')) &&
                <div>
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

                </div>
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
