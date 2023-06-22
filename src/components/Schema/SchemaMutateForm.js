import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import {AuthorManager} from '../Person/AuthorManager.js';
import {PartsPreservedSelect} from '../Organ/PartsPreservedSelect.js';
import { NotableFeaturesSelect } from '../Specimen/NotableFeaturesSelect.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";
import { PersonManager } from '../Person/PersonManager.js';
import { SensibleTextField } from '../SensibleTextField.js';

const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    const gQL = gql`
        query {
            Schema {
                pbotID
                title
                year
                acknowledgments
                purpose
                partsPreserved {
                    pbotID
                }
                notableFeatures {
                    pbotID
                }
                references {
                    Reference {
                        pbotID
                    }
                    order
                }
                elementOf {
                    name
                    pbotID
                }
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Schema results<<<<<<<<<<<<<");
    console.log(data.Schema);
    const schemas = alphabetize([...data.Schema], "title");
    console.log(schemas);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="schema"
            label="Schema"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.title = child.props.dtitle || '';
                props.values.year = child.props.dyear || '';
                props.values.acknowledgments = child.props.dacknowledgments || '';
                props.values.purpose = child.props.dpurpose || '';
                props.values.partsPreserved = child.props.dpartspreserved ? JSON.parse(child.props.dpartspreserved) : [];
                props.values.notableFeatures = child.props.dnotablefeatures ? JSON.parse(child.props.dnotablefeatures) : [];
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.values.public = "true" === child.props.dpublic || false;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.handleChange(event);
            }}
        >
            {schemas.map((schema) => (
                <MenuItem 
                    key={schema.pbotID} 
                    value={schema.pbotID}
                    dtitle={schema.title}
                    dyear={schema.year}
                    dacknowledgments={schema.acknowledgments}
                    dpurpose={schema.purpose}
                    dpartspreserved={schema.partsPreserved ? JSON.stringify(schema.partsPreserved.map(organ => organ.pbotID)) : null}
                    dnotablefeatures={schema.notableFeatures ? JSON.stringify(schema.notableFeatures.map(feature => feature.pbotID)) : null}
                    dreferences={schema.references ? JSON.stringify(schema.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                    dpublic={schema.elementOf && schema.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={schema.elementOf ? JSON.stringify(schema.elementOf.map(group => group.pbotID)) : null}
                >{schema.title}</MenuItem>
            ))}
        </Field>
    )
}

const SchemaMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                schema: '', 
                title: '',
                year: '',
                acknowledgments: '',
                purpose: '',
                partsPreserved: [],
                notableFeatures: [],
                references: [{
                    pbotID: '',
                }],
                public: true,
                groups: [],
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
    });
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                title: Yup.string().required(),
                year: Yup.date().required(),
                acknowledgments: Yup.string(),
                purpose: Yup.string().required(),
                partsPreserved: Yup.array().of(Yup.string()).min(1, "At least one part is required"),
                notableFeatures: Yup.array().of(Yup.string()),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference is required'),
                    })
                ).min(1, "Reference is required"),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
            })}
            onSubmit={(values, {resetForm}) => {
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
                        <SchemaSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.schema !== '')) &&
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

                            <ReferenceManager values={props.values} single/>
                            <br />

                            <Field 
                                component={CheckboxWithLabel}
                                name="public" 
                                type="checkbox"
                                Label={{label:"Public"}}
                                disabled={(mode === "edit" && props.values.origPublic)}
                            />
                            <br />
                            
                            {!props.values.public &&
                            <div>
                                <GroupSelect />
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

                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="acknowledgments"
                                label="Acknowledgments"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <NotableFeaturesSelect />
                            <br />

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

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default SchemaMutateForm;
