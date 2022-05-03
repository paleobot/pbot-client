import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import {AuthorManager} from '../Person/AuthorManager.js';

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
                pbotID
                title
                year
                references {
                    Reference {
                        pbotID
                    }
                    order
                }
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
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.values.authors = child.props.dauthors ? JSON.parse(child.props.dauthors) : [];
                props.values.public = "true"=== child.props.dpublic || false;
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
                    dreferences={schema.references ? JSON.stringify(schema.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order}})) : null}
                    dauthors={schema.authoredBy ? JSON.stringify(schema.authoredBy.map(author => {return {pbotID: author.Person.pbotID, order: author.order}})) : null}
                    dpublic={schema.elementOf && schema.elementOf.reduce((acc,group) => {return "public" === group.name}, false)}
                    dgroups={schema.elementOf ? JSON.stringify(schema.elementOf.map(group => group.pbotID)) : null}
                >{schema.title}</MenuItem>
            ))}
        </Field>
    )
}

const SchemaMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                schema: '', 
                title: '',
                year: '',
                acknowledgments: '',
                references: [{
                    pbotID: '',
                    order:'',
                }],
                authors: [{
                    pbotID: '',
                    order:'',
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
                year: Yup.date().required(),
                acknowledgments: Yup.string(),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                //authors: Yup.array().of(Yup.string()).min(1, "Must specify at least one author"),
                authors: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Author name is required'),
                        order: Yup.string()
                            .required('Author order is required')
                            .typeError('Author order is required')
                    })
                ).min(1, "Must specify at least one author"),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
            })}
            onSubmit={(values, {resetForm}) => {
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

                <Field
                    component={TextField}
                    type="text"
                    name="acknowledgments"
                    label="Acknowledgments"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <ReferenceManager values={props.values}/>
                
                <AuthorManager values={props.values}/>

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

                {(mode === "delete") &&
                <div>
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        type="checkbox" 
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
