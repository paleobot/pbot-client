import React from 'react';
import { Field, useFormikContext } from 'formik';
import { MenuItem } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";

export const GroupSelect = (props) => {
    console.log("GroupSelect");

    const { setFieldValue } = useFormikContext();

    const gQL = gql`
            query {
                Group {
                    pbotID
                    name
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    //Preload Group select with all groups user is member of (while honoring omitPublic).
    React.useEffect(() => {
        if (props.preloadGroups && data) {
            setFieldValue("groups", props.omitPublic ? 
                data.Group.filter(group => "public" !== group.name).map(group => group.pbotID) : 
                data.Group.map(group => group.pbotID));
        }
    }, [data]); 

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
