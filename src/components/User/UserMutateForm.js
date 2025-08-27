import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../AuthContext';
import { GlobalContext } from '../GlobalContext';
import { LabeledCheckboxController } from '../util/LabeledCheckboxController';
import { SelectController } from '../util/SelectController';
import { TextFieldController } from '../util/TextFieldController';

const origin = window.location.origin;

const UserMutateForm = ({handleSubmit: hSubmit, mode}) => {
    const navigate = useNavigate();

    const global = useContext(GlobalContext);
    const {user} = useAuth();

    const initialValues = {
        person: '',
        givenName: '',
        surname: '',
        email: '', 
        role: '',
        organization: '',
        password: '', 
        confirmPassword: '',
        includeRemoved: false,
    }
    const validationSchema= Yup.object().shape({
        givenName: Yup.string(),
        surname: Yup.string()
            .when(
                "organization", {
                    is: (organization) => !organization,
                    then: (schema) => schema.required("Either Surname or Organization is required"),
                    otherwise: (schema) => schema.notRequired()
                }
            ),
        organization: Yup.string()
            .when(
                "surname", {
                    is: (surname) => !surname,
                    then: (schema) => schema.required("Either Organization or Surname is required"),
                    otherwise: (schema) => schema.notRequired()
                }
            ),
        email: Yup.string()
            .required("Email is required")
            .max(30, 'Must be 30 characters or less')
            .email("Must be a valid email address"),
        password: Yup.string()
            .test('isRequired', 'Password is required for new users', (value) => {return mode === "create" ? !!value : true})
            .test('isShort', 'Passwords must contain at least six characters', (value) => {return mode === "create" ? value && value.length > 6 : true})
            .test('isLong', 'Must be 30 characters or less', (value) => {return mode === "create" ? value && value.length < 30 : true}),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }, [['surname', 'organization']]); //Weird Yup way to ensure that either surname or organization is required, but not both. See https://github.com/jquense/yup/issues/720 regarding noSortEdges.

    //To clear form when mode changes 
    React.useEffect(() => {
            resetForm();
    },[mode]);
    

    const { handleSubmit, reset, control, watch, useWatch, getValues, formState: {errors} } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
        trigger: "onBlur",
    });

    const resetForm = (initValues = initialValues, props) => {
        //Add random value to ensure results are not retained (e.g. useEffect in Mutator is contingent on this value)
        initValues.random = Math.random();
        reset(initValues, props);
    }


    //TODO: Look into pushing previous page in React Router so we can navigate back to there.
                
    const [status, setStatus] = useState(null);
    const doSubmit = async (data) => {
        console.log("doSubmit")
        console.log(JSON.parse(JSON.stringify(data)))
        data.mode = mode;
        await hSubmit(data);
        resetForm();         
    }
    
    //TODO: try out styled-components
    const apiErrorStyle = {
        color: 'red'
    };
    
    const watchIncludeRemoved = watch("includeRemoved");

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const {token} = useAuth();

    const fetchData = async (permID, includeRemoved) => {
        console.log("fetchData");
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                new URL(`api/v1/users/${permID}${includeRemoved ? '?includeRemoved=true' : ''}`, process.env.REACT_APP_AZLIB_API_URL),
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': "Bearer " + token
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let json = await response.json();
            console.log(JSON.parse(JSON.stringify(json)));
            
            console.log("data:");
            console.log(json.data);

            const initValues = {
                person: permID,
                givenName: json.data.first_name,
                surname: json.data.last_name,
                email: json.data.email,
                role: json.data.role_id,
                organization: json.data.organization,
                random: Math.random(),
                includeRemoved: includeRemoved,
                //tos: queryParams.tos
            }

            reset(initValues, {keepDefaultValues: true});
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    }

    const FetchStatus = () => {
        if (loading) {
            return <Typography variant="body1">Loading...</Typography>;
        }

        if (error) {
            return <Typography color="error" variant="caption">Error accessing API: {error.message}</Typography>;
        }
    }
    
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
                        <Stack direction="row" spacing={1} sx={{marginBottom: "1em"}}>
                        {/*userSelect*/}
                        
                        {watchIncludeRemoved && 
                        <SelectController 
                            name="person"
                            label="Existing person"
                            options={{
                                //url: "https://data.azgs.arizona.edu/api/v1/users",
                                path: `api/v1/users?includeRemoved=true`,
                                nameField: "full_name",
                                valueField: "user_id"
                            }}
                            control={control} 
                            errors={errors} 
                            style={{minWidth: "12ch", marginTop: "1em", width:"75%"}} variant="standard"
                            onChange={(e) => {
                                console.log("onChange")
                                console.log(e)
                                fetchData(e.target.value, getValues("includeRemoved"));
                            }}
                        />
                        }
                        {!watchIncludeRemoved && 
                        <SelectController 
                            name="person"
                            label="Existing person"
                            options={{
                                //url: "https://data.azgs.arizona.edu/api/v1/users",
                                path: `api/v1/users`,
                                nameField: "full_name",
                                valueField: "user_id"
                            }}
                            control={control} 
                            errors={errors} 
                            style={{minWidth: "12ch", marginTop: "1em", width:"75%"}} variant="standard"
                            onChange={(e) => {
                                console.log("onChange")
                                console.log(e)
                                fetchData(e.target.value, getValues("includeRemoved"));
                            }}
                        />
                        }
                        
                        
                        {mode === "edit" &&
                            <LabeledCheckboxController name="includeRemoved" label="Include removed users" control={control} errors={errors}/>
                        }
                        </Stack>
                        <br />
                        <FetchStatus/>

                        <br />
                        <br />
                    </div>
                }

                <TextFieldController name={`givenName`} label="Given name" control={control} errors={errors} disabled={mode === "delete"}/>
                <br />

                <TextFieldController name={`surname`} label="Surname" control={control} errors={errors} disabled={mode === "delete"}/>
                <br />

                <TextFieldController name={`email`} label="Email" control={control} errors={errors} disabled={mode === "delete"}/>
                <br />

                <TextFieldController name={`organization`} label="Organization" control={control} errors={errors} disabled={mode === "delete"}/>
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
                    disabled={mode === "delete"}
                    style={{minWidth: "12ch", marginTop: "1em", width:"70%"}} variant="standard"
                    includeEmptyOption={true}
                />

                <TextFieldController type="password" name={`password`} label="Password" control={control} errors={errors} disabled={mode === "delete"}/>
                <br />

                <TextFieldController type="password" name={`confirmPassword`} label="Confirm password" control={control} errors={errors} disabled={mode === "delete"}/>
                <br />

                <br />
                <br />

                <Grid container spacing={1} style={{justifyContent: "center", align: "center"}}>
                    <Grid item>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </Grid>
                    <Grid item>
                    <Button type="button" variant="text" color="secondary" onClick={() => {resetForm()}}>Reset</Button>
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

