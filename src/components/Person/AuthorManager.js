import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";
import { PersonSelect } from './PersonSelect.js';

export const AuthorManager = (props) => {
    console.log("AuthorManager");

    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            Authors
        </InputLabel>
        <FieldArray name="authors">
            {({ insert, remove, push }) => (
            <div>
            <Grid container direction="column">
                {props.values.authors.length > 0 &&
                    props.values.authors.map((author, index) => { 
                        //props.values.authors[index].order = index+1; 
                        return (
                            <Grid container spacing={2} direction="row" key={index}>
                                <Grid item xs={5}>
                                    {console.log(props.values.authors.filter(person => person.pbotID !== person.pbotID))}
                                    <PersonSelect name={`authors.${index}.pbotID`} exclude={props.values.authors.filter(person => person.pbotID !== author.pbotID)}/>
                                </Grid>
                                <Grid item xs={1}>
                                    <Field
                                        component={TextField}
                                        name={`authors.${index}.order`}
                                        label="Order"
                                        type="text"
                                        sx={{width:"75px"}}
                                        //disabled={props.values.authors[index].name === ''}
                                    />
                                </Grid>
                                {index > 0 &&
                                <Grid item xs={1}>
                                    <Button
                                        type="button"
                                        variant="text" 
                                        color="secondary" 
                                        size="large"
                                        onClick={() => remove(index)}
                                        sx={{width:"50px"}}
                                        //disabled={props.values.authors[index].name === ''}
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
                    disabled={props.values.authors.length !== 0 && props.values.authors[props.values.authors.length-1].pbotID === ''}
                >
                    Add author
                </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};

