import React, { useState }from 'react';
//import { Field, FieldArray } from 'formik';
import { Box, Button, Divider, Grid, InputLabel, MenuItem, Stack } from '@mui/material';
//import { TextField } from 'formik-mui';
import ClearIcon from '@mui/icons-material/Clear';
import { Controller, useFieldArray } from "react-hook-form";


export const MultiManager = ({name, label, content, control, shape, watch, optional, errors, ...props}) => {
    console.log("MultiManager");
    console.log(control._formValues);

    const { fields, append, remove } = useFieldArray({
        control,
        name: name,
    });    

    const formElementName = name;
    console.log(formElementName)
    //console.log(Object.keys(shape)[0])

    const ItemContent = content

    //const maxOrder = !props.omitOrder ? props.values[formElementName].reduce((acc, item) => parseInt(item.order) > acc ? parseInt(item.order) : acc, 0) : 0;

    //TODO: Change below to Stacks. Grid is just weird.
    return (
    <Box sx={{...props.sx, marginTop: "1.5em"}}>
    {/*<div style={style}>*/}
        <InputLabel>
            {label ? label : formElementName.charAt(0).toUpperCase() + formElementName.slice(1)}
        </InputLabel>
        <Grid container direction="column" spacing={1} sx={{ marginLeft:"0em"}}>
            {fields.map((item, index) => (
                <Grid container spacing={2} direction="row" key={item.id}>
                    <Grid item xs={7} sx={{maxWidth:"75%"}} >
                        <ItemContent name={name} index={index} control={control} errors={errors}/>
                        <Divider variant='middle' sx={{marginTop:"1em", marginBottom:"1em"}}/>
                    </Grid>
                    {(index > 0 || optional) &&
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
            ))}
        </Grid>
        <Button
                type="button"
                variant="text" 
                color="primary" 
                onClick={() => append({...shape}/*shape ? {...shape} : ''*/)}
                disabled={
                    //We don't know what is required, but it doesn't make sense to allow creating another unless the user has at least partially filled in the first. So, only enable if first field is not null.
                    /*props.values[formElementName] && 
                    props.values[formElementName].length > 0 && 
                    !props.values[formElementName][props.values[formElementName].length-1][Object.keys(props.shape)[0]]*/
                    watch && watch.length > 0 && 
                    !watch[watch.length-1][Object.keys(shape)[0]]
                    //(shape ? 
                    //    watch[watch.length-1][Object.keys(shape)[0]] === "" :
                    //</div>    watch[watch.length-1]
                    //)
                }
            >
                Add another
        </Button>
    {/*}/div>*/}
    </Box>
    );
};

