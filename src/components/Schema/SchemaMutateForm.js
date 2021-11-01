import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';
import { alphabetize } from '../../util.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const AuthorSelect = (props) => {
    console.log("AuthorSelect");
    const gQL = gql`
            query {
                Person {
                    personID
                    given
                    surname
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Person);
    
    const authors = alphabetize(
        data.Person.map(person => {
            const newPerson = {...person};
            console.log(newPerson);

            newPerson.name = person.given + " " + person.surname;
            return newPerson;
        }), 
    "surname");
    console.log(authors)
    
    return (
        <Field
            component={TextField}
            type="text"
            name="authors"
            label="Authors"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
        >
            {authors.map(({ personID, name }) => (
                <MenuItem key={personID} value={personID}>{name}</MenuItem>
            ))}
        </Field>
    )
}

const ReferenceSelect = (props) => {
    console.log("ReferenceSelect");
    const gQL = gql`
            query {
                Reference {
                    referenceID
                    title
                    publisher
                    year
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Reference);
    
    //const references = alphabetize([...data.Reference], "title");
    const references = alphabetize(
        data.Reference.map(reference => {
            const newRef = {...reference};
            console.log(newRef);

            newRef.name = reference.title + ", " + reference.publisher + ", " + reference.year;
            return newRef;
        }), 
    "name");
    console.log(references)
    
    return (
        <Field
            component={TextField}
            type="text"
            name="references"
            label="Reference"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
        >
            {references.map(({ referenceID, name }) => (
                <MenuItem key={referenceID} value={referenceID}>{name}</MenuItem>
            ))}
        </Field>
    )
}

const SchemaMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                title: '',
                year: '',
                references: [],
                authors: [],
            }}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                title: Yup.string().required(),
                year: Yup.date().required(),
                authors: Yup.array().of(Yup.string()).required(),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
                resetForm();
            }}
        >
            {props => (
            <Form>
                <Field
                    component={TextField}
                    type="text"
                    name="title"
                    label="Title"
                    fullWidth 
                    disabled={false}
                />
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

                <ReferenceSelect />
                <br />
                

                <AuthorSelect />
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

export default SchemaMutateForm;
