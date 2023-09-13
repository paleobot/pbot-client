import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, Stack } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import { PartsPreservedSelect } from '../Organ/PartsPreservedSelect.js';
import { NotableFeaturesSelect } from '../Specimen/NotableFeaturesSelect.js';
import { SensibleTextField } from '../SensibleTextField.js';
import { ReferenceManager } from '../Reference/ReferenceManager.js';
import { ReferenceSelect } from '../Reference/ReferenceSelect.js';
import { SpecimenSelect } from '../Specimen/SpecimenSelect.js';


const SchemaQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
        schemaID: '', 
        title: '', 
        year: '', 
        purpose: '',
        references: [{
            pbotID: '',
        }],
        //reference: '',
        specimen: '',
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
            {props => (
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
                
                <Field
                    component={SensibleTextField}
                    type="text"
                    name="purpose"
                    label="Purpose"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <PartsPreservedSelect />
                <br />

                <NotableFeaturesSelect />
                <br />

                <SpecimenSelect name="specimen" label="Specimen"  />
                
                <ReferenceManager values={props.values} single/>
                <br />
                {/*<ReferenceSelect name="reference" label="Reference" simple/>
                <br />*/}

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

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                    <Button type="reset" variant="outlined" color="secondary">Reset</Button>
                </Stack>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default SchemaQueryForm;
