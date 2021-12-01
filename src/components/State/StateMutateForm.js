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
            {schemas.map(({ pbotID, title }) => (
                <MenuItem key={pbotID} value={pbotID}>{title}</MenuItem>
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
                Schema (pbotID: "${props.schema}") {
                    characters {
                        pbotID
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
            {characters.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
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
    /*
     * Should be able to do this, in theory. But graphql forces you to use fragments as above. I don't know why.
    const stateGQL = gql`
        query {
            GetAllStates (characterID: "${props.values.character}")  {
                pbotID
                name
                definition
                stateOf {
                    pbotID
                }
            }
        }
    `;
    */
    const { loading: stateLoading, error: stateError, data: stateData } = useQuery(stateGQL, {fetchPolicy: "cache-and-network"});

    if (stateLoading) return <p>Loading...</p>;
    if (stateError) return <p>Error :(</p>;
                                 
    //console.log(stateData.Schema[0].characters);
    const states = alphabetize([...stateData.GetAllStates], "name");
    
    const label = props.parent ? "Parent state" : "State";
    const name =  props.parent ? "parentState" : "state";
    
    return (
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
            onChange={event => {
                console.log("State onChange");
                console.log(props);
                console.log(props.parent);
                if (!props.parent) {
                    props.values.name = event.currentTarget.dataset.name || '';
                    props.values.definition = event.currentTarget.dataset.definition || '';
                    props.values.parentState = event.currentTarget.dataset.parentstate || '';
                }
                props.handleChange(event);
            }}
        >
            {states.map((state) => (
                <MenuItem 
                    key={state.pbotID} 
                    value={state.pbotID}
                    data-name={state.name}
                    data-definition={state.definition}
                    data-parentstate={state.stateOf.pbotID}
                >{state.name}</MenuItem>
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
                parentState: '',
                mode: mode,
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
                values.mode = mode;
                handleQueryParamChange(values);
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
                    type="hidden" 
                    disabled={false}
                />
                
                <SchemaSelect />
                <br />
                
                {props.values.schema !== '' &&
                    <div>
                        <CharacterSelect schema={props.values.schema} />
                        <br />
                    </div>
                }

                {(props.values.character !== "" && (mode === "edit" || mode === "delete")) &&
                    <div>
                        <StateSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {((mode === "create" && props.values.character) || (mode === "edit" && props.values.state)) &&
                    <div>
                        <StateSelect values={props.values} parent handleChange={props.handleChange}/>
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
