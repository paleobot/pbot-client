import React from 'react';
import { MenuItem } from "@mui/material";
import { Field } from "formik";
import { imageCategories } from "../../Lists.js"
import { TextField } from 'formik-mui';

export const ImageCategorySelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="category"
            label="Category"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {imageCategories.map((iC) => (
                <MenuItem 
                    key={iC} 
                    value={iC}
                >{iC}</MenuItem>
            ))}
        </Field>
    )
}


