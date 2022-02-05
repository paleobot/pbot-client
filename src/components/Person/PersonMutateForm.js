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

const PersonSelect = (props) => {
    console.log("PersonSelect");
    console.log(props);
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Person {
                pbotID
                given
                surname
                email
                orcid
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {schemaID: props.values.schema}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Results<<<<<<<<<<<<<");
    console.log(data.Person);
    const persons = alphabetize([...data.Person], "surname");
    console.log(persons);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="person"
            label="Person"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={event => {
                //props.resetForm();
                props.values.given = event.currentTarget.dataset.given || '';
                props.values.surname = event.currentTarget.dataset.surname || '';
                props.values.email = event.currentTarget.dataset.email || '';
                props.values.orcid = event.currentTarget.dataset.orcid || '';
                props.handleChange(event);
            }}
        >
            {persons.map((person) => (
                <MenuItem 
                    key={person.pbotID} 
                    value={person.pbotID}
                    data-surname={person.surname}
                    data-given={person.given}
                    data-email={person.email}
                    data-orcid={person.orcid}
                >{person.given} {person.surname}</MenuItem>
            ))}
        </Field>
    )
}

const PersonMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                person: '',
                given: '',
                surname: '',
                email: '',
                orcid: '',
                mode: mode,
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
                given: Yup.string().required(),
                surname: Yup.string().required(),
                email: Yup.string().email(),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
                resetForm({values:initValues});
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
                        <PersonSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.person !== '')) &&
                <div>
                <Field
                    component={TextField}
                    type="text"
                    name="given"
                    label="Given"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <Field
                    component={TextField}
                    type="text"
                    name="surname"
                    label="Surname"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <Field
                    component={TextField}
                    type="text"
                    name="email"
                    label="Email"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <Field
                    component={TextField}
                    type="text"
                    name="orcid"
                    label="ORCID"
                    fullWidth 
                    disabled={false}
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

export default PersonMutateForm;
