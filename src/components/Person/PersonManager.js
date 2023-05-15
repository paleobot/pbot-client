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

export const PersonManager = (props) => {
    console.log("PersonManager");

    const name = props.name ? props.name : "authors";
    console.log(name)
    console.log(props.values)
    console.log(props.values[name])
    
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
                    props.values[name].map((p, index) => { 
                        //props.values.authors[index].order = index+1; 
                        return (
                            <Grid container spacing={2} direction="row" key={index}>
                                <Grid item xs={0}>
                                    {console.log(props.values[name].filter(person => person.pbotID !== person.pbotID))}
                                    <PersonSelect name={`${name}.${index}.pbotID`} exclude={props.values[name].filter(person => person.pbotID !== p.pbotID)}/>
                                </Grid>
                                {!props.omitOrder &&
                                <Grid item xs={1}>
                                    <Field
                                        component={TextField}
                                        name={`${name}.${index}.order`}
                                        label="Order"
                                        type="text"
                                        sx={{width:"75px"}}
                                        //disabled={props.values.authors[index].name === ''}
                                    />
                                </Grid>
                                }
                                {(index > 0 || props.optional) &&
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

