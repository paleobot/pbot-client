import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Divider, Grid, InputLabel, MenuItem, Stack } from '@mui/material';
import { TextField } from 'formik-mui';
import ClearIcon from '@mui/icons-material/Clear';


export const MultiManager = (props) => {
    console.log("MultiManager");

    const formElementName = props.name;
    console.log(formElementName)
    console.log(props.values)
    //console.log(props.values[name])
    console.log(Object.keys(props.shape)[0])

    const ItemContent = props.content

    const maxOrder = !props.omitOrder ? props.values[formElementName].reduce((acc, item) => parseInt(item.order) > acc ? parseInt(item.order) : acc, 0) : 0;

    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            {props.label ? props.label : formElementName.charAt(0).toUpperCase() + formElementName.slice(1)}
        </InputLabel>
        <FieldArray name={formElementName}>
            {({ insert, remove, push }) => (
            <div>
            <Grid container direction="column" sx={{ marginLeft:"1.5em"}}>
                {props.values[formElementName] && props.values[formElementName].length > 0 &&
                    props.values[formElementName].map((p, index) => { 
                        return (
                            <div key={index}>
                            {index > 0 &&
                                <Divider sx={{marginTop: "1.5em", width: "50%"}}/>
                            }
                            {/*<InputLabel> {props.label} {index+1} </InputLabel>*/}
                            <Grid container spacing={2} direction="row" >
                                <Grid item xs={7}>
                                    <ItemContent index={index}/>
                                </Grid>
                                {!props.omitOrder &&
                                <Grid item xs={1}>
                                    <Field
                                        component={TextField}
                                        name={`${formElementName}.${index}.order`}
                                        label="Order"
                                        type="text"
                                        sx={{width:"75px"}}
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
                                   >
                                        <ClearIcon/>
                                    </Button>
                                </Grid>
                                }
                            </Grid>
                            </div>
                        )
                    })
                }
            </Grid>
            <Button
                type="button"
                variant="text" 
                color="secondary" 
                onClick={() => push(props.shape)}
                disabled={
                    //We don't know what is required, but it doesn't make sense to allow creating another unless the user has at least partially filled in the first. So, only enable if first field is not null.
                    props.values[formElementName] && 
                    props.values[formElementName].length > 0 && 
                    !props.values[formElementName][props.values[formElementName].length-1][Object.keys(props.shape)[0]]
                }
            >
                Add another
            </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};

