import React from 'react';
import { Field } from 'formik';
import { MenuItem } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";

export const OrganSelect = (props) => {
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
            name="organs"
            label="Organs"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
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
