import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab } from '@material-ui/core';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';


const ReferenceQueryForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
   
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                referenceID: '', 
                title: '', 
                year: '', 
                publisher: '',
            }}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                schemaID: Yup.string()
                .uuid('Must be a valid uuid'),
                title: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                year: Yup.string()
                .max(4, 'Must be 4 characters or less'),
                publisher: Yup.string()
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
                    name="referenceID" 
                    type="text"
                    label="Reference ID"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="title" 
                    type="text" 
                    label="Title"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="year" 
                    type="text" 
                    label="Year"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="publisher" 
                    type="text" 
                    label="Publisher"
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

export default ReferenceQueryForm;
