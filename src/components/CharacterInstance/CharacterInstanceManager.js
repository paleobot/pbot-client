import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField } from 'formik-mui';
//import {CharacterInstanceMutateForm} from './CharacterInstanceMutateForm.js';
import {CharacterSelect} from "../Character/CharacterSelect.js";
import { StateSelect } from "../State/StateSelect.js"
import { alphabetize } from '../../util.js';

import {
    useQuery,
    gql
  } from "@apollo/client";
  

const CharacterInstanceMutateForm = (props) => {
    console.log("CharacterInstanceMutateForm")
    console.log(props);

    return (
        <>
            <CharacterSelect name={`${props.name}.character`} values={props.values} source="characterInstance"/>   
            <br />     

            {props.values.character !== "" &&
            <>
            <StateSelect name={`${props.name}.state`} values={props.values} source="characterInstance"/>
            <br />
            </>
            }

            {props.values.state && (props.values.state.split(",")[0] === "quantity" || props.values.state.split(",")[0] === "quantitative") &&
            <>
            <Field
                component={TextField}
                type="text"
                name={`${props.name}.quantity`} 
                label="Quantity"
                fullWidth 
                disabled={false}
            />
            <br />
            </>
            }

            <Field
                component={TextField}
                type="text"
                name={`${props.name}.order`} 
                label="Order"
                fullWidth 
                disabled={false}
            />
            <br />
        </>
    
    );
};


export const CharacterInstanceManager = (props) => {

    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            Character instances
        </InputLabel>
        <FieldArray name="characterInstances">
            {({ insert, remove, push }) => (
            <div>
                {props.values.characterInstances.length > 0 &&
                    props.values.characterInstances.map((characterInstance, index) => { 
                        console.log("characterInstances.map " + index);
                        console.log(characterInstance);
                        const ciStyle = {marginLeft: "2em"}
                        return (
                            <Grid style={ciStyle} container item spacing={2} direction="row" key={index}>
                                <Grid item >
                                    <CharacterInstanceMutateForm name={`characterInstances.${index}`} values={{...characterInstance, schema: props.values.schema}} />
                                </Grid>
                                <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-start" }}>
                                    <Button
                                        type="button"
                                        variant="text" 
                                        color="secondary" 
                                        size="large"
                                        onClick={() => remove(index)}
                                        sx={{width:"50px"}}
                                    >
                                        X
                                    </Button>
                                </Grid>
                            </Grid>
                        )
                    })
                }
               <Button
                    type="button"
                    variant="text" 
                    color="secondary" 
                    onClick={() => push({
                        character: '',
                        state: '',
                        quantity: '',
                        order:'',                    
                    })}
                    disabled={
                        props.values.characterInstances.length !== 0 && 
                        //props.values.characterInstances[props.values.characterInstances.length-1].character === '' &&
                        props.values.characterInstances[props.values.characterInstances.length-1].state === ''
                    }
                >
                    Add character instance
                </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};

