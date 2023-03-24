import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize, sort } from '../../util.js';
import {CharacterSelect} from "../Character/CharacterSelect.js";
import { StateSelect } from "../State/StateSelect.js"

import {
  useQuery,
  gql
} from "@apollo/client";


const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    const descriptionGQL = gql`
            query {
                Description {
                    pbotID
                    name
                  	schema {
                      pbotID
                      title
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: descriptionLoading, error: descriptionError, data: descriptionData } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

    if (descriptionLoading) return <p>Loading...</p>;
    if (descriptionError) return <p>Error :(</p>;
                                 
    const descriptions = alphabetize([...descriptionData.Description], "name");
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
            onChange={(event,child) => {
                //props.resetForm();
                console.log("Description selected");
                console.log(child.props.dschemaid);
                props.values.schema = child.props.dschemaid || '';
                props.values.character = '';
                props.values.state = '';
                props.handleChange(event);
            }}
        >
            {descriptions.map((description) => (
                <MenuItem 
                    key={description.pbotID} 
                    value={description.pbotID} 
                    dschemaid={description.schema.pbotID}
                >{description.name}</MenuItem>
            ))}
        </Field>
    )
        
}

const CharacterInstanceSelect = (props) => {
    console.log("CharacterInstanceSelect");
    console.log(props);
    const gQL = gql`
            query {
                Description (pbotID: "${props.values.description}") {
                    characterInstances {
                        pbotID
                        character {
                            pbotID
                            name
                        }
                        state {
                            value
                            order
                            State {
                                pbotID
                                name
                            }
                        }
                    }
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Description);
    
    const characterInstances = alphabetize(data.Description[0].characterInstances.map((cI) => {
        const newCI = {...cI};
        console.log(newCI);
        
        newCI.name = newCI.name || newCI.character.name + "-" + newCI.state.State.name;

        return newCI;
    }), "name");
    console.log(characterInstances)

    const style = {minWidth: "18ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="characterInstance"
            label="Character Instance"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.character = child.props.dcharacterid || '';
                props.values.state = child.props.dstateid || '';
                props.values.quantity = child.props.dquantity || '';
                props.values.order = child.props.dorder || '';
                props.handleChange(event);
            }}
        >
            {characterInstances.map((cI) => (
                <MenuItem 
                    key={cI.pbotID} 
                    value={cI.pbotID}
                    dcharacterid={cI.character.pbotID}
                    dstateid={cI.state.State.name + "," + cI.state.State.pbotID}
                    dquantity={cI.state.value}
                    dorder={cI.state.order}
                >{cI.name}</MenuItem>
            ))}
        </Field>
    )
        
}

/*
const CharacterSelect = (props) => {
    console.log("CharacterSelect");
    console.log(props);
    //TODO: Should the following be using GetAllCharacters?
    const characterGQL = gql`
            query {
                Schema (pbotID: "${props.values.schema}") {
                    characters { 
                        pbotID
                        name
                        order
                    }
                }            
            }
        `;

    const { loading: characterLoading, error: characterError, data: characterData } = useQuery(characterGQL, {fetchPolicy: "cache-and-network"});

    if (characterLoading) return <p>Loading...</p>;
    if (characterError) return <p>Error :(</p>;
                                 
    console.log(characterData.Schema[0].characters);
    //const characters = alphabetize([...characterData.Schema[0].characters], "name");
    const characters = sort([...characterData.Schema[0].characters], "order", "name");
   
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
*/

/*
const StateSelect = (props) => {
    console.log("StateSelect");
    console.log(props);
    const stateGQL = gql`
        query {
            GetAllStates (characterID: "${props.values.character}")  {
                pbotID
                name
                order
            }
        }
    `;

    const { loading: stateLoading, error: stateError, data: stateData } = useQuery(stateGQL, {fetchPolicy: "cache-and-network"});

    if (stateLoading) return <p>Loading...</p>;
    if (stateError) return <p>Error :(</p>;
                                 
    //console.log(stateData.Schema[0].characters);
    //const states = alphabetize([...stateData.GetAllStates], "name");
    const states = sort([...stateData.GetAllStates], "order", "name");
    
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
            {states.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={name + "," + pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
        
}
*/

const CharacterInstanceMutateForm = ({handleSubmit, mode, description, schema}) => {
    console.log("CharacterInstanceMutateForm");
    console.log(description)
    console.log(schema)
    const initValues = {
                characterInstance: '',
                description: description || '',
                schema: schema || '',
                character: '',
                state: '', 
                quantity: '',
                order: '',
                mode: mode,
    };
    console.log(initValues)
            
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
            validationSchema={Yup.object({
                description: Yup.string().required(),
                character: Yup.string().required(),
                state: Yup.string().required(),
                quantity: Yup.string().when("state", {
                    is: (val) => val && val.split(",")[0] === "quantity",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                order: Yup.number().integer().typeError("Must be an integer"),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                //console.log(">>>>>>>>>>>>>>>>>submitting<<<<<<<<<<<<<<<<<<<<<<<");
                values.mode = mode;
                handleSubmit(values);
                resetForm({values: initValues});
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
                <Field
                    component={TextField}
                    sx={{display:"none"}}
                    name="schema"
                    disabled={false}
                />

                <Field 
                    component={TextField}
                    name="mode" 
                    sx={{display:"none"}}
                    disabled={false}
                />
                
                {!description && 
                <DescriptionSelect values={props.values} handleChange={props.handleChange}/>
                }
                
                {(mode === "edit" || mode === "delete") && props.values.description !== '' &&
                    <div>
                        <CharacterInstanceSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }

                {((mode === "create" && props.values.description !== '') || (mode === "edit" && props.values.characterInstance !== '')) &&
                    <div>
                        <CharacterSelect values={props.values} source="characterInstance"/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || mode === "edit") && props.values.character !== "" &&
                    <div>
                        <StateSelect values={props.values} source="characterInstance"/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || mode === "edit") && props.values.state && (props.values.state.split(",")[0] === "quantity" || props.values.state.split(",")[0] === "quantitative") &&
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

                {(mode === "create" || mode === "edit") && props.values.state &&
                    <div>
                        <Field
                            component={TextField}
                            type="text"
                            name="order"
                            label="Order"
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
