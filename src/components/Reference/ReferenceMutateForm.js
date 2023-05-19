import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, Link, IconButton, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Tooltip, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {AuthorManager} from '../Person/AuthorManager.js';
import {ReferenceSelect} from '../Reference/ReferenceSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import PBDBSelect from './PBDBSelect.js';
import { PersonManager } from '../Person/PersonManager.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SensibleTextField } from '../SensibleTextField.js';
import { publicationTypes } from "../Collection/Lists.js"

const PublicationTypeSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="publicationType"
            label="Publication type !"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {publicationTypes.map((pt) => (
                <MenuItem 
                    key={pt} 
                    value={pt}
                >{pt}</MenuItem>
            ))}
        </Field>
    )
}


const ReferenceMutateForm = ({handleSubmit, mode}) => {
    
    const initValues = {
                reference: '',
                title: '',
                publisher: '',
                year: '',
                authors: [{
                    pbotID: '',
                    order:'',
                    searchName:'',
                }],
                doi: '',
                pbdbid: '',
                public: true,
                groups: [],
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
                publisher: Yup.string().required(),
                year: Yup.date().required(),
                //authors: Yup.array().of(Yup.string()).min(1, "Must specify at least one author"),
                authors: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Author name is required'),
                        order: Yup.string()
                            .required('Author order is required')
                            .typeError('Author order is required'),
                        searchName: Yup.string(),
                    })
                ).min(1, "Must specify at least one author"),
                public: Yup.boolean(),
                doi: Yup.string(),
                pbdbid: Yup.string(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
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
                    <>
                        <ReferenceSelect name="reference" />
                        <br />
                    </>            
                }
                
                {(mode === "create" || (mode === "edit" && props.values.reference !== '')) &&
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
                                component={TextField}
                                type="text"
                                name="title"
                                label="Title"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <PublicationTypeSelect />
                            <br />
                            
                            <Field
                                component={TextField}
                                type="text"
                                name="year"
                                label="Year"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={TextField}
                                type="text"
                                name="firstPageNumber"
                                label="First page number !"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={TextField}
                                type="text"
                                name="lastPageNumber"
                                label="Last page number !"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <PersonManager label="Authors" name="authors" values={props.values} handleChange={props.handleChange}/>

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

                    <Accordion style={accstyle} defaultExpanded={false}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="required-content"
                            id="required-header"                        
                        >
                            Optional fields
                        </AccordionSummary>
                        <AccordionDetails>

                            <Field
                                component={TextField}
                                type="text"
                                name="serialName"
                                label="Serial name !"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={TextField}
                                type="text"
                                name="publicationVolume"
                                label="Publication volume !"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={TextField}
                                type="text"
                                name="editors"
                                label="Editors !"
                                fullWidth 
                                disabled={false}
                            />
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
                                
                            <Field
                                component={TextField}
                                type="text"
                                name="notes"
                                label="Notes !"
                                fullWidth 
                                multiline
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={TextField}
                                type="text"
                                name="doi"
                                label="DOI"
                                fullWidth 
                                disabled={false}
                            />
                            <br />
                            
                        </AccordionDetails>
                    </Accordion>

                            
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

export default ReferenceMutateForm;
