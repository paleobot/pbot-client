import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails, Box, Stack } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select, SimpleFileUpload } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import {ImageManager} from '../Image/ImageManager.js';
import {CollectionSelect} from '../Collection/CollectionSelect.js';
import {PartsPreservedSelect} from '../Organ/PartsPreservedSelect.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SpecimenSelect } from '../Specimen/SpecimenSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import { NotableFeaturesSelect } from './NotableFeaturesSelect.js';
import { SensibleTextField } from '../SensibleTextField.js';
import { PersonManager } from '../Person/PersonManager.js';
import { PreservationModeSelect } from './PreservationModeSelect.js';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import IDigBioSelect from './IDigBioSelect.js';

/*
const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    //TODO: look into https://www.graphql-scalars.dev/docs/scalars/uuid for managing idigbiouuid
    const gQL = gql`
            query {
                Specimen {
                    pbotID
                    name
                    preservationModes {
                        pbotID
                    }
                    repository
                    otherRepositoryLink
                    notes
                    gbifID
                    idigbiouuid
                    idigbioInstitutionCode
                    idigbioCatalogNumber
                    pbdbcid
                    pbdboccid
                    partsPreserved {
                        pbotID
                    }
                    notableFeatures {
                        pbotID
                    }
                    describedBy {
                      	Description {
                        	pbotID
                      	}
                    }
                    elementOf {
                        name
                        pbotID
                    }
                    collection {
                        pbotID
                    }
                    references (orderBy: order_asc) {
                        Reference {
                            pbotID
                        }
                        order
                    }
                    identifiers {
                        pbotID
                    }
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Specimen results<<<<<<<<<<<<<");
    console.log(data.Specimen);
    const specimens = alphabetize([...data.Specimen], "name");
    console.log(specimens);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="specimen"
            label="Specimen"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.name = child.props.dname;
                props.values.partsPreserved = child.props.dpartspreserved ? JSON.parse(child.props.dpartspreserved) : [];
                props.values.notableFeatures = child.props.dnotablefeatures ? JSON.parse(child.props.dnotablefeatures) : [];
                props.values.preservationModes = child.props.dpreservationmodes ? JSON.parse(child.props.dpreservationmodes) : [];
                props.values.describedBy = child.props.ddescribedby ? JSON.parse(child.props.ddescribedby) : [];
                props.values.repository = child.props.drepository ? child.props.drepository : '';
                props.values.otherRepositoryLink = child.props.dotherrepositorylink ? child.props.dotherrepositorylink : '';
                props.values.notes = child.props.dnotes ? child.props.dnotes : '';
                props.values.gbifID = child.props.dgbifid ? child.props.dgbifid : '';
                props.values.idigbiouuid = child.props.didigbiouuid ? child.props.didigbiouuid : '';
                props.values.idigbioInstitutionCode = child.props.didigbioinstitutioncode ? child.props.didigbioinstitutioncode : '';
                props.values.idigbioCatalogNumber = child.props.didigbiocatalognumber ? child.props.didigbiocatalognumber : '';
                props.values.pbdbcid = child.props.dpbdbcid ? child.props.dpbdbcid : '';
                props.values.pbdboccid = child.props.dpbdboccid ? child.props.dpbdboccid : '';
                props.values.public =  "true"===child.props.dpublic;;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.values.collection = child.props.dcollection ? child.props.dcollection : '';
                props.values.identifiers = child.props.didentifiers ? JSON.parse(child.props.didentifiers) : [];
                props.handleChange(event);
            }}
        >
            {specimens.map((specimen) => (
                <MenuItem 
                    key={specimen.pbotID} 
                    value={specimen.pbotID}
                    dname={specimen.name}
                    dpartspreserved={specimen.partsPreserved ? JSON.stringify(specimen.partsPreserved.map(organ => organ.pbotID)) : null}
                    dnotablefeatures={specimen.notableFeatures ? JSON.stringify(specimen.notableFeatures.map(feature => feature.pbotID)) : null}
                    dpreservationmodes={specimen.preservationModes ? JSON.stringify(specimen.preservationModes.map(p => p.pbotID)) : null}
                    ddescribedby={specimen.describedBy ? JSON.stringify(specimen.describedBy.map(d => d.Description.pbotID)) : ''}
                    drepository={specimen.repository}
                    dotherrepositorylink={specimen.otherRepositoryLink}
                    dnotes={specimen.notes}
                    dgbifid={specimen.gbifID}
                    didigbiouuid={specimen.idigbiouuid}
                    didigbioinstitutioncode={specimen.idigbioInstitutionCode}
                    didigbiocatalognumber={specimen.idigbioCatalogNumber}
                    dpbdbcid={specimen.pbdbcid}
                    dpbdboccid={specimen.pbdboccid}
                    dpublic={specimen.elementOf && specimen.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={specimen.elementOf ? JSON.stringify(specimen.elementOf.map(group => group.pbotID)) : null}
                    dreferences={specimen.references ? JSON.stringify(specimen.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                    dcollection={specimen.collection ? specimen.collection.pbotID : ''}
                    didentifiers={specimen.identifiers ? JSON.stringify(specimen.identifiers) : null}
                >{specimen.name}</MenuItem>
            ))}
        </Field>
    )
}
*/

