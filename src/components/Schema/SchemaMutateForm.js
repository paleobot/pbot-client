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

const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Schema {
                schemaID
                title
                year
                cites {
                    referenceID
                }
                authoredBy {
                    personID
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
            onChange={event => {
                //props.resetForm();
                props.values.title = event.currentTarget.dataset.title || '';
                props.values.year = event.currentTarget.dataset.year || '';
                props.values.references = event.currentTarget.dataset.references ? JSON.parse(event.currentTarget.dataset.references) : [];
                props.values.authors = event.currentTarget.dataset.authors ? JSON.parse(event.currentTarget.dataset.authors) : [];
                props.handleChange(event);
            }}
        >
            {schemas.map((schema) => (
                <MenuItem 
                    key={schema.schemaID} 
                    value={schema.schemaID}
                    data-title={schema.title}
                    data-year={schema.year}
                    data-references={schema.cites ? JSON.stringify(schema.cites.map(reference => reference.referenceID)) : null}
                    data-authors={schema.authoredBy ? JSON.stringify(schema.authoredBy.map(author => author.personID)) : null}
                >{schema.title}</MenuItem>
            ))}
        </Field>
    )
}

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

const SchemaMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                schema: '', 
                title: '',
                year: '',
                references: [],
                authors: [],
    };
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={initValues}
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
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>

                {mode === "edit" &&
                    <div>
                        <SchemaSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.schema !== '')) &&
                <div>
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
