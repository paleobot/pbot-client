import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, MenuItem, Stack } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import {collectionTypes, countries} from "../../Lists.js"
import { CountrySelect } from './CountrySelect.js'
import { StateSelect } from './StateSelect.js'
import { ReferenceManager } from '../Reference/ReferenceManager.js';
import { SpecimenManager } from '../Specimen/SpecimenManager.js';
import { CollectionTypeSelect, LithologySelect, PreservationModeSelect, SizeClassSelect } from './CollectionUtil.js';

const CollectionQueryForm = ({handleSubmit, select}) => {
    const initValues = {
        collectionID: '', 
        name: '', 
        collectiontype: '',
        country: '',
        state: '',
        collectiontype: '',
        lithology: '',
        preservationmodes: [],
        sizeclasses: [],
        specimens: [],
        references: [],
        groups: [],
        includeSpecimens: false
    };
    
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
                collectionID: Yup.string()
                .uuid('Must be a valid uuid'),
                name: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                groups: Yup.array().of(Yup.string())
            })}
            onSubmit={(values, {resetForm}) => {
                handleSubmit(values)
            }}
        >

            {props => (
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
                
                <CollectionTypeSelect />
                <br />

                <CountrySelect />
                <br />
                
                <StateSelect country={props.values.country} />
                <br />

                <LithologySelect />
                <br />
                
                <PreservationModeSelect />
                <br />

                <SizeClassSelect />
                <br />

                <SpecimenManager name="specimens" groupLabel="Specimens" individualLabel="specimen" values={props.values} />

                <ReferenceManager omitOrder values={props.values}/>
                
                <GroupSelect/>
                <br />
                
                {!select &&
                <>
                <Field 
                    component={CheckboxWithLabel}
                    name="includeSpecimens" 
                    type="checkbox" 
                    Label={{ label: 'Include specimens' }}
                    disabled={false}
                    variant="standard"
                />
                <br />
                </>
                }

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

export default CollectionQueryForm;
