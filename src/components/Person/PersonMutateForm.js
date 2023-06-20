import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import { SensibleTextField } from '../SensibleTextField.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import { PersonSelect } from './PersonSelect.js';

const PersonMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
        person: '',
        given: '',
        middle: '',
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
            validationSchema={Yup.object({
                given: Yup.string().required(),
                middle: Yup.string(),
                surname: Yup.string().required(),
                email: Yup.string().email(),
                groups: Yup.array().of(Yup.string()).required(),
            })}
            onSubmit={(values, {resetForm}) => {
                values.mode = mode;
                handleSubmit(values);
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
                        <PersonSelect name="person"/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.person !== '')) &&
                <div>
                <Field
                    component={SensibleTextField}
                    type="text"
                    name="given"
                    label="Given"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <Field
                    component={SensibleTextField}
                    type="text"
                    name="middle"
                    label="Middle name/initial"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <Field
                    component={SensibleTextField}
                    type="text"
                    name="surname"
                    label="Surname"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <Field
                    component={SensibleTextField}
                    type="text"
                    name="email"
                    label="Email"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <Field
                    component={SensibleTextField}
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
