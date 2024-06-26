import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
import { CharacterSelect } from '../Character/CharacterSelect.js';
import { CollectionSelect } from '../Collection/CollectionSelect.js';
import { DescriptionSelect } from '../Description/DescriptionSelect.js';
import { GroupSelect } from '../Group/GroupSelect.js';
import { PartsPreservedSelect } from '../Organ/PartsPreservedSelect.js';
import { OTUSelect } from '../OTU/OTUSelect.js';
import { PersonManager } from '../Person/PersonManager.js';
import { ReferenceManager } from '../Reference/ReferenceManager.js';
import { SchemaSelect } from '../Schema/SchemaSelect.js';
import { SensibleTextField } from '../SensibleTextField.js';
import { StateSelect } from '../State/StateSelect.js';
import IDigBioSelect from './IDigBioSelect.js';
import { NotableFeaturesSelect } from './NotableFeaturesSelect.js';
import { PreservationModeSelect } from './PreservationModeSelect.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MajorTaxonGroupSelect } from '../OTU/OTUHelper.js';
import { IntervalSelect, TimescaleSelect } from '../Collection/CollectionUtil.js';

const SpecimenQueryForm = ({handleSubmit, select}) => {
    console.log("SpecimenQueryForm")
    console.log(select)
    //const [values, setValues] = useState({});
    const initValues = {
        specimenID: '', 
        name: '', 
        collection: '',
        schema: '',
        character: '',
        states: [],
        partsPreserved: [],
        notableFeatures: [],
        preservationModes: [],
        idigbioInstitutionCode: '',
        idigbioCatalogNumber: '',
        idigbiouuid: '',
        repository: '',
        description: '',
        identifiedAs: '',
        typeOf: '',
        holotypeOf: '',
        references: [],
        identifiers: [],
        majorTaxonGroup: '',
        pbdbParentTaxon: '',
        family: '',
        genus: '',
        species: '',
        groups: [],
        includeImages: false,
        includeDescriptions: false,
        includeOTUs: false
    };
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
                specimenID: Yup.string()
                .uuid('Must be a valid uuid'),
                name: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                collection: Yup.string(),
                idigbiouuid: Yup.string()
                .uuid('Must be a valid uuid'),
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

                        <OTUSelect name="identifiedAs" label="Identified as" populateMode="simple"/>

                        <br />
                        <OTUSelect name="typeOf" label="Type of" populateMode="simple"/>

                        <br />
                        <OTUSelect name="holotypeOf" label="Holotype of" populateMode="simple"/>

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

                        <PartsPreservedSelect/>
                        <br />
                        
                        <NotableFeaturesSelect />
                        <br />

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
                    Not yet implemented
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
                    Not yet implemented
                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Schema
                    </AccordionSummary>
                    <AccordionDetails>

                        <SchemaSelect />
                        <br />

                        {props.values.schema !== '' &&
                            <>
                                <CharacterSelect values={props.values} source="characterInstance"/>
                                <br />
                            </>
                        }
                        
                        {props.values.character !== "" &&
                            <>
                                <StateSelect values={props.values} source="characterInstance" multi={true}/>
                                <br />
                            </>
                        }

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
                            name="specimenID" 
                            type="text"
                            label="PBot ID"
                            disabled={false}
                        />
                        <br />

                        <br />
                        <Typography variant="h7" >iDigBio</Typography>
                        
                        <div style={{marginLeft:"2em"}}>
                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="idigbioInstitutionCode"
                                label="Institution code"
                                fullWidth 
                                disabled={false}
                            >
                            </Field>
                            <br />
        
                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="idigbioCatalogNumber"
                                label="Catalog number"
                                fullWidth 
                                disabled={false}
                            >
                            </Field>
                            <br />
        
                            <Stack direction="row" spacing={0}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="idigbiouuid"
                                    label="UUID"
                                    fullWidth 
                                    disabled={false}
                                />
                                <IDigBioSelect />
                            </Stack>
                        </div>
                        <br />

                        <CollectionSelect name="collection" label="Collection" populateMode="simple"/>
                        <br />

                        <ReferenceManager omitOrder values={props.values}/>

                        <PersonManager label= "Identified by" name="identifiers" omitOrder={true} values={props.values} handleChange={props.handleChange}/>

                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="repository"
                            label="Repository"
                            fullWidth 
                            disabled={false}
                        >
                        </Field>
                        <br />

                        <GroupSelect/>
                        <br />

                    </AccordionDetails>
                </Accordion>

                {/*
                <DescriptionSelect name="description" label="Description" populateMode="simple" select/>
                <br />
                */}

                {!select &&
                <>
                <Field 
                    component={CheckboxWithLabel}
                    name="includeImages" 
                    type="checkbox" 
                    Label={{ label: 'Include images' }}
                    disabled={false}
                />
                <br />

                <Field 
                    component={CheckboxWithLabel}
                    name="includeDescriptions" 
                    type="checkbox" 
                    Label={{ label: 'Include descriptions' }}
                    disabled={false}
                />
                <br />

                <Field 
                    component={CheckboxWithLabel}
                    name="includeOTUs" 
                    type="checkbox" 
                    Label={{ label: 'Include OTUs' }}
                    disabled={false}
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

export default SpecimenQueryForm;
