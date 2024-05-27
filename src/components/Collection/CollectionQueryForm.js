import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, MenuItem, Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Tooltip } from '@mui/material';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { OTUSelect } from '../OTU/OTUSelect.js';
import { MajorTaxonGroupSelect } from '../OTU/OTUHelper.js';

const CollectionQueryForm = ({handleSubmit, select}) => {
    const initValues = {
        collectionID: '', 
        name: '', 
        collectiontype: '',
        lat: '',
        lon: '',
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
        otu: '',
        majorTaxonGroup: '',
        pbdbParentTaxon: '',
        family: '',
        genus: '',
        species: '',
        groups: [],
        includeSpecimens: false
    };
    
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object().shape({
                collectionID: Yup.string()
                .uuid('Must be a valid uuid'),
                name: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                //lat: Yup.number().min(-90).max(90),
                //lon: Yup.number().min(-180).max(180),
                lat: Yup.number().when('lon', {
                    is: lon => lon,
                    then: Yup.number().required("Latitude/Longitude must be entered together"),
                }).min(-90).max(90),
                lon: Yup.number().when('lat', {
                    is: lat => lat,
                    then: Yup.number().required("Latitude/Longitude must be entered together"),
                }).min(-180).max(180),
                groups: Yup.array().of(Yup.string())
            }, [["lat", "lon"]])}
            onSubmit={(values, {resetForm}) => {
                handleSubmit(values)
            }}
        >

            {props => (
            <Form>
                
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    disabled={false}
                    variant="standard"
                />
                <br />
                <br />

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Taxonomy
                    </AccordionSummary>
                    <AccordionDetails>

                        <OTUSelect name="otu" label="OTU name" populateMode="simple"/>
                        <br />

                        <MajorTaxonGroupSelect/>
                        <br />

                        <Field 
                            component={SensibleTextField}
                            name="pbdbParentTaxon" 
                            type="text" 
                            label="PBDB parent taxon"
                            disabled={false}
                        />
                        <br />

                        <Field 
                            component={SensibleTextField}
                            name="family" 
                            type="text" 
                            label="Family"
                            disabled={false}
                        />
                        <br />
                        
                        <Field 
                            component={SensibleTextField}                
                            name="genus" 
                            type="text" 
                            label="Genus"
                            disabled={false}
                        />
                        <br />
                        
                        <Field 
                            component={SensibleTextField}
                            name="species" 
                            type="text" 
                            label="Specific epithet"
                            disabled={false}
                        />
                        <br />
                        
                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Fossil characteristics
                    </AccordionSummary>
                    <AccordionDetails>

                        <PreservationModeSelect />
                        <br />

                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Time
                    </AccordionSummary>
                    <AccordionDetails>

                        <TimescaleSelect values={props.values} setFieldValue={props.setFieldValue}/>
                            
                        <Stack direction="row" spacing={4}>
                            <IntervalSelect name="maxinterval" values={props.values} setFieldValue={props.setFieldValue}/>
                            <IntervalSelect name="mininterval" values={props.values} setFieldValue={props.setFieldValue}/>
                        </Stack>
            
                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Location
                    </AccordionSummary>
                    <AccordionDetails>

                    <Stack direction="row" spacing={4}>
                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="lat"
                            label="Latitude"
                            style={{minWidth: "12ch", width:"35%"}}
                            disabled={false}
                        />
                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="lon"
                            label="Longitude"
                            style={{minWidth: "12ch", width:"35%"}}
                            disabled={false}
                        />
                    </Stack>

                        <CountrySelect />
                        <br />
                    
                        <StateSelect country={props.values.country} />
                        <br />

                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Stratigraphy
                    </AccordionSummary>
                    <AccordionDetails>
                                       
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
                    
                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Specimen
                    </AccordionSummary>
                    <AccordionDetails>

                        <SpecimenManager name="specimens" groupLabel="Specimens" individualLabel="specimen" values={props.values} />

                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Metadata
                    </AccordionSummary>
                    <AccordionDetails>

                        <Field 
                            component={TextField}
                            name="collectionID" 
                            type="text"
                            label="PBot ID"
                            disabled={false}
                            variant="standard"
                        />
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

                        <ReferenceManager omitOrder values={props.values}/>
                
                        <GroupSelect/>
                        <br />

                    </AccordionDetails>
                </Accordion>

                {/*
                <CollectionTypeSelect />
                <br />

                <LithologySelect />
                <br />
                
                <SizeClassSelect />
                <br />

                <EnvironmentSelect/>
                <br />

                <CollectionMethodSelect />
                <br />
                */}
               
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
