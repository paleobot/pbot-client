import React, { useEffect } from 'react';
import { MenuItem } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { publicationTypes } from "../../Lists.js"
import { TextField } from 'formik-mui';

export const PublicationTypeSelect = (props) => {

    const formikProps = useFormikContext()

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
            onChange={event => {
                //This onChange is to initials values.authors correctly for the publicationType.
                //I don't like that these are hard-coded while we are pulling the values from a 
                //separate list. Should probably make that a list of objects with author init value
                //field in each or something.
                console.log(event)
                if (event.target.value === "journal article" || 
                    event.target.value === "standalone book" || 
                    event.target.value === "contributed article in edited book" ||
                    event.target.value === "unpublished") {
                    formikProps.values.authors = [{
                        pbotID: '',
                        order:'',
                        searchName:'',
                    }]
                } else {
                    formikProps.values.authors = []
                }
                formikProps.handleChange(event);
            }}
            disabled={false}
        >
            {publicationTypes.map((pt) => (
                <MenuItem 
                    key={pt} 
                    value={pt}
                    authorrequired="true"
                >{pt}</MenuItem>
            ))}
        </Field>
    )
}


