import React from 'react';
import { MenuItem } from "@mui/material";
import { Field } from "formik";
import { publicationTypes } from "../../Lists.js"
import { TextField } from 'formik-mui';

export const PublicationTypeSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="publicationType"
            label="Publication type"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {publicationTypes.map((pt) => (
                <MenuItem 
                    key={pt} 
                    value={pt}
                >{pt}</MenuItem>
            ))}
        </Field>
    )
}


