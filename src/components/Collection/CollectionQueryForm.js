import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, MenuItem, Stack, Typography } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import {collectionTypes, countries} from "../../Lists.js"
import { CountrySelect } from './CountrySelect.js'
import { StateSelect } from './StateSelect.js'
import { ReferenceManager } from '../Reference/ReferenceManager.js';
import { SpecimenManager } from '../Specimen/SpecimenManager.js';
import { CollectionMethodSelect, CollectionTypeSelect, EnvironmentSelect, IntervalSelect, LithologySelect, PreservationModeSelect, SizeClassSelect, TimescaleSelect } from './CollectionUtil.js';
import PBDBSelect from './PBDBSelect.js';
import { SensibleTextField } from '../SensibleTextField.js';

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
        environment: '',
        collectionmethods: [],
        pbdbid: '',
        stratigraphicgroup: '',
        stratigraphicformation: '',
        stratigraphicmember: '',
        stratigraphicbed: '',
        timescale: '',
        maxinterval: '',
        mininterval: '',
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

                <TimescaleSelect values={props.values} setFieldValue={props.setFieldValue}/>
                            
                <Stack direction="row" spacing={4}>
                    <IntervalSelect name="maxinterval" values={props.values} setFieldValue={props.setFieldValue}/>
                    <IntervalSelect name="mininterval" values={props.values} setFieldValue={props.setFieldValue}/>
                </Stack>

                <LithologySelect />
                <br />
                
                <PreservationModeSelect />
                <br />

                <SizeClassSelect />
                <br />

                <EnvironmentSelect/>
                <br />

                <CollectionMethodSelect />
                <br />

                <Field
                    component={SensibleTextField}
                    type="text"
                    name="pbdbid"
                    label="PBDB ID"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <br />
                <Typography variant="h6" >Stratigraphy</Typography>
                                        
                <div style={{marginLeft:"2em"}}>
                    <Field
                        component={SensibleTextField}
                        name="stratigraphicgroup"
                        type="text"
                        label="Group"
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        name="stratigraphicformation"
                        type="text"
                        label="Formation"
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        name="stratigraphicmember"
                        type="text"
                        label="Member"
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        name="stratigraphicbed"
                        type="text"
                        label="Bed"
                        disabled={false}
                    />
                    <br />
                </div>

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
