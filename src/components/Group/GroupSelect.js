import React from 'react';
import { Field } from 'formik';
import { MenuItem } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";

export const GroupSelect = (props) => {
    console.log("GroupSelect");

    const gQL = gql`
            query {
                Group {
                    pbotID
                    name
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Group);
    
    
    const groups = alphabetize(
        props.omitPublic ?
            [...data.Group].filter(group => "public" !== group.name) :
            [...data.Group],
        "name"
    );
    console.log(groups)
    
    return (
        <Field
            component={TextField}
            type="text"
            name="groups"
            label="Groups"
            select={true}
            style={{minWidth:"200px"}}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
            sx={props.sx}
        >
            {groups.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}
