import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';


const DescriptionMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
   
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                type: '',
                family: '', 
                genus: '', 
                species: '',
            }}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                type: Yup.string().required(),
                family: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                genus: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                species: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
                <Field
                    component={TextField}
                    type="text"
                    name="type"
                    label="Type"
                    fullWidth 
                    disabled={false}
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                >
                    <MenuItem value="OTU">OTU</MenuItem>
                    <MenuItem value="specimen">Specimen</MenuItem>
                </Field>
                <br />
                                
                <Field 
                    component={TextField}
                    name="family" 
                    type="text" 
                    label="Family"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="genus" 
                    type="text" 
                    label="Genus"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
                <Field 
                    component={TextField}
                    name="species" 
                    type="text" 
                    label="Species"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
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

export default DescriptionMutateForm;
