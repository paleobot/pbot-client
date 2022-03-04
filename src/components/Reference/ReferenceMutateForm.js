import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const ReferenceSelect = (props) => {
    console.log("ReferenceSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Reference {
                pbotID
                title
                publisher
                year
                doi
                authoredBy {
                    pbotID
                    given 
                    surname
                }
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Reference results<<<<<<<<<<<<<");
    console.log(data.Reference);
    const references = alphabetize([...data.Reference], "title");
    console.log(references);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="reference"
            label="Reference"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={event => {
                //props.resetForm();
                props.values.title = event.currentTarget.dataset.title || '';
                props.values.publisher = event.currentTarget.dataset.publisher || '';
                props.values.year = event.currentTarget.dataset.year || '';
                props.values.doi = event.currentTarget.dataset.doi || '';
                props.values.authors = event.currentTarget.dataset.authors ? JSON.parse(event.currentTarget.dataset.authors) : [];
                props.handleChange(event);
            }}
        >
            {references.map((reference) => (
                <MenuItem 
                    key={reference.pbotID} 
                    value={reference.pbotID}
                    data-title={reference.title}
                    data-publisher={reference.publisher}
                    data-year={reference.year}
                    data-doi={reference.doi}
                    data-authors={reference.authoredBy ? JSON.stringify(reference.authoredBy.map(author => author.pbotID)) : null}
                >{reference.title + ", " + reference.publisher + ", " + reference.year}</MenuItem>
            ))}
        </Field>
    )
}

const AuthorSelect = (props) => {
    console.log("AuthorSelect");
    const gQL = gql`
            query {
                Person {
                    pbotID
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
            {authors.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}

const ReferenceMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                reference: '',
                title: '',
                publisher: '',
                year: '',
                authors: [],
                doi: '',
                group: '',
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
    return (
       
        <Formik
            innerRef={formikRef}
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
                publisher: Yup.string().required(),
                year: Yup.date().required(),
                authors: Yup.array().of(Yup.string()).required(),
                group: Yup.string().required(),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>

                <Field 
                    component={TextField}
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <ReferenceSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.reference !== '')) &&
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
                    name="publisher"
                    label="Publisher"
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

                <AuthorSelect />
                <br />
                
                <Field
                    component={TextField}
                    type="text"
                    name="doi"
                    label="DOI"
                    fullWidth 
                    disabled={false}
                />

                <GroupSelect />
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

export default ReferenceMutateForm;
