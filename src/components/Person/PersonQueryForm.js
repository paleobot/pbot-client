import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, Stack } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';


const PersonQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
        personID: '', 
        given: '', 
        surname: '', 
        email: '',
        orcid: '',
        groups: [],
    };
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
                personID: Yup.string()
                .uuid('Must be a valid uuid'),
                given: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                surname: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                email: Yup.string().email()
                .max(50, 'Must be 50 characters or less'),
                orcid: Yup.string()
                .max(50, 'Must be 50 characters or less'),
                groups: Yup.array().of(Yup.string())
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleSubmit(values)
                //setShowOTUs(true);
            }}
        >
            <Form>
                <Field 
                    component={TextField}                
                    name="surname" 
                    type="text" 
                    label="Surname"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="given" 
                    type="text" 
                    label="Given name"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="email" 
                    type="text" 
                    label="Email"
                    disabled={false}
                    variant="standard"
                />
                <br />

                <Field 
                    component={TextField}                
                    name="orcid" 
                    type="text" 
                    label="ORCID"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="personID" 
                    type="text"
                    label="PBot ID"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <GroupSelect/>
                <br />

                <br />
                <br />

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                    <Button type="reset" variant="outlined" color="secondary">Reset</Button>
                </Stack>
                <br />
                <br />
            </Form>
        </Formik>
    
    );
};

export default PersonQueryForm;
