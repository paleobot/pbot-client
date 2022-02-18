import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@material-ui/core';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

const host = window.location.host;

const RegisterForm = ({ setShowRegistration }) => {
    //const [username, setUserName] = useState();
    //const [password, setPassword] = useState();
    const [showUseExistingUser, setshowUseExistingUser] = useState(false);
    
    const registerUser = async (credentials) => {
        return fetch('http://' + host + '/register', {
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
    
    const handleSubmit = async (values, {setStatus}) => {
        console.log(values.givenName);
        
        const result = await registerUser(values);
        
        if (result.ok) {
            setShowRegistration(false);
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
                surname: '',
                email: '', 
                password: '', 
                confirmPassword: '',
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
                    component={TextField}
                    name="givenName" 
                    type="text"
                    label="Given Name"
                    disabled={false}
                />
                <br />

                <Field 
                    component={TextField}
                    name="surname" 
                    type="text"
                    label="Surname"
                    disabled={false}
                />
                <br />

                <Field 
                    component={TextField}
                    name="email" 
                    type="text"
                    label="Email"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="password" 
                    type="password" 
                    label="Password"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="confirmPassword" 
                    type="password" 
                    label="Confirm password"
                    disabled={false}
                />
                <br />

                {existingUserCheckbox}
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Register</Button>
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

