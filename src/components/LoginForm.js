import React, { useState, useRef }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Box } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

const host = window.location.host;

const LoginForm = ({ setToken, setShowRegistration }) => {
    //const [username, setUserName] = useState();
    //const [password, setPassword] = useState();
    console.log(host);
    const loginUser = async (credentials) => {
        return fetch('http://' + host + '/login', {
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
            if (data.token) {
                return { ok: true, token: data.token}
            } else if (data.msg) {
                return { ok: false, message: data.msg}
            } else {
                throw new Error("Unrecognized message from server");
            }
        })
        .catch(error => {
            console.log(error);
            return {ok: false, message: "Network error"}; //Could be anything, really
        })
    }

    const [resetStatus, setResetStatus] = useState();
    const resetPassword = async (credentials) => {
        return fetch('http://' + host + '/lreset', {
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
                console.log("msg");
                if (data.code && data.code !== 200) {
                    setResetStatus({ok: false, message:data.msg});
                    return {ok: false, message:data.msg}; //Doesn't do anything
                } else {
                    setResetStatus({ok: true, message: data.msg});
                    return { ok: true, message: data.msg}; //Also pointless
                }
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
        console.log(values.userName);
        
        const loginResult = await loginUser({
            username: values.userName,
            password: values.password
        });
        
        if (loginResult.ok) {
            localStorage.setItem('PBOTMutationToken', loginResult.token);
            setToken(loginResult.token);
        } else {
            console.log("else");
            setStatus({error: loginResult.message}); //TODO: figure out how Formik setStatus works
        }
    }
    
    //TODO: try out styled-components
    const apiErrorStyle = {
        color: 'red'
    };
    
    const ref = useRef(null);

    let reset = 
        <Button variant="text" color="secondary" onClick={() => {resetPassword({username: ref.current.values.userName});}}>Reset Password</Button>;
    if (resetStatus) {
        if (resetStatus.ok) {
            reset = 
                <div>{resetStatus.message}</div>
        } else {
            reset = 
                <div>
                <Button variant="text" color="secondary" onClick={() => {resetPassword({username: ref.current.values.userName});}}>Reset Password</Button>
                <div style={apiErrorStyle}>{resetStatus.message}</div>
                </div>;
        }
    } 
    
    return(
        <div>
        <h2>Mutations require authentication</h2>
        <Formik
            innerRef= {ref}
            initialValues={{
                userName: '', 
                password: '', 
            }}
            validationSchema={Yup.object({
                userName: Yup.string()
                    .required("User Name is required")
                    .max(30, 'Must be 30 characters or less'),
                password: Yup.string()
                    .required("Password is required")
                    .min(6, "Passwords must contain at least six characters")
                    .max(30, 'Must be 30 characters or less'),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords must match')
            })}
            onSubmit={handleSubmit}/*({values => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleSubmit(values);
                setStatus("Oh no!");
            }}*/
        >
        {({ status }) => (
        <Form>
                <Field 
                    component={TextField}
                    name="userName" 
                    type="text"
                    label="User Name"
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
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Login</Button>
                <br />
                <br />
                {status && status.error && (
                    <div style={apiErrorStyle}>{status.error}</div>
                )}
            </Form>
            )}
        </Formik>
        <Button variant="text" color="secondary" onClick={() => {setShowRegistration(true);}}>Register</Button>
        <br />
        {reset}
        </div>
    );
};

export default LoginForm;

