import React, { useState }from 'react';
import { Grid } from '@mui/material';
import OTUQueryResults from './OTU/OTUQueryResults';
import SpecimenQueryResults from './Specimen/SpecimenQueryResults';
import ReferenceQueryResults from './Reference/ReferenceQueryResults';
import SchemaQueryResults from './Schema/SchemaQueryResults';
import PersonQueryResults from './Person/PersonQueryResults';
import OTUMutateResults from './OTU/OTUMutateResults';
import SynonymMutateResults from './Synonym/SynonymMutateResults';
import CommentMutateResults from './Comment/CommentMutateResults';
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
import ImageMutateResults from './Image/ImageMutateResults';
import {
  useQuery,
  gql
} from "@apollo/client";

const Result = ({queryParams, type, queryEntity}) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>Result<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(type)
    console.log(queryEntity)
    /*
    //This publicGroupID and path business is to handle direct urls to nodes 
    //(e.g. http://localhost:3000/Specimen/7599aa01-c919-4628-a5a8-b513d7a080c1)
    //This code, and related in Result.js, is proof on concept. Will need to 
    //use react-router to make it tight.
    //TODO: The path code needs to know the public group id, but we can't assume that is initialized.
    //The query below does that. But it has problems. For one thing, this query happens for every Result call,
    //and that's a lot. For another, and a showstopper, it somehow causes React to inifinite loop.
    //So, I've hardcoded it instead for now. I'll figure out a better way as part of the react-router change.
    //Probably using React Context or something. I'm leaving it all here for future reference.
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
    
    const publicGroupID = "4a34d2a4-f1ab-43b5-8435-d46182901b1e";
    if ("/" !== window.location.pathname) {
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
    }
    */
    
    let result = 
        type === "query" && queryEntity === "otu" ? (
            <OTUQueryResults queryParams={queryParams} />
        ) : 
        type === "query" && queryEntity === "specimen" ? (
            <SpecimenQueryResults queryParams={queryParams} />
        ) :
        type === "query" && queryEntity === "reference" ? (
            <ReferenceQueryResults queryParams={queryParams} />
        ) :
        type === "query" && queryEntity === "schema" ? (
            <SchemaQueryResults queryParams={queryParams} />
        ) :
        type === "query" && queryEntity === "person" ? (
            <PersonQueryResults queryParams={queryParams} />
        ) :
        type === "mutate" && queryEntity === "otu" ? (
            <OTUMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "synonym" ? (
            <SynonymMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "comment" ? (
            <CommentMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "description" ? (
            <DescriptionMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "characterinstance" ? (
            <CharacterInstanceMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "specimen" ? (
            <SpecimenMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "image" ? (
            <ImageMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "collection" ? (
            <CollectionMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "organ" ? (
            <OrganMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "reference" ? (
            <ReferenceMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "schema" ? (
            <SchemaMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "character" ? (
            <CharacterMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "state" ? (
            <StateMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "person" ? (
            <PersonMutateResults queryParams={queryParams} />
        ) : 
        type === "mutate" && queryEntity === "group" ? (
            <GroupMutateResults queryParams={queryParams} />
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
