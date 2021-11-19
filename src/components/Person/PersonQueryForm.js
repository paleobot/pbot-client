import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab } from '@material-ui/core';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';


const PersonQueryForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
   
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                personID: '', 
                given: '', 
                surname: '', 
                email: '',
                orcid: '',
            }}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
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
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleQueryParamChange(values)
                setShowResult(true);
                //setShowOTUs(true);
            }}
        >
            <Form>
                <Field 
                    component={TextField}
                    name="personID" 
                    type="text"
                    label="Person ID"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="given" 
                    type="text" 
                    label="Given name"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="surname" 
                    type="text" 
                    label="Surname"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="email" 
                    type="text" 
                    label="Email"
                    disabled={false}
                />
                <br />

                <Field 
                    component={TextField}                
                    name="orcid" 
                    type="text" 
                    label="ORCID"
                    disabled={false}
                />
                <br />
                
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
        </Formik>
    
    );
};

export default PersonQueryForm;
