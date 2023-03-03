import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography } from '@mui/material';
import { alphabetize } from '../../util.js';
import {publicGroupID} from '../Group/GroupSelect.js';
import logo from '../../PBOT-logo-transparent.png';

function Specimens(props) { //TODO: move this to standalone file in Specimens folder?
    console.log("Specimens");
    if (!props.specimens) return ''; //TODO: is this the best place to handle this?
    const specimens = alphabetize([...props.specimens], "name");
    
    const style = props.top ? {marginLeft:"4em"} : {marginLeft:"2em"};
    console.log(style);
    return specimens.map(({pbotID, name}) => {
        const directURL = new URL(window.location.origin + "/query/specimen/" + pbotID);
        return (
            <Link key={pbotID} style={style} color="success.main" underline="hover" href={directURL}  target="_blank">{name}</Link>
        )
    });
}


function Collections(props) {
    console.log(props);
    console.log(props.filters.genus);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const groups = props.standAlone ? '' : ', $groups: [ID!] ';
    const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'
    
    let gQL;
    if (!props.standAlone) {
        gQL = gql`
            query ($pbotID: ID, $name: String, $country: String, $collectionType: String, ${groups}) {
                Collection (pbotID: $pbotID, name: $name, country: $country, collectionType: $collectionType  ${filter}) {
                    pbotID
                    name
                }
            }
        `
    } else {
        gQL = gql`
            query ($pbotID: ID, $name: String, $country: String, $collectionType: String, ${groups} $includeSpecimens: Boolean! ${filters.collection ? ", $collection: ID" : ""}) {
                Collection (pbotID: $pbotID, name: $name, country: $country, collectionType: $collectionType ${filter}) {
                    pbotID
                    name
                    collectionType
                    sizeClasses
                    lat
                    lon
                    country
                    maxinterval
                    mininterval
                    lithology
                    environment
                    collectors
                    pbdbid
                    preservationModes {
                        pbotID
                        name
                    }
                    elementOf {
                        name
                    }
                    references {
                        Reference {
                            title
                            publisher
                            year
                        }
                        order
                    }
                    specimens @include(if: $includeSpecimens) {
                            pbotID
                            name
                    }
                }            
            }
        `;
    }
    
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters,
            includeSpecimens: props.includeSpecimens,
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const collections = alphabetize([...data.Collection], "name");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    return (collections.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : collections.map((collection) => {

        const directURL = new URL(window.location.origin + "/query/collection/" + collection.pbotID);
        if (props.includeSpecimens) {
            directURL.searchParams.append("includeSpecimens", "true");
        }
            
        return (
            <div key={collection.pbotID} style={style}>
                { props.standAlone &&     
                    <>
                    <Grid container sx={{
                        width: "100%",
                        minHeight: "50px",
                        backgroundColor: 'primary.main',
                    }}>
                        <Grid container item xs={4} sx={{ display: "flex", alignItems: "center" }}>
                            <Grid item sx={{ display: "flex", alignItems: "center" }}>
                                <img src={logo} style={{ height: "45px" }} />
                            </Grid>
                            <Grid item sx={{ display: "flex", alignItems: "center" }} >                  
                                <Typography variant="h5">
                                    Pbot
                                </Typography>
                            </Grid>                 
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                            <Typography variant="h5">
                                Collection: {collection.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                            <Typography variant="h5" sx={{marginRight: "10px"}}>
                                Workspace: {collection.elementOf[0].name}
                            </Typography>
                        </Grid>
                    </Grid>
                    <div style={indent}><b>direct link:</b> <Link color="success.main" underline="hover" href={directURL}  target="_blank">{directURL.toString()}</Link></div>

                    <div style={indent}><b>pbotID:</b> {collection.pbotID}</div>
                    <div style={indent}><b>latitude:</b> {collection.lat}</div>
                    <div style={indent}><b>longitude:</b> {collection.lon}</div>
                    <div style={indent}><b>country:</b> {collection.country}</div>
                    <div style={indent}><b>collection type:</b> {collection.collectionType}</div>
                    <div style={indent}><b>max interval:</b> {collection.maxinterval}</div>
                    <div style={indent}><b>min interval:</b> {collection.mininterval}</div>
                    <div style={indent}><b>lithology:</b> {collection.lithology}</div>
                    <div style={indent}><b>environment:</b> {collection.environment}</div>
                    <div style={indent}><b>collectors:</b> {collection.collectors}</div>
                    <div style={indent}><b>pbdb id:</b> {collection.pbdbid}</div>
                    {collection.sizeClasses && collection.sizeClasses.length > 0 &&
                        <div>
                            <div style={indent}><b>size classes:</b></div>
                            {collection.sizeClasses.map(sc => (
                                <div key={sc} style={indent2}>{sc}</div>
                            ))}
                        </div>
                    }
                    {collection.preservationModes && collection.preservationModes.length > 0 &&
                        <div>
                            <div style={indent}><b>preservation modes:</b></div>
                            {collection.preservationModes.map(pm => (
                                <div key={pm.pbotID} style={indent2}>{pm.name}</div>
                            ))}
                        </div>
                    }
                    {collection.references && collection.references.length > 0 &&
                        <div>
                            <div style={indent}><b>references:</b></div>
                            {alphabetize([...collection.references], "order").map(reference => (
                                <div key={reference.Reference.pbotID} style={indent2}>{reference.Reference.title}, {reference.Reference.publisher}, {reference.Reference.year}</div>
                            ))}
                        </div>
                    }
                    {collection.specimens && collection.specimens.length > 0 &&
                        <div>
                            <div style={indent}><b>specimens:</b></div>
                            <Specimens specimens={collection.specimens} top="true"/>
                        </div>
                    }
                    <br />
                    </>
                }

                {!props.standAlone &&
                <Link style={indent} color="success.main" underline="hover" href={directURL}  target="_blank"><b>{collection.name || "(name missing)"}</b></Link>
                }

            </div>
        )
    });

}

const CollectionQueryResults = ({queryParams}) => {
    console.log("CollectionQueryResults")
    console.log(queryParams);
    console.log(publicGroupID);
    return (
        <Collections 
            filters={{
                pbotID: queryParams.collectionID,
                name: queryParams.name, 
                country: queryParams.country,
                collectionType: queryParams.collectiontype,
                groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
            }}
            includeSpecimens={queryParams.includeSpecimens} 
            standAlone={queryParams.standAlone} 
        />
    );
};

export default CollectionQueryResults;
