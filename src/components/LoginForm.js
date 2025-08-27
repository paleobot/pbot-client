import React, { useState, useRef }from 'react';
import * as Yup from 'yup';
import { Button, Box } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextFieldController } from './util/TextFieldController';

//const origin = window.location.origin;
const origin = process.env.REACT_APP_AZLIB_API_URL

const LoginForm = ({ /*setToken,*/ setShowRegistration }) => {

    const navigate = useNavigate();
    const [search] = useSearchParams();

    const {setToken} = useAuth();

    const initialValues= {
        userName: '', 
        password: '', 
    }

    const validationSchema= Yup.object().shape({
        userName: Yup.string()
            .required("User Name is required")
            .max(30, 'Must be 30 characters or less'),
        password: Yup.string()
            .required("Password is required")
            .min(6, "Passwords must contain at least six characters")
            .max(30, 'Must be 30 characters or less'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
    })

    const { handleSubmit, reset, control, watch, formState: {errors} } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
        trigger: "onBlur",
    });


    const loginUser = async (credentials) => {
        console.log("loginUser")
            //return { ok: true, token: "Hi there", pbotID: "none"}

        return fetch(origin + '/api/v1/login', {
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
        return fetch(origin + '/lreset', {
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
    
    const [status, setStatus] = useState(null);
    const doSubmit = async (values) => {
        console.log(values.userName);
        
        const loginResult = await loginUser({
            email: values.userName,
            password: values.password
        });

        //const loginResult = {
        //    ok: true,
        //    token: "Hi there",
        //    pbotID: "none"
        //}
        
        if (loginResult.ok) {
            localStorage.setItem('AzlibAdminToken', loginResult.token);
            setToken(loginResult.token);

            console.log("navigating to workbench")
            //navigate("/mutate");
            navigate("/");
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

    let resetPW = 
        <Button variant="text" color="secondary" onClick={() => {resetPassword({username: ref.current.values.userName});}}>Reset Password</Button>;
    if (resetStatus) {
        if (resetStatus.ok) {
            resetPW = 
                <div>{resetStatus.message}</div>
        } else {
            resetPW = 
                <div>
                <Button variant="text" color="secondary" onClick={() => {resetPassword({username: ref.current.values.userName});}}>Reset Password</Button>
                <div style={apiErrorStyle}>{resetStatus.message}</div>
                </div>;
        }
    } 
    
    return(
        <div>
            {search.get("newReg") &&
                <h2>Registration Successful. Please login.</h2>
            }
            <form onSubmit={handleSubmit(doSubmit)} >
                <TextFieldController name={`userName`} label="Email" control={control} errors={errors}/>
                <br />
                
                <TextFieldController type="password" name={`password`} label="Password" control={control} errors={errors}/>
                <br />
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Login</Button>
                <br />
                <br />
                {status && status.error && (
                    <div style={apiErrorStyle}>{status.error}</div>
                )}
            </form>        
            {/*
            <Button variant="text" color="secondary" onClick={() => {navigate(`/register`);}}>Register</Button>
            <br />
            {resetPW}
            */}
        </div>
    );
};

export default LoginForm;

