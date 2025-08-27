import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import {
    useQuery,
    gql
  } from "@apollo/client";
import { alphabetize } from '../../util';
import { TextField } from 'formik-mui';
import { MenuItem } from '@mui/material';
  
export const NotableFeaturesSelect = (props) => {
    console.log("NotableFeaturesSelect");
    const gQL = gql`
            query {
                Feature {
                    pbotID
                    name
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                     
    const features = alphabetize([...data.Feature], "name");
    console.log(features)
    
    return (
        <Field
            component={TextField}
            type="text"
            name="notableFeatures"
            label={props.label || "Notable features preserved"}
            fullWidth 
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
         >
            {features.map(({ pbotID, name }) => (
                <MenuItem 
                    key={pbotID} 
                    value={pbotID}
                    data-name={name}
                >{name}</MenuItem>
            ))}
        </Field>
    )
}