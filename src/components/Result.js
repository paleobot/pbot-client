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
import {
  useQuery,
  gql
} from "@apollo/client";

const Result = ({queryParams, queryEntity}) => {
    console.log("Result");
    
    //This publicGroupID and path business is to handle direct urls to nodes 
    //(e.g. http://localhost:3000/Specimen/7599aa01-c919-4628-a5a8-b513d7a080c1)
    //This code, and related in Result.js, is proof on concept. Will need to 
    //use react-router to make it tight.
    //TODO: Right now, this query happens for every Result. It does not need to.
    //Leaving it for now, because at some point we'll be switching to react-router, 
    //and this will change the whole way for handle paths and initialization.
    //Just make sure this gets handled more efficiently.
    const gQL = gql`
            query {
                Group (name: "public"){
                    pbotID
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    const publicGroupID = data.Group[0].pbotID;
        
    const pathPieces = window.location.pathname.split('/');
    const qParams = "OTU"===pathPieces[1] ? {
        otuID: pathPieces[2] || null, 
        groups:[publicGroupID], //TODO:Figure out how to get this programatically
        includeHolotypeDescription: false,
        includeMergedDescription: false
    } : "Specimen"===pathPieces[1] ? {
        specimenID: pathPieces[2] || null,
        groups:[publicGroupID], //TODO:Figure out how to get this programatically
        includeDescriptions:false, 
        includeOTUs:false
    } : "Reference"===pathPieces[1] ? {
        referenceID: pathPieces[2] || null,
        groups:[publicGroupID], //TODO:Figure out how to get this programatically
    } : "Schema"===pathPieces[1] ? {
        schemaID: pathPieces[2] || null,
        groups:[publicGroupID], //TODO:Figure out how to get this programatically
        includeCharacters:false, 
    } : {};
    queryParams = queryParams ?  queryParams : qParams ;

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
