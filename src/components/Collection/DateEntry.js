import React, { useState, useEffect }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { MenuItem, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { TextField } from 'formik-mui';
import { SensibleTextField } from '../SensibleTextField';
import { dateTypes } from "./Lists.js"

const DateType = (props) => {
    const style = {minWidth: "12ch", width:"30%"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name={props.name}
            label="Date type"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {dateTypes.map((dt) => (
                <MenuItem 
                    key={dt} 
                    value={dt}
                >{dt}</MenuItem>
            ))}
        </Field>
    )
}

export const DateEntry = (props) => {

    return (
        <>
        <Typography>
            {props.name === "directdate" ? 
                "Direct date" :
                props.name === "numericagemax" ?
                    "Numeric maximum age" :
                    "Numeric minumum age"
            }
        </Typography>
        <Stack direction="row" spacing={4} >
            <Field
                component={SensibleTextField}
                type="text"
                name={props.name}
                label={props.name === "directdate" ? "Date" : "Age"}
                fullWidth 
                disabled={false}
                style={{width:"30%"}}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name={props.name + "error"}
                label="Error (+/-)"
                fullWidth 
                disabled={false}
                style={{width:"30%"}}
            />
            <DateType name={props.name + "type"} />
        </Stack>
        </>

    )
}