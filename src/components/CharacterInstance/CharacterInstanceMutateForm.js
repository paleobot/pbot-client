import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';

import {
  useQuery,
  gql
} from "@apollo/client";

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
    const characters = [...characterData.Schema[0].characters];
    characters.sort((a,b) => {
        const nameA = a.name ? a.name.toUpperCase() : "z"; //"z" forces null names to end of list
        const nameB = b.name ? b.name.toUpperCase() : "z"; 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    
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
    console.log(props.character);
    const stateGQL = gql`
        query {
            GetLeafStates (data: {characterID: "${props.character}"})  {
                stateID
                name
            }
        }
    `;

    const { loading: stateLoading, error: stateError, data: stateData } = useQuery(stateGQL, {fetchPolicy: "cache-and-network"});

    if (stateLoading) return <p>Loading...</p>;
    if (stateError) return <p>Error :(</p>;
                                 
    //console.log(stateData.Schema[0].characters);
    const states = [...stateData.GetLeafStates];
    states.sort((a,b) => {
        const nameA = a.name ? a.name.toUpperCase() : "z"; //"z" forces null names to end of list
        const nameB = b.name ? b.name.toUpperCase() : "z"; 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    
    return (
        <Field
            component={TextField}
            type="text"
            name="state"
            label="State"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {states.map(({ stateID, name }) => (
                <MenuItem key={stateID} value={stateID}>{name}</MenuItem>
            ))}
        </Field>
    )
        
}

const CharacterInstanceMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
    
    const schemaGQL = gql`
            query {
                Schema {
                    schemaID
                    title
                }            
            }
        `;

    const { loading: schemaLoading, error: schemaError, data: schemaData } = useQuery(schemaGQL, {fetchPolicy: "cache-and-network"});

    if (schemaLoading) return <p>Loading...</p>;
    if (schemaError) return <p>Error :(</p>;
                                 
    console.log(schemaData.Schema);
    
    const schemas = schemaData.Schema;
    console.log(schemas);
    
    //const characters = [{characterID: "1", name:"Character 1"}, {characterID: "2", name: "Character 2"}];
    const states = [{stateID: "1", name:"State 1"}, {stateID: "2", name: "State 2"}];
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                schema: '',
                character: '',
                state: '', 
            }}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                schema: Yup.string().required(),
                character: Yup.string().required(),
                state: Yup.string().required(),
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
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
                <br />
                
                {props.values.schema !== "" &&
                    <div>
                        <CharacterSelect schema={props.values.schema} />
                        <br />
                    </div>
                }
                {props.values.character !== "" &&
                    <div>
                        <StateSelect character={props.values.character} />
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

export default CharacterInstanceMutateForm;
