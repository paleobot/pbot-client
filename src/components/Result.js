import { Grid } from '@mui/material';
import React from 'react';
import CollectionMutateResults from './Collection/CollectionMutateResults';
import PersonMutateResults from './Person/PersonMutateResults';

const Result = ({queryParams, type, queryEntity}) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>Result<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(type)
    console.log(queryEntity)
 
    let result = 
        type === "mutate" && queryEntity === "collection" ? (
            <CollectionMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "person" ? (
            <PersonMutateResults queryParams={queryParams} />
        ) : 
        'nothing to show';
        
    return (
        <Grid container spacing={3}>
            <Grid item>
                {result}
            </Grid>
        </Grid>
        
    );
};

export default Result;
