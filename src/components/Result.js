import React, { useState }from 'react';
import { Grid } from '@material-ui/core';
import OTUQueryResults from './OTUQueryResults';
import SpecimenQueryResults from './SpecimenQueryResults';

const Result = ({queryParams, queryEntity}) => {

    let result = 
        queryEntity === "OTU" ? (
            <OTUQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Specimen" ? (
            <SpecimenQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
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
