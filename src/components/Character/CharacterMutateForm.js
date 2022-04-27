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

const CharacterSelect = (props) => {
    console.log("CharacterSelect");
    console.log(props);
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    /*
    const gQL = gql`
        query ($schemaID: ID) {
            Schema (pbotID: $schemaID) {
                characters {    
                    pbotID
                    name
                    definition
                }
            }            
        }
    `;
    */
    const gQL = gql`
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

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {schemaID: props.values.schema}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Results<<<<<<<<<<<<<");
    console.log(data.GetAllCharacters);
    const characters = alphabetize([...data.GetAllCharacters], "name");
    console.log(characters);
    
    const label = props.parent ? "Parent character" : "Character";
    const name =  props.parent ? "parentCharacter" : "character";
    
    const style = {minWidth: "12ch"}
    return characters.length === 0 ? null : (
        <Field
            style={style}
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
                //props.resetForm();
                props.values.name = event.currentTarget.dataset.name || '';
                props.values.definition = event.currentTarget.dataset.definition || '';
                props.values.parentCharacter = event.currentTarget.dataset.parentcharacter || '';
                props.handleChange(event);
            }}
        >
            {characters.map((character) => (
                <MenuItem 
                    key={character.pbotID} 
                    value={character.pbotID}
                    data-name={character.name}
                    data-definition={character.definition}
                    data-parentcharacter={character.characterOf.pbotID}
                >{character.name}</MenuItem>
            ))}
        </Field>
    )
}

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
            onChange={event => {
                //props.resetForm();
                props.values.character =  '';
                props.handleChange(event);
            }}
        >
            {schemas.map(({ pbotID, title }) => (
                <MenuItem key={pbotID} value={pbotID}>{title}</MenuItem>
            ))}
        </Field>
    )
}

const CharacterMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                character: '',
                name: '',
                definition: '',
                schema: '',
                parentCharacter: '',
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
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                schema: Yup.string().required(),
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
                
                <SchemaSelect values={props.values} handleChange={props.handleChange}/>
                
                {(mode === "edit" || mode === "delete") && props.values.schema !== '' &&
                    <CharacterSelect values={props.values} handleChange={props.handleChange}/>
                }
                
                {((mode === "create" && props.values.schema) || (mode === "edit" && props.values.character)) &&
                    <CharacterSelect values={props.values} parent handleChange={props.handleChange}/>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.character !== '')) &&
                    <div>
                    <Field
                        component={TextField}
                        type="text"
                        name="name"
                        label="Name"
                        fullWidth 
                        disabled={false}
                    />

                    <Field
                        component={TextField}
                        type="text"
                        name="definition"
                        label="Definition"
                        fullWidth 
                        disabled={false}
                    />
                    </div>
                }
                
                {(mode === "delete") &&
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        type="checkbox" 
                        Label={{ label: 'Cascade' }}
                    />
                }

                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default CharacterMutateForm;
