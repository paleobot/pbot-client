import { Grid } from '@mui/material';
import React from 'react';
import CollectionMutateResults from './Collection/CollectionMutateResults';
import UserMutateResults from './User/UserMutateResults';
import CollectionGroupMutateResults from './CollectionGroup/CollectionGroupMutateResults';
import ChangeQueryResults from './Change/ChangeQueryResults';

const Result = ({queryParams, type, queryEntity}) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>Result<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(type)
    console.log(queryEntity)
    console.log(JSON.parse(JSON.stringify(queryParams)))
 
    let result = 
        type === "mutate" && queryEntity === "collection" ? (
            <CollectionMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "collectiongroup" ? (
            <CollectionGroupMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "user" ? (
            <UserMutateResults queryParams={queryParams} />
        ) : 
        type === "query" && queryEntity === "change" ? (
            <ChangeQueryResults queryParams={queryParams} />
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
