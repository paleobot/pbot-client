import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Grid, InputLabel } from '@mui/material';
import { TextField } from 'formik-mui';
import {SpecimenSelect} from '../Specimen/SpecimenSelect.js';
import ClearIcon from '@mui/icons-material/Clear';

//TODO: Consider fetching Specimens here rather than in SpecimenSelect, to avoid multiple fetches when multiple SpecimenSelects are present. One way to fetch the specimens here might be via useEffect on changes to the FieldArray values. If we pass specimens to SpecimenSelect, we'd probably want to make fetching them conditional there, since SpecimenSelect is also used on its own in other places. Also, need to make sure we can display a Loading indicator when appropriate. Alternatively, we could just lose the dropdown selection in SpecimenSelect and always use the dialog search, which would simplify things a lot. The dropdown is not very useful when there are a lot of specimens.

export const SpecimenManager = (props) => {
    //console.log("SpecimenManager")

    const name = props.name ? props.name : "specimens";

    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            {props.groupLabel ? props.groupLabel : name.charAt(0).toUpperCase() + name.slice(1)}  
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
                                    <SpecimenSelect name={`${name}.${index}.pbotID`} exclude={props.values[name].filter(specimen => specimen.pbotID !== s.pbotID)} />
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
                Add {props.individualLabel ? 
                        props.individualLabel :
                        props.groupLabel ? 
                            props.groupLabel :
                            name 
                }
            </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};
