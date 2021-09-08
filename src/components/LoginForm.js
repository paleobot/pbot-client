import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

const LoginForm = ({ setToken }) => {
    //const [username, setUserName] = useState();
    //const [password, setPassword] = useState();

    const handleSubmit = values => {
        console.log(values.userName);
        
        /*
        const token = await loginUser({
            username,
            password
        });
        */
        setToken("gubba");
    }

    return(
        <div>
        <h2>Mutations require authentication</h2>
        <Formik
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
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleSubmit(values)
            }}
        >
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
            </Form>
        </Formik>
        </div>
    );
};

export default LoginForm;

