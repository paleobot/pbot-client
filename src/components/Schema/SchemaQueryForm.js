import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab } from '@material-ui/core';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import {GroupSelect} from '../Group/GroupSelect.js';


const SchemaQueryForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
   
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                schemaID: '', 
                title: '', 
                year: '', 
                groups: [],
                includeCharacters: false}}
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
                groups: Yup.array().of(Yup.string())
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
                    name="schemaID" 
                    type="text"
                    label="Schema ID"
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
                
                <GroupSelect/>
                <br />
                
                <Field 
                    component={CheckboxWithLabel}
                    name="includeCharacters" 
                    type="checkbox" 
                    Label={{ label: 'Include characters' }}
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

export default SchemaQueryForm;
