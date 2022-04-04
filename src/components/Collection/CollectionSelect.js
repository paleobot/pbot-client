import React from 'react';
import { Field } from 'formik';
import { MenuItem } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";

export const CollectionSelect = (props) => {
    console.log("CollectionSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Collection {
                pbotID
                name
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    const collections = alphabetize([...data.Collection], "name");
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="collection"
            label="Collection"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
                <MenuItem 
                    key="" 
                    value=""
                >&nbsp;</MenuItem>
            {collections.map((collection) => (
                <MenuItem 
                    key={collection.pbotID} 
                    value={collection.pbotID}
                >{collection.name}</MenuItem>
            ))}
        </Field>
    )
}
