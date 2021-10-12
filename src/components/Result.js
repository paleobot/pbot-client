import React, { useState }from 'react';
import { Grid } from '@material-ui/core';
import DescriptionQueryResults from './Description/DescriptionQueryResults';
import SpecimenQueryResults from './Specimen/SpecimenQueryResults';
import SchemaQueryResults from './Schema/SchemaQueryResults';
import DescriptionMutateResults from './Description/DescriptionMutateResults';

const Result = ({queryParams, queryEntity}) => {

    let result = 
        queryEntity === "Description" ? (
            <DescriptionQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Specimen" ? (
            <SpecimenQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) :
        queryEntity === "Schema" ? (
            <SchemaQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) :
        queryEntity === "Description-mutate" ? (
            <DescriptionMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
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
