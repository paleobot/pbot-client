import React from 'react';
import { Field } from 'formik';
import { MenuItem } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
export const GroupSelect = (props) => {
    console.log("GroupSelect");
    return (
        <Field
            component={TextField}
            type="text"
            name="groups"
            label="Groups"
            select={true}
            style={{minWidth:"200px"}}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
            sx={props.sx}
        >
            {groups.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}
