import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Grid, InputLabel } from '@mui/material';
import { TextField } from 'formik-mui';
import {ReferenceSelect} from '../Reference/ReferenceSelect.js';

export const ReferenceManager = (props) => {
    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            References
        </InputLabel>
        <FieldArray name="references">
            {({ insert, remove, push }) => (
            <div>
            <Grid container direction="column">
                {props.values.references.length > 0 &&
                    props.values.references.map((reference, index) => { 
                        return (
                            <Grid container spacing={2} direction="row" key={index}>
                                <Grid item xs={5}>
                                    <ReferenceSelect name={`references.${index}.pbotID`} exclude={props.values.references.filter(ref => ref.pbotID !== reference.pbotID)}/>
                                </Grid>
                                <Grid item xs={1}>
                                    <Field
                                        component={TextField}
                                        name={`references.${index}.order`}
                                        label="Order"
                                        type="text"
                                        sx={{width:"75px"}}
                                    />
                                </Grid>
                                {(index > 0 || props.optional) &&
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
                                }
                            </Grid>
                        )
                    })}
                </Grid>
                <Button
                    type="button"
                    variant="text" 
                    color="secondary" 
                    onClick={() => push({ pbotID: '', order: '' })}
                    disabled={props.values.references.length !== 0 && props.values.references[props.values.references.length-1].pbotID === ''}
                >
                    Add reference
                </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};

