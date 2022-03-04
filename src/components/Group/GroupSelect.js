import React from 'react';
import { Field } from 'formik';
import { MenuItem } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
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
        data.Group.map(group => {
            const newGroup = {...group};
            console.log(newGroup);
            return newGroup;
        }), 
    "name");
    console.log(groups)
    
    return (
        <Field
            component={TextField}
            type="text"
            name="group"
            label="Group"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {groups.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}