const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    console.log(props.type);
    const descriptionGQL = gql`
            query {
                Description {
                    pbotID
                    name
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: descriptionLoading, error: descriptionError, data: descriptionData } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

    if (descriptionLoading) return <p>Loading...</p>;
    if (descriptionError) return <p>Error :(</p>;
                                 
    console.log(descriptionData);
    let descriptions = [...descriptionData.Description];
    
    return (
        <Field 
            component={TextField}
            type="text"
            name="describedBy"
            label="Described by"
            fullWidth
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
            defaultValue=""
        >
            {alphabetize(descriptions, "name").map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )        
}

const SpecimenMutateForm = ({handleSubmit, mode}) => {
    //const [values, setValues] = useState({});
    const initValues = {
                specimen: '',
                name: '',
                partsPreserved: [],
                notableFeatures: [],
                preservationModes: [],
                describedBy: [],
                repository: '',
                otherRepositoryLink: '',
                notes: '',
                identifiers: [],
                idigbiouuid: '',
                idigbioInstitutionCode: '',
                idigbioCatalogNumber: '',
                pbdbcid: '',
                pbdboccid: '',
                references: [],
                collection: '',
                cascade: false,
                mode: mode,
    };    

    //To clear form when mode changes (this and the innerRef below). formikRef points to the Formik DOM element, 
    //allowing useEffect to call resetForm
    const formikRef = React.useRef();
    React.useEffect(() => {
        if (formikRef.current) {
            formikRef.current.resetForm({values:initValues});
        }
    },[mode]);

    const [selectedTab, setSelectedTab] = React.useState('1');
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                partsPreserved: Yup.array().of(Yup.string()).min(1, "At least one part is required"),
                notableFeatures: Yup.array().of(Yup.string()),
                preservationModes: Yup.array().of(Yup.string()).min(1, "At least one preservation mode is required"),
                repository: Yup.string().required(),
                otherRepositoryLink: Yup.string(),
                notes: Yup.string(),
                //identifiers: Yup.array().of(Yup.string()),
                //gbifID: Yup.string(),
                /*
                gbifID: Yup.string().test(
                    'isgbifID', 
                    ({message}) => `${message}`,
                    async (value, context) => {
                        if (!value) return true;
                        let url = `https://api.gbif.org/v1/occurrence/${value}`;
                        console.log(url)
                        try {
                            const response = await fetch(url);
                            if (response.ok) {
                                return true;
                            } else {
                                   return context.createError({message: `ID not found in GBIF.`})
                            } 
                        } catch (error) {
                            console.error("GBIF fetch error", error);
                            return context.createError({message: "Network error, unable to access GBIF"})
                        }
                }),
                */
                //idigbiouuid: Yup.string().uuid('Must be a valid uuid'),
                idigbioInstitutionCode: Yup.string(),
                idigbioCatalogNumber: Yup.string(),
                idigbiouuid: Yup.string().test(
                    'isidigbiouuid', 
                    ({message}) => `${message}`,
                    async (value, context) => {
                        if (!value) return true;
                        let url = `https://search.idigbio.org/v2/search/records?rq={"uuid":"${value}"}`;
                        console.log(url)
                        try {
                            const response = await fetch(url);
                            const json = await response.json();
                            console.log(json)
                            if (response.ok && json.itemCount > 0) {
                                return true;
                            } else {
                                   return context.createError({message: `UUID not found in iDigBio.`})
                            } 
                        } catch (error) {
                            console.error("iDigBio fetch error", error);
                            return context.createError({message: "Network error, unable to access iDigBio"})
                        }
                }),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                identifiers: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Identifier name is required'),
                        
                    })
                ),
                public: Yup.boolean(),
                collection: Yup.string().required(),
                images: Yup.array().of(
                    Yup.object().shape({
                        image: Yup.mixed().required('Image file is required'),
                        order: Yup.string()
                            .required('Image order is required')
                            .typeError('Image order is required')
                    })
                ),
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
                    component={TextField}
                    name="mode" 
                    sx={{display:"none"}}
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        {/*<SpecimenSelect values={props.values} handleChange={props.handleChange}/>
                        <br />*/}
                        <SpecimenSelect name="specimen" label="Specimen" populateMode="full" />
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.specimen !== '')) &&
                    <div>
                    
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
                            >
                            </Field>
                            <br />
                        
                            <CollectionSelect name="collection" label="Collection"/>
                            <br />

                            <PartsPreservedSelect />
                            <br />

                            <PreservationModeSelect />
                            <br />

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

                            {/*Note: Specimens inherit groups from their Collection*/}

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

                            <TabContext value={selectedTab}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList 
                                        textColor="secondary" 
                                        indicatorColor="secondary" 
                                        onChange={handleTabChange} 
                                        aria-label="optional tabs"
                                    >
                                        <Tab label="Other" value="1"/>
                                        <Tab label="iDigBio" value="2"/>
                                    </TabList>
                                </Box>
                                <TabPanel value="1">

                                    <NotableFeaturesSelect />
                                    <br />
                
                                    <ReferenceManager values={props.values} optional={true}/>

                                    <PersonManager label="Identified by" name="identifiers" omitOrder={true} optional={true} values={props.values} handleChange={props.handleChange}/>

                                    <Field
                                        component={SensibleTextField}
                                        type="text"
                                        name="otherRepositoryLink"
                                        label="Other repository link"
                                        fullWidth 
                                        disabled={false}
                                    >
                                    </Field>
                                    <br />

                                    <Field
                                        component={SensibleTextField}
                                        type="text"
                                        name="notes"
                                        label="Notes"
                                        multiline={true}
                                        fullWidth 
                                        disabled={false}
                                    >
                                    </Field>
                                    <br />
                                </TabPanel>
                                <TabPanel value="2">
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

                                </TabPanel>
                            </TabContext>

                        </AccordionDetails>
                    </Accordion>
                        
                    </div>
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

export default SpecimenMutateForm;
