import React, { useContext, useState }from 'react';
import * as Yup from 'yup';
import { Grid, Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextFieldController } from '../util/TextFieldController';
import { SelectController } from '../util/SelectController';
import { useAuth } from '../AuthContext';
import { jwtDecode } from "jwt-decode";
import { GlobalContext } from '../GlobalContext';

const origin = window.location.origin;

const UserMutateForm = ({handleSubmit: hSubmit, mode}) => {
    const [showUseExistingUser, setshowUseExistingUser] = useState(false);
    const navigate = useNavigate();

    const global = useContext(GlobalContext);
    const {user} = useAuth();

    const initialValues = {
        givenName: '',
        surname: '',
        email: '', 
        password: '', 
        confirmPassword: '',
        useExistingUser: false,
    }
    const validationSchema= Yup.object().shape({
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
    })

    const { handleSubmit, reset, control, watch, formState: {errors} } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
        trigger: "onBlur",
    });

    //TODO: Move to UserMutateResult
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
            
    const [status, setStatus] = useState(null);
    const doSubmit = async (values) => {
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

    /*
    const FetchStatus = () => {
        if (loading) {
            return <Typography variant="body1">Loading...</Typography>;
        }

        if (error) {
            return <Typography color="error" variant="caption">Error accessing API: {error.message}</Typography>;
        }
    }
    */

    return(
        <div>
            {!user || (user && user.role_id !== global.superuserID) &&
            <>
            Must be superuser to administer users
            </>
            }

            {user && user.role_id === global.superuserID &&
            <form onSubmit={handleSubmit(doSubmit)} >

                <input 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
            
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <SelectController 
                            name="person"
                            label="Existing person" 
                            options={{
                                //url: "https://data.azgs.arizona.edu/api/v1/users",
                                path: "api/v1/users",
                                nameField: "name",
                                valueField: "id"
                            }} 
                            control={control} 
                            errors={errors} 
                            style={{minWidth: "12ch", marginTop: "1em", width:"75%"}} variant="standard"
                            onChange={(e) => {
                                console.log("onChange")
                                console.log(e)
                                fetchData(e.target.value);
                            }}
                        />
                        <br />
                        {/*<FetchStatus/>*/}

                        <br />
                        <br />
                    </div>
                }

                <TextFieldController name={`givenName`} label="Given name" control={control} errors={errors}/>
                <br />

                <TextFieldController name={`surname`} label="Surname" control={control} errors={errors}/>
                <br />

                <TextFieldController name={`email`} label="Email" control={control} errors={errors}/>
                <br />

                <SelectController 
                    name="role"
                    label="Role" 
                    options={{
                        path: "api/v1/users/roles",
                        nameField: "name",
                        valueField: "role_id"
                    }} 
                    /*
                    options={[
                        {name: "Admin", value: 1}, 
                        {name: "End user", value: 2}, 
                        {name: "Superuser", value: 3}
                    ]}
                    */     
                    control={control} 
                    errors={errors} 
                    disabled={mode === "edit"}
                    style={{minWidth: "12ch", marginTop: "1em", width:"70%"}} variant="standard"
                />

                <TextFieldController type="password" name={`password`} label="Password" control={control} errors={errors}/>
                <br />

                <TextFieldController type="password" name={`confirmPassword`} label="Confirm password" control={control} errors={errors}/>
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
            </form>
            }
        </div>
    );
};

export default UserMutateForm;

