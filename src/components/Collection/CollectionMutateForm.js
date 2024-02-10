import React, { useState, useEffect }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails, Stack, Box, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {collectionTypes, sizeClasses, geographicResolutionScale, collectionMethods} from "../../Lists.js"
import { CountrySelect } from './CountrySelect.js'
import { StateSelect } from './StateSelect.js'
import {CollectionSelect} from '../Collection/CollectionSelect.js';
import  { CollectionTypeSelect, SizeClassSelect, CollectionMethodSelect, GeographicResolutionSelect, TimescaleSelect, IntervalSelect, LithologySelect, EnvironmentSelect, PreservationModeSelect } from '../Collection/CollectionUtil.js';
//import IntervalSelect from './IntervalSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import PBDBSelect from './PBDBSelect.js';
import States from '../State/States.js';
import { SensibleTextField } from '../SensibleTextField.js';
import { DateEntry } from './DateEntry.js';


const CollectionMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                collection: '', 
                name: '',
                collectiontype: '',
                timescale: '',
                maxinterval: '',
                mininterval: '',
                lat: '',
                lon: '',
                gpsuncertainty: '',
                geographicresolution: '',
                geographiccomments: '',
                country: '',
                state: '',
                directdate: '',
                directdateerror: '',
                directdatetype: '',
                numericagemin: '',
                numericageminerror: '',
                numericagemintype: '',
                numericagemax: '',
                numericagemaxerror: '',
                numericagemaxtype: '',
                agecomments: '',
                lithology: '',
                additionallithology: '',
                stratigraphicgroup: '',
                stratigraphicformation: '',
                stratigraphicmember: '',
                stratigraphicbed: '',
                stratigraphiccomments: '',
                environment: '',
                environmentcomments: '',
                preservationmodes: [],
                collectors: '',
                collectionmethods: [],
                collectingcomments: '',
                sizeclasses: [],
                pbdbid: '',
                pbdbCheck: "delete" === mode, //only force pbdb check if not deleting
                references: [{
                    pbotID: '',
                    order:'',
                }],
                cascade: false,
                public: true,
                groups: [],
                mode: mode,
                protectedSite: false,
    };

    //To clear form when mode changes (this and the innerRef below). formikRef points to the Formik DOM element, 
    //allowing useEffect to call resetForm
    const formikRef = React.useRef();
    React.useEffect(() => {
        console.log("useEffect (mode)")
        if (formikRef.current) {
            formikRef.current.resetForm({values:initValues});
        }
    },[mode]);

    const [selectedTab, setSelectedTab] = React.useState('1');
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                collectiontype: Yup.string().required(),
                lithology: Yup.string().required(),
                additionallithology: Yup.string(),
                stratigraphicgroup: Yup.string(),
                stratigraphicformation: Yup.string(),
                stratigraphicmember: Yup.string(),
                stratigraphicbed: Yup.string(),
                stratigraphiccomments: Yup.string(),
                environment: Yup.string(),
                environmentcomments: Yup.string(),
                preservationmodes: Yup.array().of(Yup.string()).min(1, "preservation modes must have at least one entry"),
                collectors: Yup.string(),
                collectionmethods: Yup.array().of(Yup.string()),
                collectingcomments: Yup.string(),
                timescale: Yup.string().required("timescale is a required field"),
                maxinterval: Yup.string().required("maximum interval is a required field"),
                mininterval: Yup.string(),
                lat: Yup.number().required("latitude is a required field").min(-90).max(90),
                lon: Yup.number().required("longitude is a required field").min(-180).max(180),
                gpsuncertainty: Yup.number().required("gps uncertainty is required").positive().integer(),
                geographicresolution: Yup.string(),
                geographiccomments: Yup.string(),
                protectedSite: Yup.boolean().required("Protection status is required"),
                pbdbid: Yup.string().when('pbdbCheck', {
                    is: false,
                    then: Yup.string().required("While PBDB ID is not required, you must at least check")
                }),
                pbdbCheck: Yup.bool(),
                country: Yup.string().required(),
                directdate: Yup.number(),
                directdateerror: Yup.number(),
                directdatetype: Yup.string(),
                numericagemin: Yup.number(),
                numericageminerror: Yup.number(),
                numericagemintype: Yup.string(),
                numericagemax: Yup.number(),
                numericagemaxerror: Yup.number(),
                numericagemaxtype: Yup.string(),
                agecomments: Yup.string(),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                }),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>

                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        {/*}
                        <CollectionSelect values={props.values} handleChange={props.handleChange}/>
                        <br />*/}
                        <CollectionSelect name="collection" label="Collection" populateMode="full"/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.collection !== '')) &&
                    <>
                    <Accordion style={accstyle} defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Required fields
                    </AccordionSummary>
                    <AccordionDetails>
                
                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="name"
                                label="Name"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <CollectionTypeSelect />
                            <br />

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

                            <Field
                                component={SensibleTextField}
                                name="gpsuncertainty"
                                type="text"
                                label="GPS coordinate uncertainty (meters)"
                            />
                            <br />

                            <CountrySelect />
                            <br />

                            <br />
                            <Field 
                                component={CheckboxWithLabel}
                                name="protectedSite" 
                                type="checkbox"
                                Label={{label:"Protected site"}}
                            />
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

                            <Stack direction="row" spacing={0}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="pbdbid"
                                    label="PBDB ID"
                                    fullWidth 
                                    disabled={false}
                                />
                                <PBDBSelect />
                            </Stack>

                            <ReferenceManager values={props.values}/>
                        
                            <Field 
                                component={CheckboxWithLabel}
                                name="public" 
                                type="checkbox"
                                Label={{label:"Public"}}
                                disabled={(mode === "edit" && props.values.origPublic)}
                            />
                            
                            {!props.values.public &&
                            <div>
                                <GroupSelect  omitPublic={true} />
                                <br />
                            </div>
                            }
                            
                        </AccordionDetails>
                    </Accordion>

                    <Accordion style={accstyle}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="optional-content"
                            id="optional-header"                        
                        >
                            Optional fields
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={selectedTab}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList 
                                            textColor="secondary" 
                                            indicatorColor="secondary" 
                                            onChange={handleTabChange} 
                                            aria-label="optional tabs"
                                        >
                                            <Tab label="Geographic" value="1"/>
                                            <Tab label="Age" value="2"/>
                                            <Tab label="Geologic" value="3"/>
                                            <Tab label="Collecting" value="4"/>
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1">
                                        <StateSelect country={props.values.country} includeNone/>
                                        <br />

                                        <GeographicResolutionSelect />
                                        <br />

                                        <Field
                                            component={SensibleTextField}
                                            name="geographiccomments"
                                            type="text"
                                            multiline
                                            label="Notes on geographic information"
                                        />
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="2">
                                        <DateEntry name="directdate" />
                                        <br />
                                        <DateEntry name="numericagemax" />
                                        <br />
                                        <DateEntry name="numericagemin" />
                                        <br />

                                        <Field
                                            component={SensibleTextField}
                                            name="agecomments"
                                            type="text"
                                            multiline
                                            label="Notes on age"
                                        />
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="3">
                                        <Field
                                            component={SensibleTextField}
                                            name="additionallithology"
                                            type="text"
                                            multiline
                                            label="Additional description of lithology"
                                        />
                                        <br />

                                        <br />
                                        <Typography variant="h7">Stratigraphy</Typography>
                                        
                                        <div style={{marginLeft:"2em"}}>
                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphicgroup"
                                                type="text"
                                                label="Group"
                                            />
                                            <br />

                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphicformation"
                                                type="text"
                                                label="Formation"
                                            />
                                            <br />

                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphicmember"
                                                type="text"
                                                label="Member"
                                            />
                                            <br />

                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphicbed"
                                                type="text"
                                                label="Bed"
                                            />
                                            <br />

                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphiccomments"
                                                type="text"
                                                multiline
                                                label="Notes on stratigraphy"
                                            />
                                            <br />
                                        </div>

                                        <EnvironmentSelect/>
                                        <br />

                                        <Field
                                            component={SensibleTextField}
                                            name="environmentcomments"
                                            type="text"
                                            multiline
                                            label="Notes on environment"
                                        />
                                        <br />

                                    </TabPanel>                            
                                    <TabPanel value="4">
                                        <Field
                                            component={SensibleTextField}
                                            type="text"
                                            name="collectors"
                                            label="Collectors"
                                            fullWidth 
                                            disabled={false}
                                        />
                                        <br />

                                        <CollectionMethodSelect />
                                        <br />

                                        <Field
                                            component={SensibleTextField}
                                            type="text"
                                            name="collectingcomments"
                                            multiline
                                            label="Notes on collection methods"
                                            fullWidth 
                                            disabled={false}
                                        />
                                        <br />
                                    </TabPanel>   
                                </TabContext>
                            </Box>                         
  
                      </AccordionDetails>
                    </Accordion>
                
                    </>
                }
                
                {(mode === "delete") &&
                <div>
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        Label={{ label: 'Cascade' }}
                    />
                  <br />
                </div>
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

export default CollectionMutateForm;
