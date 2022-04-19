import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
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
                    Person {
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
                props.values.public = "true"=== event.currentTarget.dataset.public || false;
                props.values.origPublic = props.values.public;
                props.values.groups = event.currentTarget.dataset.groups ? JSON.parse(event.currentTarget.dataset.groups) : [];
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
                    data-authors={reference.authoredBy ? JSON.stringify(reference.authoredBy.map(author => {return {pbotID: author.Person.pbotID, order: author.order}})) : null}
                    data-public={reference.elementOf && reference.elementOf.reduce((acc,group) => {return "public" === group.name}, false)}
                    data-groups={reference.elementOf ? JSON.stringify(reference.elementOf.map(group => group.pbotID)) : null}
                >{reference.title + ", " + reference.publisher + ", " + reference.year}</MenuItem>
            ))}
        </Field>
    )
}

const AuthorSelect = (props) => {
    console.log("AuthorSelect");
    const gQL = gql`
            query {
                Person (filter: {AND: [{given_not: "guest"}, {surname_not: "guest"}]}) {
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
            name={props.name}
            label="Name"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
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
                authors: [{
                    pbotID: '',
                    order:'',
                }],
                doi: '',
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
                //authors: Yup.array().of(Yup.string()).min(1, "Must specify at least one author"),
                authors: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Author name is required'),
                        order: Yup.string()
                            .required('Author order is required')
                    })
                ).min(1, "Must specify at least one author"),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
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

                <br />
                <InputLabel>
                    Authors
                </InputLabel>
                <FieldArray name="authors">
                    {({ insert, remove, push }) => (
                    <div>
                    <Grid container direction="column">
                        {props.values.authors.length > 0 &&
                            props.values.authors.map((author, index) => { 
                                //props.values.authors[index].order = index+1; 
                                return (
                                    <Grid container spacing={2} direction="row" key={index}>
                                        <Grid item xs={6}>
                                            <AuthorSelect name={`authors.${index}.pbotID`}/>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Field
                                                component={TextField}
                                                name={`authors.${index}.order`}
                                                label="Order"
                                                type="text"
                                                //disabled={props.values.authors[index].name === ''}
                                            />
                                        </Grid>
                                        {index > 0 &&
                                        <Grid item xs={3}>
                                            <Button
                                                type="button"
                                                variant="text" 
                                                color="secondary" 
                                                size="large"
                                                onClick={() => remove(index)}
                                                //disabled={props.values.authors[index].name === ''}
                                            >
                                                X
                                            </Button>
                                        </Grid>
                                        }
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Button
                            type="button"
                            variant="text" 
                            color="secondary" 
                            onClick={() => push({ pbotID: '', order: '' })}
                            disabled={props.values.authors.length !== 0 && props.values.authors[props.values.authors.length-1].pbotID === ''}
                        >
                            Add author
                        </Button>
                    </div>
                    )}
                </FieldArray>

                <Field
                    component={TextField}
                    type="text"
                    name="doi"
                    label="DOI"
                    fullWidth 
                    disabled={false}
                />

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
