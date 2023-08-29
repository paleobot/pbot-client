import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Grid, InputLabel } from '@mui/material';
import { TextField } from 'formik-mui';
import {SpecimenSelect} from '../Specimen/SpecimenSelect.js';
import ClearIcon from '@mui/icons-material/Clear';

export const SpecimenManager = (props) => {
    //console.log("SpecimenManager")

    const name = props.name ? props.name : "specimens";

    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            {props.label ? props.label : name.charAt(0).toUpperCase() + name.slice(1)}  
        </InputLabel>
        <FieldArray name={name}>
            {({ insert, remove, push }) => (
            <div>
            <Grid container direction="column">
                {props.values[name] && props.values[name].length > 0 &&
                    props.values[name].map((s, index) => { 
                        return (
                            <Grid container spacing={2} direction="row" key={index}>
                                <Grid item xs={7}>
                                    {console.log(props.values[name].filter(person => person.pbotID !== person.pbotID))}
                                    <SpecimenSelect name={`${name}.${index}.pbotID`} exclude={props.values[name].filter(specimen => specimen.pbotID !== s.pbotID)} changeHandler={props.identifiedSpecimensChangeHandler}/>
                                </Grid>
                                {(index > 0 || props.optional) &&
                                <Grid item xs={2}>
                                    <Button
                                        type="button"
                                        variant="text" 
                                        color="secondary" 
                                        size="large"
                                        onClick={() => remove(index)}
                                        sx={{width:"100px"}}
                                    >
                                        <ClearIcon/>
                                    </Button>
                                </Grid>
                                }
                            </Grid>
                        )
                    })
                }
            </Grid>
            <Button
                type="button"
                variant="text" 
                color="secondary" 
                onClick={() => push({ pbotID: '', order: '' })}
                disabled={props.values[name] && props.values[name].length !== 0 && props.values[name][props.values[name].length-1].pbotID === ''}
            >
                Add {name}
            </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};
