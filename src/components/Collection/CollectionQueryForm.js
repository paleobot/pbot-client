import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';


const CollectionQueryForm = ({handleSubmit, setShowResult}) => {
    const initValues = {
        collectionID: '', 
        name: '', 
        groups: [],
        includeSpecimens: false
    };
    
    return (
       
        <Formik
            initialValues={initValues}
            validate={values => {
                const errors = {};
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                collectionID: Yup.string()
                .uuid('Must be a valid uuid'),
                name: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                groups: Yup.array().of(Yup.string())
            })}
            onSubmit={(values, {resetForm}) => {
                handleSubmit(values)
                setShowResult(true);
            }}
        >
            <Form>
                <Field 
                    component={TextField}
                    name="collectionID" 
                    type="text"
                    label="Collection ID"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <GroupSelect/>
                <br />
                
                <Field 
                    component={CheckboxWithLabel}
                    name="includeSpecimens" 
                    type="checkbox" 
                    Label={{ label: 'Include specimens' }}
                    disabled={false}
                    variant="standard"
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

export default CollectionQueryForm;
