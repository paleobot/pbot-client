import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';

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
                memberOf {
                    pbotID
                }
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
            onChange={(event,child) => {
                //props.resetForm();
                props.values.given = child.props.dgiven || '';
                props.values.surname = child.props.dsurname || '';
                props.values.email = child.props.demail || '';
                props.values.orcid = child.props.dorcid || '';
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.handleChange(event);
            }}
        >
            {persons.map((person) => (
                <MenuItem 
                    key={person.pbotID} 
                    value={person.pbotID}
                    dsurname={person.surname}
                    dgiven={person.given}
                    demail={person.email}
                    dorcid={person.orcid}
                    dgroups={person.memberOf ? JSON.stringify(person.memberOf.map(group => group.pbotID)) : null}
                >{person.given} {person.surname}</MenuItem>
            ))}
        </Field>
    )
}

const PersonMutateForm = ({handleSubmit, setShowResult, mode}) => {
    const initValues = {
        person: '',
        given: '',
        surname: '',
        email: '',
        orcid: '',
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
                //handleSubmit(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                given: Yup.string().required(),
                surname: Yup.string().required(),
                email: Yup.string().email(),
                groups: Yup.array().of(Yup.string()).required(),
            })}
            onSubmit={(values, {resetForm}) => {
                values.mode = mode;
                handleSubmit(values);
                setShowResult(true);
                resetForm({values:initValues});
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

export default PersonMutateForm;
