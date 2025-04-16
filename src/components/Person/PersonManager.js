import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Divider, Grid, InputLabel, MenuItem, Stack } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import { PersonSelect } from './PersonSelect.js';
import ClearIcon from '@mui/icons-material/Clear';
import { SensibleTextField } from '../SensibleTextField.js';

const PersonFields = (props) => {
    return (
        <Stack direction="column" spacing={0}>
            <Field
                component={SensibleTextField}
                type="text"
                name="authors[0].person"
                label="Person"
                style={{minWidth: "12ch", width:"100%"}}h
                disabled={false}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name="authors[0].givenname"
                label="Given name"
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name="authors[0].surname"
                label="Surname"
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name="authors[0].organization"
                label="Organization"
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
        </Stack>
    )
}

export const PersonManager = (props) => {
    console.log("PersonManager");

    const name = props.name ? props.name : "authors";
    console.log(name)
    console.log(props.values)
    //console.log(props.values[name])

    const maxOrder = !props.omitOrder ? props.values[authors].reduce((acc, person) => parseInt(person.order) > acc ? parseInt(person.order) : acc, 0) : 0;

    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            {props.label ? props.label : name.charAt(0).toUpperCase() + name.slice(1)}
        </InputLabel>
        <FieldArray name={name}>
            {({ insert, remove, push }) => (
            <div>
            <Grid container direction="column" sx={{ marginLeft:"1.5em"}}>
                {props.values[name] && props.values[name].length > 0 &&
                    props.values[name].map((p, index) => { 
                        //props.values.authors[index].order = index+1; 
                        return (
                            <>
                            {index > 0 &&
                                <Divider sx={{marginTop: "1.5em", width: "50%"}}/>
                            }
                            <Grid container spacing={2} direction="row" key={index}>
                                <Grid item xs={7}>
                                    {console.log(props.values[name].filter(person => person.pbotID !== person.pbotID))}
                                    <PersonFields />
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
                                <Grid item xs={2}>
                                    <Button
                                        type="button"
                                        variant="text" 
                                        color="secondary" 
                                        size="large"
                                        onClick={() => remove(index)}
                                        sx={{width:"100px"}}
                                        //disabled={props.values.authors[index].name === ''}
                                    >
                                        <ClearIcon/>
                                    </Button>
                                </Grid>
                                }
                            </Grid>
                            </>
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
                Add to {name}
            </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};

