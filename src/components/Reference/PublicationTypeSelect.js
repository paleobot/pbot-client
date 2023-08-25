import { MenuItem } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { TextField } from 'formik-mui';
import React from 'react';
import { publicationTypes } from "../../Lists.js";

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
            onChange={(event, child) => {
                formikProps.setFieldValue("pbdbCheck", false);
                if (child.props.dauthorsrequired === "true") {
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
                    key={pt.name} 
                    value={pt.name}
                    dauthorsrequired={pt.authorsRequired.toString()}
                >{pt.name}</MenuItem>
            ))}
        </Field>
    )
}


