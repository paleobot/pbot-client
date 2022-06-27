import React, { useState }from 'react';
import { Grid } from '@mui/material';
import OTUQueryResults from './OTU/OTUQueryResults';
import SpecimenQueryResults from './Specimen/SpecimenQueryResults';
import ReferenceQueryResults from './Reference/ReferenceQueryResults';
import SchemaQueryResults from './Schema/SchemaQueryResults';
import PersonQueryResults from './Person/PersonQueryResults';
import OTUMutateResults from './OTU/OTUMutateResults';
import SynonymMutateResults from './Synonym/SynonymMutateResults';
import DescriptionMutateResults from './Description/DescriptionMutateResults';
import CharacterInstanceMutateResults from './CharacterInstance/CharacterInstanceMutateResults';
import SpecimenMutateResults from './Specimen/SpecimenMutateResults';
import OrganMutateResults from './Organ/OrganMutateResults';
import ReferenceMutateResults from './Reference/ReferenceMutateResults';
import SchemaMutateResults from './Schema/SchemaMutateResults';
import CharacterMutateResults from './Character/CharacterMutateResults';
import StateMutateResults from './State/StateMutateResults';
import PersonMutateResults from './Person/PersonMutateResults';
import GroupMutateResults from './Group/GroupMutateResults';
import CollectionMutateResults from './Collection/CollectionMutateResults';

const Result = ({queryParams, queryEntity}) => {

    let result = 
        queryEntity === "OTU" ? (
            <OTUQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Specimen" ? (
            <SpecimenQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) :
        queryEntity === "Reference" ? (
            <ReferenceQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) :
        queryEntity === "Schema" ? (
            <SchemaQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) :
        queryEntity === "Person" ? (
            <PersonQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) :
        queryEntity === "OTU-mutate" ? (
            <OTUMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Synonym-mutate" ? (
            <SynonymMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
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
        queryEntity === "Collection-mutate" ? (
            <CollectionMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Organ-mutate" ? (
            <OrganMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Reference-mutate" ? (
            <ReferenceMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Schema-mutate" ? (
            <SchemaMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Character-mutate" ? (
            <CharacterMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "State-mutate" ? (
            <StateMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Person-mutate" ? (
            <PersonMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        queryEntity === "Group-mutate" ? (
            <GroupMutateResults queryParams={queryParams} queryEntity={queryEntity}/>
        ) : 
        'sumptin wrong';
        
    return (
        <Grid container spacing={3}>
            <Grid item>
                {result}
            </Grid>
        </Grid>
        
    );
};

export default Result;
