import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Grid, Button } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import { Navigate, useNavigate } from 'react-router-dom';
import { SensibleTextField } from './SensibleTextField.js';

const origin = window.location.origin;

const RegisterForm = ({ setShowRegistration }) => {
    //const [username, setUserName] = useState();
    //const [password, setPassword] = useState();
    const [showUseExistingUser, setshowUseExistingUser] = useState(false);
    const navigate = useNavigate();

    const registerUser = async (credentials) => {
        return fetch(origin + '/register', {
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
        //setShowRegistration(false);
        navigate("/query");
    }
            
    const handleSubmit = async (values, {setStatus}) => {
        console.log(values.givenName);
        
        const result = await registerUser(values);
        
        if (result.ok) {
            //setShowRegistration(false);
            navigate("/login?newReg=true");
        } else {
            setStatus({error: result.message});
            if (result.message === "Unregistered user with that email found") {
                setshowUseExistingUser(true);
            }
        }
        /*
        const registerResult = await registerUser({
            givenname: values.givenName,
            surname: values.surname,
            email: values.email,
            password: values.password
        });
        
        if (registerResult.ok) {
            //localStorage.setItem('PBOTMutationToken', loginResult.token);
            setToken(loginResult.token);
        } else {
            console.log("else");
            setStatus({error: resigterResult.message}); //TODO: figure out how Formik setStatus works
        }
        */
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
        <h2>Register for PBOT</h2>
        <Formik
            initialValues={{
                givenName: '',
                middleName: '',
                surname: '',
                email: '', 
                reason: '',
                bio: '',
                orcid: '',
                password: '', 
                confirmPassword: '',
                useExistingUser: false,
            }}
            validationSchema={Yup.object({
                givenName: Yup.string()
                    .required("Given Name is required")
                    .max(30, 'Must be 30 characters or less'),
                middleName: Yup.string()
                    .max(30, 'Must be 30 characters or less'),
                surname: Yup.string()
                    .required("Surname is required")
                    .max(30, 'Must be 30 characters or less'),
                email: Yup.string()
                    .required("Email is required")
                    .max(30, 'Must be 30 characters or less')
                    .email("Must be a valid email address"),
                reason: Yup.string()
                    .required("Reason is required"),
                bio: Yup.string(),
                orcid: Yup.string().matches(/https:\/\/orcid.org\/\d{4}-\d{4}-\d{4}-\d{4}/, {message: "not a valid orcid"}),
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
                    name="middleName" 
                    type="text"
                    label="Middle Name/Initial"
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
                    name="reason" 
                    type="text"
                    label="Why do you want a PBot account?"
                    multiline
                    disabled={false}
                />
                <br />

                <Field 
                    component={SensibleTextField}
                    name="bio" 
                    type="text"
                    label="Short bio"
                    multiline
                    disabled={false}
                />
                <br />

                <Field
                    component={SensibleTextField}
                    type="text"
                    name="orcid"
                    label="ORCID"
                    fullWidth 
                    prefix="https://orcid.org/"
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

