import React from 'react';
import { Field } from 'formik';
import { MenuItem } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";


export const ReferenceSelect = (props) => {
    console.log("ReferenceSelect");
    console.log(props);
    
    //TODO: Can this be moved up into ReferenceManager, so it is only done once?
    const gQL = gql`
            query  ($excludeList: [ID!]){
                Reference (filter: {pbotID_not_in: $excludeList}){
                    pbotID
                    title
                    publisher
                    year
                }            
            }
        `;

    const excludeIDs = props.exclude.map(reference => reference.pbotID);

    const { loading: loading, error: error, data: data } = useQuery(gQL, {        
        variables: {
            excludeList: excludeIDs
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Reference);
    
    //const references = alphabetize([...data.Reference], "title");
    const references = alphabetize(
        data.Reference.map(reference => {
            const newRef = {...reference};
            console.log(newRef);

            newRef.name = reference.title + ", " + reference.publisher + ", " + reference.year;
            return newRef;
        }), 
    "name");
    console.log(references)
    
    return (
        <Field
            component={TextField}
            type="text"
            name={props.name || "references"}
            label="Title"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {references.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}
