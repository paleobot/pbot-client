import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, Stack, TextField, MenuItem } from '@mui/material';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { CheckboxWithLabel } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
import { SensibleTextField } from '../SensibleTextField.js';
import { MultiManager } from '../MultiManager.js';

const authorShape = {
    person: null,
    givenname: null,
    surname: null,
    organization: null
};
const AuthorFields = (props) => {
    return (
        <Stack direction="column" spacing={0}>
            <Field
                component={SensibleTextField}
                type="text"
                name={`authors.${props.index}.person`}
                label="Person"
                style={{minWidth: "12ch", width:"100%"}}h
                disabled={false}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name={`authors.${props.index}.givenname`}
                label="Given name"
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name={`authors.${props.index}.surname`}
                label="Surname"
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name={`authors.${props.index}.organization`}
                label="Organization"
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
        </Stack>
    )
}    
           
const linkShape = {
    name: null,
    url: null,
};
const LinkFields = (props) => {
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <Field
                component={SensibleTextField}
                type="text"
                name={`links.${props.index}.name`}
                label="Name"
                style={{minWidth: "12ch", width:"35%"}}
                disabled={false}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name={`links.${props.index}.url`}
                label="URL"
                style={{minWidth: "12ch", width:"35%"}}
                disabled={false}
            />
        </Stack>
    )
}    

const keywordShape = {
    name: null,
    type: null,
};
const KeywordFields = (props) => {
    const formikProps = useFormikContext()
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <Field
                component={SensibleTextField}
                type="text"
                name={`keywords.${props.index}.name`}
                label="Name"
                style={{minWidth: "12ch", width:"35%"}}
                disabled={false}
            />
            {/*
            <Field
                component={SensibleTextField}
                type="text"
                name={`keywords.${props.index}.type`}
                label="URL"
                style={{minWidth: "12ch", width:"35%"}}
                disabled={false}
            />
            */}
            <Field
                component={TextField}
                type="text"
                name={`keywords.${props.index}.type`}
                label="Type"
                style={{minWidth: "12ch", width:"35%"}}
                select={true}
                SelectProps={{
                    multiple: false,
                }}
                onChange={(event,child) => {
                    //props.handleSelect(JSON.parse(child.props.dperson))
                    console.log("onchange")
                    console.log(event)
                    console.log(child)
                    formikProps.setFieldValue(`keywords.${props.index}.type`, event.target.value);
                }}
                disabled={false}
            >
                {["theme", "place", "temporal"].map((type, idx) => (
                    <MenuItem 
                        key={idx} 
                        value={type}
                    >{type}</MenuItem>
                ))}
            </Field>

        </Stack>
    )
}    

const CollectionMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
        collection: '', 
        title: '',
        collectiongroup: '',
        authors: [{
            person: null,
            givenname: null,
            surname: null,
            organization: null
        }],
        year: '',
        journal: {
            name: '',
            publisher: '',
            url: ''
        },
        series: '',
        abstract: '',
        informalname: '',
        links: [{
            name: null,
            url: null
        }],
        keywords: [{
            name: null,
            type: null
        }],
        language: 'English',
        license: {
            type: 'CC BY-NC-SA 4.0',
            url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
        },
        private: false,
        bondingbox: {
            west: -113,
            south: 33.5,
            east: -112,
            north: 34
        },
        documents: [],
        images: [],
        notes: [],
        metadata: [],
        gems2: [],
        ncgmp09: [],
        legacy: [],
        layers: [],
        raster: [],
        complete: ''
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
    const accstyle = {textAlign: "left", width: "100%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                title: Yup.string().required(),
                collectiongroup: Yup.string().required(),
                year: Yup.string().required(),
                authors: Yup.array().of(
                    Yup.object().shape({
                        person: Yup.string()
                            .required('Person is required'),
                        givenname: Yup.string()
                            .required('Given name is required'),
                        surname: Yup.string()
                            .required('Surname is required'),
                        organization: Yup.string().nullable(),
                    })
                ).min(1, 'At least one author is required'),
                journal: Yup.object().shape({
                    name: Yup.string(),
                    publisher: Yup.string(),
                    url: Yup.string(),
                }),
                series: Yup.string(),
                abstract: Yup.string(),
                informalname: Yup.string(),
                links: Yup.array().of(
                    Yup.object().shape({
                        name: Yup.string(),
                        url: Yup.string(),
                    })
                ),
                keywords: Yup.array().of(
                    Yup.object().shape({
                        name: Yup.string(),
                        type: Yup.string(),
                    })
                ),
                private: Yup.boolean(),
                boundingbox: Yup.object().shape({
                    west: Yup.number().min(-180).max(180),
                    south: Yup.number().min(-90).max(90),
                    east: Yup.number().min(-180).max(180),
                    north: Yup.number().min(-90).max(90),
                }),
                documents: Yup.array().of(Yup.string()),
                images: Yup.array().of(Yup.string()),
                notes: Yup.array().of(Yup.string()),
                metadata: Yup.array().of(Yup.string()),
                gems2: Yup.array().of(Yup.string()),
                ncgmp09: Yup.array().of(Yup.string()),
                legacy: Yup.array().of(Yup.string()),
                layers: Yup.array().of(Yup.string()),
                raster: Yup.array().of(Yup.string()),
                complete: Yup.string()
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
                
                {(mode === "edit" || mode === "delete" || mode === "replace") &&
                    <div>
                        {/*<CollectionSelect name="collection" label="Collection" populateMode="full"/>*/}
                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="collection"
                            label="Collection"
                            fullWidth 
                            disabled={false}
                        />
                        <br />
                    </div>
                }
                
                {(mode === "create" || ((mode === "edit" || mode === "replace") && props.values.collection !== '')) &&
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
                                name="title"
                                label="Title"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="year"
                                label="Year"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            {/*<CollectionGroupSelect />*/}
                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="collectiongroup"
                                label="Collection group"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

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

                            <MultiManager label="Authors" name="authors" content={AuthorFields} shape={authorShape} values={props.values} handleChange={props.handleChange} omitOrder={true}/>
                            <br />

                            <InputLabel>
                                Journal
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="journal.name"
                                    label="Name"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="journal.publisher"
                                    label="Publisher"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="journal.url"
                                    label="URL"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                            <br />

                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="series"
                                label="Series"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="abstract"
                                label="Abstract"
                                fullWidth 
                                multiline
                                rows={4}
                                disabled={false}
                                variant="outlined"
                                sx={{marginTop:"0.5em"}}
                            />
                            <br />
                           
                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="informalname"
                                label="Informal name"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <MultiManager label="Links" name="links" content={LinkFields} shape={linkShape} values={props.values} handleChange={props.handleChange} omitOrder={true}/>
                            <br />
                            {/*
                            <InputLabel sx={{marginTop: "1.5em"}}>
                                Links
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="links[0].name"
                                    label="Name"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="links[0].url"
                                    label="URL"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                            <br />
                            */}

                            <MultiManager label="Keywords" name="keywords" content={KeywordFields} shape={keywordShape} values={props.values} handleChange={props.handleChange} omitOrder={true}/>
                            <br />
                            {/*
                            <InputLabel sx={{marginTop: "1.5em"}}>
                                Keywords
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="keywords[0].name"
                                    label="Name"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="keywords[0].type"
                                    label="Type"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                            <br />
                            */}

                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="language"
                                label="Language"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <InputLabel sx={{ marginTop:"1.5em"}}>
                                License
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="license.type"
                                    label="Name"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="license.url"
                                    label="URL"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                            <br />

                            <Field 
                                component={CheckboxWithLabel}
                                name="private" 
                                type="checkbox"
                                Label={{label:"Private"}}
                                disabled={(mode === "edit" && props.values.private)}
                            />
                            <br />

                            <InputLabel>
                                Bounding box
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="west"
                                    label="West"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="south"
                                    label="South"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="east"
                                    label="East"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="north"
                                    label="North"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
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
