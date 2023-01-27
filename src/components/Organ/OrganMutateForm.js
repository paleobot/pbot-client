import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const OrganSelect = (props) => {
    console.log("OrganSelect");
    const gQL = gql`
            query {
                Organ {
                    pbotID
                    type
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                     
    const organs = alphabetize([...data.Organ], "type");
    console.log(organs)
    
    return (
        <Field
            component={TextField}
            type="text"
            name="organ"
            label="Organ"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={event => {
                props.values.type = event.currentTarget.dataset.type || '';
                props.handleChange(event);
            }}
        >
            {organs.map(({ pbotID, type }) => (
                <MenuItem 
                    key={pbotID} 
                    value={pbotID}
                    data-type={type}
                >{type}</MenuItem>
            ))}
        </Field>
    )
}


const OrganMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                organ: '',
                type: '',
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
                type: Yup.string().required(),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>
            
                <Field 
                    component={TextField}
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <OrganSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                
                {(mode === "create" || (mode === "edit" && props.values.organ)) &&
                <div>
                    <Field
                        component={TextField}
                        type="text"
                        name="type"
                        label="Type"
                        fullWidth 
                        disabled={false}
                    />
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

export default OrganMutateForm;
