import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import {collectionTypes, countries} from "./Lists.js"

const CollectionTypeSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="collectiontype"
            label="Collection type"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {collectionTypes.map((ct) => (
                <MenuItem 
                    key={ct} 
                    value={ct}
                >{ct}</MenuItem>
            ))}
        </Field>
    )
}

const CountrySelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="country"
            label="Country"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {countries.map((country) => (
                <MenuItem 
                    key={country.Code} 
                    value={country.Code}
                >{`${country.Name} - ${country.Code}`}</MenuItem>
            ))}
        </Field>
    )
}


const CollectionQueryForm = ({handleSubmit}) => {
    const initValues = {
        collectionID: '', 
        name: '', 
        country: '',
        collectiontype: '',
        groups: [],
        includeSpecimens: false
    };
    
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
                collectionID: Yup.string()
                .uuid('Must be a valid uuid'),
                name: Yup.string()
                .max(100, 'Must be 100 characters or less'),
                groups: Yup.array().of(Yup.string())
            })}
            onSubmit={(values, {resetForm}) => {
                handleSubmit(values)
            }}
        >
            <Form>
                <Field 
                    component={TextField}
                    name="collectionID" 
                    type="text"
                    label="Collection ID"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    disabled={false}
                    variant="standard"
                />
                <br />
                
                <CollectionTypeSelect />
                <br />

                <CountrySelect />
                <br />
                
                <GroupSelect/>
                <br />
                
                <Field 
                    component={CheckboxWithLabel}
                    name="includeSpecimens" 
                    type="checkbox" 
                    Label={{ label: 'Include specimens' }}
                    disabled={false}
                    variant="standard"
                />
                <br />
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
        </Formik>
    
    );
};

export default CollectionQueryForm;
