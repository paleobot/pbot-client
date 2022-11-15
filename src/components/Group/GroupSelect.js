import React from 'react';
import { Field } from 'formik';
import { MenuItem } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";

export let publicGroupID;

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
        data.Group.reduce((acc, group) => {
            const newGroup = {...group};
            console.log(newGroup);
            if ("public" === newGroup.name) {
                publicGroupID = newGroup.pbotID;
                return acc.concat(newGroup);
            } else {
                return acc.concat(newGroup);
            }
        }, []), 
    "name");
    console.log(groups)
    console.log(publicGroupID);
    
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
        >
            {groups.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}
