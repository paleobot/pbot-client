import {
    gql, useQuery
} from "@apollo/client";
import { MenuItem } from '@mui/material';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import React from 'react';
import { alphabetize } from '../../util.js';
  
export const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    const gQL = gql`
        query {
            Schema {
                pbotID
                title
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Schema results<<<<<<<<<<<<<");
    console.log(data.Schema);
    const schemas = alphabetize([...data.Schema], "title");
    console.log(schemas);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name={`characterInstances[${props.index}].schema`}
            label="Schema"
            sx={{width: 1}}
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {schemas.map((schema) => (
                <MenuItem 
                    key={schema.pbotID} 
                    value={schema.pbotID}
                >{schema.title}</MenuItem>
            ))}
        </Field>
    )
}
