import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import { SpecimenSelect } from '../Specimen/SpecimenSelect.js';


const DescriptionQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
   
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                type: "all",
                descriptionID: '', 
                specimen: '',
                groups: [],
            }}
            validationSchema={Yup.object({
                descriptionID: Yup.string()
                .uuid('Must be a valid uuid'),
                groups: Yup.array().of(Yup.string())
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.type = values.type === "all" ? '' : values.type
                handleSubmit(values)
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
            
                <Field 
                    component={TextField}
                    name="descriptionID" 
                    type="text"
                    label="Description ID"
                    disabled={false}
                />
                <br />
                
                <SpecimenSelect name="specimen" label="Specimen" populateMode="simple"/>
                
                <GroupSelect/>
                <br />

                <br />
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default DescriptionQueryForm;
