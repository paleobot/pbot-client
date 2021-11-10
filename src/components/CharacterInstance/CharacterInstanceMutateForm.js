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


const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    console.log(props.schema);
    const descriptionGQL = gql`
            query {
                Description {
                    descriptionID
                    name
                  	schema {
                      schemaID
                      title
                    }
                  	specimen {
                      Specimen {
                        name
                        specimenID
                      }
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: descriptionLoading, error: descriptionError, data: descriptionData } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

    if (descriptionLoading) return <p>Loading...</p>;
    if (descriptionError) return <p>Error :(</p>;
                                 
    console.log(descriptionData);
    let descriptions = [...descriptionData.Description];
    
    //TODO: This was necessary because we initially did not have name fields in specimen Descriptions.
    //I require that now, but there are still some that do not have this.
    descriptions = descriptions.reduce((acc, description) => {
        const newDesc = {...description};
        console.log(newDesc);

        newDesc.descriptionID = newDesc.descriptionID + "," + description.schema.schemaID;
        if (newDesc.name) {
            acc.push(newDesc);
        } else {
            if (description.specimen) {
                console.log(description.specimen.Specimen.name);
                newDesc.name = description.specimen.Specimen.name;
                acc.push(newDesc);
            } 
        }
        return acc;
    }, []);
    
    console.log(descriptions);
    descriptions = alphabetize(descriptions, "name");
    console.log(descriptions);
    
    const style = {minWidth: "12ch"}
    return (
        <Field 
            style={style}
            component={TextField}
            type="text"
            name="description"
            label="Description"
            fullWidth
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            defaultValue=""
        >
            {descriptions.map(({ descriptionID, name }) => (
                <MenuItem key={descriptionID} value={descriptionID}>{name}</MenuItem>
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
    console.log(props.character);
    const stateGQL = gql`
        query {
            GetAllStates (characterID: "${props.character}")  {
                stateID
                name
            }
        }
    `;

    const { loading: stateLoading, error: stateError, data: stateData } = useQuery(stateGQL, {fetchPolicy: "cache-and-network"});

    if (stateLoading) return <p>Loading...</p>;
    if (stateError) return <p>Error :(</p>;
                                 
    //console.log(stateData.Schema[0].characters);
    const states = alphabetize([...stateData.GetAllStates], "name");
    
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
                <MenuItem key={stateID} value={name + "," + stateID}>{name}</MenuItem>
            ))}
        </Field>
    )
        
}

const CharacterInstanceMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    
    return (
       
        <Formik
            initialValues={{
                description: '',
                character: '',
                state: '', 
                quantity: '',
            }}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                description: Yup.string().required(),
                character: Yup.string().required(),
                state: Yup.string().required(),
                quantity: Yup.string().when("state", {
                    is: (val) => val && val.split(",")[0] === "quantity",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                //console.log(">>>>>>>>>>>>>>>>>submitting<<<<<<<<<<<<<<<<<<<<<<<");
                handleQueryParamChange(values);
                setShowResult(true);
                resetForm();
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
                <DescriptionSelect />
                
                {props.values.description !== '' &&
                    <div>
                        <CharacterSelect schema={props.values.description.split(",")[1]} />
                        <br />
                    </div>
                }
                
                {props.values.character !== "" &&
                    <div>
                        <StateSelect character={props.values.character} />
                        <br />
                    </div>
                }
                
                {props.values.state && props.values.state.split(",")[0] === "quantity" &&
                    <div>
                        <Field
                            component={TextField}
                            type="text"
                            name="quantity"
                            label="Quantity"
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

export default CharacterInstanceMutateForm;