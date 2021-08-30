import React, { useState }from 'react';
import { Grid } from '@material-ui/core';
import OTUQueryResults from './OTUQueryResults';
import SpecimenQueryResults from './SpecimenQueryResults';
import SchemaQueryResults from './SchemaQueryResults';
import OTUMutateResults from './OTUMutateResults';

const Result = ({queryParams, queryEntity}) => {

    let result = 
        queryEntity === "OTU" ? (
            <OTUQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Specimen" ? (
            <SpecimenQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) :
        queryEntity === "Schema" ? (
            <SchemaQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) :
        queryEntity === "OTU-mutate" ? (
            <OTUMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        '';
        
    return (
        <Grid container spacing={3}>
            <Grid item>
                {result}
            </Grid>
        </Grid>
        
    );
};

export default Result;
