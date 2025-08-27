import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
import { CharacterSelect } from '../Character/CharacterSelect.js';
import { GroupSelect } from '../Group/GroupSelect.js';
import { PartsPreservedSelect } from '../Organ/PartsPreservedSelect.js';
import { SchemaSelect } from '../Schema/SchemaSelect.js';
import { NotableFeaturesSelect } from '../Specimen/NotableFeaturesSelect.js';
import { StateSelect } from '../State/StateSelect.js';
import { MajorTaxonGroupSelect, QualityIndexSelect } from './OTUHelper.js';
import { SensibleTextField } from '../SensibleTextField.js';
import { SpecimenManager } from '../Specimen/SpecimenManager.js';
import { SpecimenSelect } from '../Specimen/SpecimenSelect.js';
import { OTUSelect } from './OTUSelect.js';
import { ReferenceManager } from '../Reference/ReferenceManager.js';
import { IntervalSelect, TimescaleSelect } from '../Collection/CollectionUtil.js';
import { CountrySelect } from '../Collection/CountrySelect.js';
import { StateSelect as GeoStateSelect } from '../Collection/StateSelect.js';
import { CollectionSelect } from '../Collection/CollectionSelect.js';
import { PersonManager } from '../Person/PersonManager.js';
import CharacterInstanceQueryManager from '../CharacterInstance/CharacterInstanceQueryManager.js';

const OTUQueryForm = ({handleSubmit, select}) => {
    //const [values, setValues] = useState({});
    const initValues = {
                otuID: '', 
                name: '',
                family: '', 
                genus: '', 
                species: '',
                authority: '',
                diagnosis: '',
                qualityIndex: '',
                majorTaxonGroup: '',
                pbdbParentTaxon: '',
                additionalClades: '',
                identifiedSpecimens: [],
                typeSpecimens: [],
                holotypeSpecimen: '',
                synonym: '',
                references: [],
                characterInstances: [],
                partsPreserved: [],
                notableFeatures: [],
                timescale: '',
                maxinterval: '',
                mininterval: '',
                lat: '',
                lon: '',
                country: '',
                state: '',
                stratigraphicgroup: '',
                stratigraphicformation: '',
                stratigraphicmember: '',
                stratigraphicbed: '',
                groups: [],
                includeHolotypeDescription: true,
                includeMergedDescription: true,
                includeSynonyms: true,
                includeComments: true,
                collection: '',
                enterers: [],
                includeOverlappingIntervals: false
    };
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    
    const indent01 = {marginLeft: "2em"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object().shape({
                otuID: Yup.string()
                .uuid('Must be a valid uuid'),
                family: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                genus: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                species: Yup.string()
                .max(30, 'Must be 30 characters or less'),
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
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleSubmit(values)
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
            
                <Field 
                    component={SensibleTextField}
                    name="name" 
                    type="text"
                    label="Name"
                    disabled={false}
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

                        <MajorTaxonGroupSelect />
                        <br />
                
                        <Field 
                            component={SensibleTextField}
                            name="pbdbParentTaxon" 
                            type="text" 
                            label="PBDB parent taxon"
                            disabled={false}
                        />
                        <br />

                        {/*
                        <Field 
                            component={SensibleTextField}
                            name="additionalClades" 
                            type="text" 
                            label="Additional clades"
                            disabled={false}
                        />
                        <br />
                        */}

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

                        <PartsPreservedSelect label="Parts described" />
                        <br />
                        
                        <NotableFeaturesSelect label="Notable features described" />
                        <br />

                        <QualityIndexSelect />
                        <br />
        
                    </AccordionDetails>
                </Accordion>
                
                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Description
                    </AccordionSummary>
                    <AccordionDetails>

                        <CharacterInstanceQueryManager values={props.values} />

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
                        <br />
                        <Field
                            component={CheckboxWithLabel}
                            name="includeOverlappingIntervals" 
                            type="checkbox" 
                            Label={{ label: 'Include overlapping intervals from other timescales' }}
                            disabled={false}
                            variant="standard"
                        />
            
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
                    
                        <GeoStateSelect country={props.values.country} />
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

                        <SpecimenManager name="identifiedSpecimens" groupLabel="Identified specimens" individualLabel="identified specimen" values={props.values} />
                        <br />

                        <SpecimenManager name="typeSpecimens" groupLabel="Type specimens" individualLabel="type specimen" values={props.values} />
                        <br />

                        <SpecimenSelect name="holotypeSpecimen" label="Holotype specimen"/>
                        <br />

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
                            component={SensibleTextField}
                            name="otuID" 
                            type="text"
                            label="PBot ID"
                            disabled={false}
                        />
                        <br />
                
                        <OTUSelect name="synonym" label="Synonym"/>
                        <br />

                        <CollectionSelect name="collection" label="Collection" populateMode="simple"/>
                        <br />

                        <PersonManager label= "Entered by" name="enterers" optional={true} omitOrder={true} values={props.values} />

                        <ReferenceManager optional={true} omitOrder values={props.values}/>
                        <br />
                        
                        <GroupSelect/>
                        <br />

                    </AccordionDetails>
                </Accordion>

                {/*
                <Field
                    component={SensibleTextField}
                    name="authority" 
                    type="text" 
                    label="Authority"
                    disabled={false}
                />
                <br />

                <Field 
                    component={SensibleTextField}
                    name="diagnosis" 
                    type="text" 
                    label="Diagnosis"
                    disabled={false}
                />
                <br />
                */}
                
                {/*!select && 
                <>
                <Field 
                    component={CheckboxWithLabel}
                    name="includeSynonyms" 
                    type="checkbox" 
                    Label={{ label: 'Include synonyms' }}
                    disabled={false}
                />
                
                {props.values.includeSynonyms &&
                    <div style={indent01}>
                    <Field 
                        component={CheckboxWithLabel}
                        name="includeComments" 
                        type="checkbox" 
                        Label={{ label: 'Include comments' }}
                        disabled={false}
                    />
                    </div>
                }
                {!props.values.includeSynonyms &&
                <br />
                }
                
                <Field 
                    component={CheckboxWithLabel}
                    name="includeHolotypeDescription" 
                    type="checkbox" 
                    Label={{ label: 'Include holotype description' }}
                    disabled={false}
                />
                <br />

                <Field 
                    component={CheckboxWithLabel}
                    name="includeMergedDescription" 
                    type="checkbox" 
                    Label={{ label: 'Include merged description' }}
                    disabled={false}
                />
                <br />
                </>
                */}
                
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

export default OTUQueryForm;
