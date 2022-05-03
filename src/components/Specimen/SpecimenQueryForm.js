import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import {CollectionSelect} from '../Collection/CollectionSelect.js';

const SpecimenQueryForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
   
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                specimenID: '', 
                name: '', 
                locality: '', 
                collection: '',
                groups: [],
                includeComplex: false}}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                specimenID: Yup.string()
                .uuid('Must be a valid uuid'),
                name: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                locality: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                collection: Yup.string(),
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
                    name="specimenID" 
                    type="text"
                    label="Specimen ID"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="locality" 
                    type="text" 
                    label="Locality"
                    disabled={false}
                />
                <br />
                
                <CollectionSelect />
                <br />

                <GroupSelect/>
                <br />
                
                <Field 
                    component={CheckboxWithLabel}
                    name="includeComplex" 
                    type="checkbox" 
                    Label={{ label: 'Include complex' }}
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

export default SpecimenQueryForm;
