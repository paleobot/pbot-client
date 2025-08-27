import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Grid, InputLabel } from '@mui/material';
import { TextField, SimpleFileUpload } from 'formik-mui';

export const ImageManager = (props) => {
    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            Images
        </InputLabel>
        <FieldArray name="images">
            {({ insert, remove, push }) => (
            <div>
            <Grid container direction="column">
                {props.values.images.length > 0 &&
                    props.values.images.map((image, index) => { 
                        return (
                            <Grid container spacing={2} direction="row" key={index}>
                                <Grid item xs={6}>
                                    
                                    <Field
                                        component={SimpleFileUpload}
                                        name={`images.${index}.image`}
                                        fullWidth 
                                        disabled={false}
                                        onChange={(event) => {
                                            props.values.images[index].image = event.currentTarget.files[0]
                                        }}
                                    >
                                    </Field>
                                    
                                    {/*
                                    <input
                                        accept="image/*"
                                        name={`images.${index}.image`}
                                        type="file"
                                        onChange={(event) => {props.values.images[index].image = event.currentTarget.files[0]}}
                                    />
                                    */}
                                </Grid>
                                <Grid item xs={3}>
                                    <Field
                                        component={TextField}
                                        name={`images.${index}.order`}
                                        label="Order"
                                        type="text"
                                    />
                                </Grid>
                                {index > 0 &&
                                <Grid item xs={3}>
                                    <Button
                                        type="button"
                                        variant="text" 
                                        color="secondary" 
                                        size="large"
                                        onClick={() => remove(index)}
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
                    onClick={() => push({ image: {}, order: '' })}
                    disabled={false}
                >
                    Add image
                </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};
