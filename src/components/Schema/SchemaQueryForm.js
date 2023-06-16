import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import { PartsPreservedSelect } from '../Organ/PartsPreservedSelect.js';
import { NotableFeaturesSelect } from '../Specimen/NotableFeaturesSelect.js';


const SchemaQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
        schemaID: '', 
        title: '', 
        year: '', 
        partsPreserved: [],
        notableFeatures: [],
        groups: [],
        includeCharacters: false
    };
    
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
                schemaID: Yup.string()
                .uuid('Must be a valid uuid'),
                title: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                year: Yup.string()
                .max(4, 'Must be 4 characters or less'),
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
                    name="schemaID" 
                    type="text"
                    label="Schema ID"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="title" 
                    type="text" 
                    label="Title"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="year" 
                    type="text" 
                    label="Year"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <PartsPreservedSelect />
                <br />

                <NotableFeaturesSelect />
                <br />

                <GroupSelect/>
                <br />
                
                <Field 
                    component={CheckboxWithLabel}
                    name="includeCharacters" 
                    type="checkbox" 
                    Label={{ label: 'Include characters' }}
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

export default SchemaQueryForm;
