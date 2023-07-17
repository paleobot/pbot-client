import React from 'react';
import { MenuItem } from "@mui/material";
import { Field } from "formik";
import { TextField } from "formik-mui";
import { alphabetize } from '../../util.js';
import {
    useQuery,
    gql
  } from "@apollo/client";
  
export const PreservationModeSelect = (props) => {
    console.log("PreservationModeSelect");
    console.log(props);
    const gQL = gql`
            query {
                PreservationMode {
                    name
                    pbotID
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    const preservationModes = alphabetize([...data.PreservationMode], "name");
    
    return (
        <Field
            component={TextField}
            type="text"
            name="preservationModes"
            label="Preservation modes"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: true,
            }}
            defaultValue={[]} //No f*ing idea why this is necessary here but not in others
            disabled={false}
        >
            {preservationModes.map(({ pbotID, name }) => (
                <MenuItem 
                    key={pbotID} 
                    value={pbotID}
                >{name}</MenuItem>
            ))}
        </Field>
    )
        
}
