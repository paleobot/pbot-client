import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography, Stack } from '@mui/material';
import { alphabetize } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';

function Specimens(props) { //TODO: move this to standalone file in Specimens folder?
    console.log("Specimens");
    if (!props.specimens) return ''; //TODO: is this the best place to handle this?
    const specimens = alphabetize([...props.specimens], "name");
    
    const style = props.top ? {marginLeft:"4em"} : {marginLeft:"2em"};
    console.log(style);
    return specimens.map(({pbotID, name}) => {
        const directURL = new URL(window.location.origin + "/query/specimen/" + pbotID);
        return (
            <div>
            <Link key={pbotID} style={style} color="success.main" underline="hover" href={directURL}  target="_blank">{name}</Link>
            </div>
        )
    });
}


function Collections(props) {
    console.log(props);
    console.log(props.filters.genus);
    
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const groups = props.standAlone ? '' : ', $groups: [ID!] ';
    const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'
    
    let gQL;
    if (!props.standAlone) {
        gQL = gql`
            query ($pbotID: ID, $name: String, $country: String, $state: String, $collectionType: String, ${groups}) {
                Collection (pbotID: $pbotID, name: $name, country: $country, state: $state, collectionType: $collectionType  ${filter}) {
                    pbotID
                    name
                }
            }
        `
    } else {
        gQL = gql`
            query ($pbotID: ID, $name: String, $country: String, $state: String, $collectionType: String, ${groups} $includeSpecimens: Boolean! ${filters.collection ? ", $collection: ID" : ""}) {
                Collection (pbotID: $pbotID, name: $name, country: $country, state: $state, collectionType: $collectionType ${filter}) {
                    pbotID
                    name
                    collectionType
                    sizeClasses
                    lat
                    lon
                    gpsCoordinateUncertainty
                    geographicResolution
                    geographicComments
                    protectedSite
                    country
                    state
                    maxinterval
                    mininterval
                    lithology
                    additionalLithology
                    stratigraphicGroup
                    stratigraphicFormation
                    stratigraphicMember
                    stratigraphicBed
                    stratigraphicComments
                    environment
                    environmentComments
                    collectors
                    collectionMethods
                    collectingComments
                    pbdbid
                    directDate
                    directDateError
                    directDateType
                    numericAgeMin
                    numericAgeMinError
                    numericAgeMinType
                    numericAgeMax
                    numericAgeMaxError
                    numericAgeMaxType
                    ageComments
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
    const listIndent = {marginLeft:"2em"}
    const header1 = {marginLeft:"2em", marginTop:"10px"}
    const header2 = {marginLeft:"4em"}
    const indent = {marginLeft:"4em"}
    const indent2 = {marginLeft:"6em"}
    return (collections.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
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
                    <div style={{marginLeft:"2em"}}><b>direct link:</b> <Link color="success.main" underline="hover" href={directURL}  target="_blank">{directURL.toString()}</Link></div>

                    <div style={header1}><Typography variant="h6">Identity</Typography></div>
                    <div style={indent}><b>pbotID:</b> {collection.pbotID}</div>
                    <div style={indent}><b>pbdb id:</b> {collection.pbdbid}</div>
                    <div style={indent}><b>latitude:</b> {collection.lat}</div>
                    <div style={indent}><b>longitude:</b> {collection.lon}</div>
                    <div style={indent}><b>GPS coordinate uncertainty:</b> {collection.gpsCoordinateUncertainty}</div>
                    {collection.references && collection.references.length > 0 &&
                        <div>
                            <div style={indent}><b>references:</b></div>
                            {alphabetize([...collection.references], "order").map(reference => (
                                <div key={reference.Reference.pbotID} style={indent2}>{reference.Reference.title}, {reference.Reference.year}</div>
                            ))}
                        </div>
                    }

                    <div style={header1}><Typography variant="h6">Geographic</Typography></div>
                    <div style={indent}><b>country:</b> {collection.country}</div>
                    <div style={indent}><b>state:</b> {collection.state}</div>
                    <div style={indent}><b>protected site:</b> {collection.protectedSite}</div>
                    <div style={indent}><b>scale of geographic resolution:</b> {collection.geographicResolution}</div>
                    <div style={indent}><b>comments on geographic information:</b> {collection.geographicComments}</div>
                    
                    <div style={header1}><Typography variant="h6">Age</Typography></div>
                    <div style={indent}><b>max interval:</b> {collection.maxinterval}</div>
                    <div style={indent}><b>min interval:</b> {collection.mininterval}</div>
                    <div style={indent}>
                        <Stack direction="row" spacing={2}>
                            <b>direct date:</b> {collection.directDate}
                            <b>direct date error:</b> {collection.directDateError}
                            <b>direct date type:</b> {collection.directDateType}
                        </Stack>
                    </div>
                    <div style={indent}>
                        <Stack direction="row" spacing={2}>
                            <b>numeric maximum age:</b> {collection.numericAgeMax}
                            <b>numeric maximum age error:</b> {collection.numericAgeMaxError}
                            <b>numeric maximum age type:</b> {collection.numericAgeMaxType}
                        </Stack>
                    </div>
                    <div style={indent}>
                        <Stack direction="row" spacing={2}>
                            <b>numeric minimum age:</b> {collection.numericAgeMin}
                            <b>numeric minimum age error:</b> {collection.numericAgeMinError}
                            <b>numeric minimum age type:</b> {collection.numericAgeMinType}
                        </Stack>
                    </div>
                    <div style={indent}><b>comments on age information:</b> {collection.ageComments}</div>

                    <div style={header1}><Typography variant="h6">Geologic</Typography></div>
                    <div style={indent}><b>lithology:</b> {collection.lithology}</div>
                    <div style={indent}><b>additional lithology information:</b> {collection.additionalLithology}</div>
                    <div style={header2}><Typography variant="h7">Stratigraphic</Typography></div>
                    <div style={indent2}><b>group:</b> {collection.stratigraphicGroup}</div>
                    <div style={indent2}><b>formation:</b> {collection.stratigraphicFormation}</div>
                    <div style={indent2}><b>member:</b> {collection.stratigraphicMember}</div>
                    <div style={indent2}><b>bed:</b> {collection.stratigraphicBed}</div>
                    <div style={indent2}><b>comments on stratigraphy:</b> {collection.stratigraphicComments}</div>
                    <div style={indent}><b>environment:</b> {collection.environment}</div>
                    <div style={indent}><b>comments on environment:</b> {collection.environmentComments}</div>

                    <div style={header1}><Typography variant="h6">Collecting</Typography></div>
                    <div style={indent}><b>collection type:</b> {collection.collectionType}</div>
                    {collection.preservationModes && collection.preservationModes.length > 0 &&
                        <div>
                            <div style={indent}><b>preservation modes:</b></div>
                            {collection.preservationModes.map(pm => (
                                <div key={pm.pbotID} style={indent2}>{pm.name}</div>
                            ))}
                        </div>
                    }
                    {collection.sizeClasses && collection.sizeClasses.length > 0 &&
                        <div>
                            <div style={indent}><b>size classes:</b></div>
                            {collection.sizeClasses.map(sc => (
                                <div key={sc} style={indent2}>{sc}</div>
                            ))}
                        </div>
                    }
                    <div style={indent}><b>collection methods:</b> {collection.collectionMethods}</div>
                    <div style={indent}><b>collectors:</b> {collection.collectors}</div>
                    <div style={indent}><b>comments about collecting methods:</b> {collection.collectionComments}</div>


                    {collection.specimens && collection.specimens.length > 0 &&
                        <>
                            <div style={header1}><Typography variant="h6">Specimens</Typography></div>
                            <Specimens specimens={collection.specimens} top="true"/>
                            <br />
                        </>
                    }
                    <br />
                    </>
                }

                {!props.standAlone &&
                <Link style={listIndent} color="success.main" underline="hover" href={directURL}  target="_blank"><b>{collection.name || "(name missing)"}</b></Link>
                }

            </div>
        )
    });

}

const CollectionQueryResults = ({queryParams}) => {
    console.log("CollectionQueryResults")
    console.log(queryParams);

    const global = useContext(GlobalContext);
   
    return (
        <Collections 
            filters={{
                pbotID: queryParams.collectionID || null,
                name: queryParams.name || null, 
                country: queryParams.country || null,
                state: queryParams.state || null,
                collectionType: queryParams.collectiontype || null,
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeSpecimens={queryParams.includeSpecimens} 
            standAlone={queryParams.standAlone} 
        />
    );
};

export default CollectionQueryResults;
