import React, { useState }from 'react';
import { Grid } from '@material-ui/core';
import DescriptionQueryResults from './Description/DescriptionQueryResults';
import SpecimenQueryResults from './Specimen/SpecimenQueryResults';
import SchemaQueryResults from './Schema/SchemaQueryResults';
import DescriptionMutateResults from './Description/DescriptionMutateResults';
import CharacterInstanceMutateResults from './CharacterInstance/CharacterInstanceMutateResults';
import SpecimenMutateResults from './Specimen/SpecimenMutateResults';
import ReferenceMutateResults from './Reference/ReferenceMutateResults';
import SchemaMutateResults from './Schema/SchemaMutateResults';

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
        queryEntity === "CharacterInstance-mutate" ? (
            <CharacterInstanceMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Specimen-mutate" ? (
            <SpecimenMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Reference-mutate" ? (
            <ReferenceMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Schema-mutate" ? (
            <SchemaMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        'hi there';
        
    return (
        <Grid container spacing={3}>
            <Grid item>
                {result}
            </Grid>
        </Grid>
        
    );
};

export default Result;
