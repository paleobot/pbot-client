import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Grid, Button } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import { Navigate, useNavigate } from 'react-router-dom';
import { SensibleTextField } from './SensibleTextField.js';

const origin = window.location.origin;

const RegisterForm = ({ setShowRegistration }) => {
    const [showUseExistingUser, setshowUseExistingUser] = useState(false);
    const navigate = useNavigate();

    const registerUser = async (credentials) => {
        return fetch(origin + '/api/v1/users?signup=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(response => {
            console.log(response);
            //TODO: there is an "ok" built into the server response. Would be nice to check that here, rather than deferring to the next "then"
            return response.json()
        })
        .then(data => {
            console.log(data);
            if (data.msg) {
                const success = data.msg === "User created";
                return { ok: success, message: data.msg}
            } else {
                throw new Error("Unrecognized message from server");
            }
        })
        .catch(error => {
            console.log(error);
            return {ok: false, message: "Network error"}; //Could be anything, really
        })
    }

    //TODO: Look into pushing previous page in React Router so we can navigate back to there.
    
    const handleCancel = () => {       
        navigate("/login");
    }
            
    const handleSubmit = async (values, {setStatus}) => {
        console.log(values.givenName);
        
        const result = await registerUser({firstName: values.givenName, lastName: values.surname, email: values.email, password: values.password, organization: "AZlibrary", tos: true});
        
        if (result.ok) {
            navigate("/login?newReg=true");
        } else {
            setStatus({error: result.message});

            //TODO: Not sure if we will provide use existing user functionality. If we do, we need to set the checkbox.
            //if (result.message === "Unregistered user with that email found") {
            //    setshowUseExistingUser(true);
            //}
        }
    }
    
    //TODO: try out styled-components
    const apiErrorStyle = {
        color: 'red'
    };
    
    let existingUserCheckbox = showUseExistingUser ? (
            <div>
                <Field 
                    component={CheckboxWithLabel}
                    name="useExistingUser" 
                    type="checkbox"
                    Label={{label:"Use existing user"}}
                    disabled={false}
                />
                <br />
            </div>
        ) :
        '';


    return(
        <div>
        <h2>Register for AZlibrary Admin</h2>
        <Formik
            initialValues={{
                givenName: '',
                surname: '',
                email: '', 
                password: '', 
                confirmPassword: '',
                useExistingUser: false,
            }}
            validationSchema={Yup.object({
                givenName: Yup.string()
                    .required("Given Name is required")
                    .max(30, 'Must be 30 characters or less'),
                surname: Yup.string()
                    .required("Surname is required")
                    .max(30, 'Must be 30 characters or less'),
                email: Yup.string()
                    .required("Email is required")
                    .max(30, 'Must be 30 characters or less')
                    .email("Must be a valid email address"),
                password: Yup.string()
                    .required("Password is required")
                    .min(6, "Passwords must contain at least six characters")
                    .max(30, 'Must be 30 characters or less'),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            })}
            onSubmit={handleSubmit}
        >
        {({ status }) => (
        <Form>
                <Field 
                    component={SensibleTextField}
                    name="givenName" 
                    type="text"
                    label="Given Name"
                    disabled={false}
                />
                <br />

                <Field 
                    component={SensibleTextField}
                    name="surname" 
                    type="text"
                    label="Surname"
                    disabled={false}
                />
                <br />

                <Field 
                    component={SensibleTextField}
                    name="email" 
                    type="text"
                    label="Email"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={SensibleTextField}
                    name="password" 
                    type="password" 
                    label="Password"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={SensibleTextField}
                    name="confirmPassword" 
                    type="password" 
                    label="Confirm password"
                    disabled={false}
                />
                <br />

                {existingUserCheckbox}
                <br />
                <br />

                <Grid container spacing={1} style={{justifyContent: "center", align: "center"}}>
                    <Grid item>
                    <Button type="submit" variant="contained" color="primary">Register</Button>
                    </Grid>
                    <Grid item>
                    <Button type="button" variant="text" color="secondary" onClick={handleCancel}>Cancel</Button>
                    </Grid>
                </Grid>
            
                <br />
                <br />
                {status && status.error && (
                    <div style={apiErrorStyle}>{status.error}</div>
                )}
            </Form>
            )}
        </Formik>
        </div>
    );
};

export default RegisterForm;

