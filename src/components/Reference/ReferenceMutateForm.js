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
import { publicationTypes } from "../../Lists.js"
import JournalFields from './ReferenceFieldComponents/JournalFields.js'
import StandaloneBookFields from './ReferenceFieldComponents/StandaloneBookFields.js'
import EditedCollectionFields from './ReferenceFieldComponents/EditedCollectionFields.js'
import ContributedArticleFields from './ReferenceFieldComponents/ContributedArticleFields.js'
import UnpublishedFields from './ReferenceFieldComponents/UnpublishedFields.js'

const PublicationTypeSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="publicationType"
            label="Publication type"
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
                publicationType:  '',
                firstPage:  '',
                lastPage:  '',
                journal:  '',
                publicationVolume:  '',
                publicationNumber: '',
                publisher: '',
                description: '',
                bookType: '',
                editors:  '',
                notes:  '',
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
                title: Yup.string().when("publicationType", {
                    is: (val) => (
                        val === "journal article" || 
                        val === "standalone book" || 
                        val === "unpublished"
                    ),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                publicationType: Yup.string().required(),
                firstPage: Yup.number().integer().positive().when("publicationType", {
                    is: (val) => (
                        val === "standalone book" || 
                        val === "edited book of contributed articles" || 
                        val === "contributed article in edited book"
                    ),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                lastPage: Yup.number().integer().positive().when("publicationType", {
                    is: (val) => (
                        val === "standalone book" || 
                        val === "edited book of contributed articles" || 
                        val === "contributed article in edited book"
                    ),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                journal: Yup.string().when("publicationType", {
                    is: (val) => (val === "journal article"),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                publicationVolume: Yup.string().when("publicationType", {
                    is: (val) => (val === "journal article"),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                bookTitle: Yup.string().when("publicationType", {
                    is: (val) => (
                       val === "edited book of contributed articles" || 
                        val === "contributed article in edited book"
                    ),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                editors: Yup.string().when("publicationType", {
                    is: (val) => (
                       val === "edited book of contributed articles" || 
                        val === "contributed article in edited book"
                    ),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                publisher: Yup.string().when("publicationType", {
                    is: (val) => (
                        val === "standalone book" || 
                        val === "edited book of contributed articles" || 
                        val === "contributed article in edited book"
                    ),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                bookType: Yup.string().when("publicationType", {
                    is: (val) => (val === "standalone book"),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                description: Yup.string().when("publicationType", {
                    is: (val) => (val === "unpublished"),
                    then: (schema) => schema.required(),
                    otherwise: (schema) => schema
                }),
                notes: Yup.string(),
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
                    <>
                    <PublicationTypeSelect />

                    {props.values.publicationType === "journal article" &&
                        <JournalFields values={props.values} />
                    }       

                    {props.values.publicationType === "standalone book" &&
                        <StandaloneBookFields values={props.values} />
                    } 

                    {props.values.publicationType === "edited book of contributed articles" &&
                        <EditedCollectionFields values={props.values} />
                    }       

                    {props.values.publicationType === "contributed article in edited book" &&
                        <ContributedArticleFields values={props.values} />
                    }       

                    {props.values.publicationType === "unpublished" &&
                        <UnpublishedFields values={props.values} />
                    }       

                    </>
                }
                <br />
                            
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
