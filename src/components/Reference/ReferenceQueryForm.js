import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import {PublicationTypeSelect} from './PublicationTypeSelect.js';
import JournalFields from './ReferenceFieldComponents/JournalFields.js'
import StandaloneBookFields from './ReferenceFieldComponents/StandaloneBookFields.js'
import EditedCollectionFields from './ReferenceFieldComponents/EditedCollectionFields.js'
import ContributedArticleFields from './ReferenceFieldComponents/ContributedArticleFields.js'
import UnpublishedFields from './ReferenceFieldComponents/UnpublishedFields.js'

const ReferenceQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
        referenceID: '', 
        title: '', 
        publicationType:  '',
        firstPage:  '',
        lastPage:  '',
        journal:  '',
        publicationVolume:  '',
        publicationNumber: '',
        bookTitle: '',
        publisher: '',
        bookType: '',
        editors:  '',
        year: '', 
        doi: '',
        pbdbid: '',
        groups: [],
        public: false,
    };
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
                schemaID: Yup.string()
                .uuid('Must be a valid uuid'),
                title: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                year: Yup.string()
                .max(4, 'Must be 4 characters or less'),
                publisher: Yup.string()
                .max(50, 'Must be 50 characters or less'),
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
                <PublicationTypeSelect />

                {props.values.publicationType === "journal article" &&
                    <JournalFields values={props.values} query/>
                }       

                {props.values.publicationType === "standalone book" &&
                    <StandaloneBookFields values={props.values} query/>
                } 

                {props.values.publicationType === "edited book of contributed articles" &&
                    <EditedCollectionFields values={props.values} query/>
                }       

                {props.values.publicationType === "contributed article in edited book" &&
                    <ContributedArticleFields values={props.values} query/>
                }       

                {props.values.publicationType === "unpublished" &&
                    <UnpublishedFields values={props.values} query/>
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

export default ReferenceQueryForm;
