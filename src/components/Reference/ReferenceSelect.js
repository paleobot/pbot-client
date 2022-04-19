import React from 'react';
import { Field } from 'formik';
import { MenuItem } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";


export const ReferenceSelect = (props) => {
    console.log("ReferenceSelect");
    const gQL = gql`
            query {
                Reference {
                    pbotID
                    title
                    publisher
                    year
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

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
            label="Reference"
            fullWidth 
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
