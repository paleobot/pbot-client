import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography, Stack, List, ListItem, ListItemButton, ListItemText, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { alphabetize, AlternatingTableRow, DirectQueryLink, sort, useFetchIntervals } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function aggregateOTUs(collection) {
    const identifiedAsOTUs = [];
    const typeOfOTUs = [];
    const holotypeOfOTUs = [];

    if (!collection.specimens) return { identifiedAsOTUs, typeOfOTUs, holotypeOfOTUs };

    collection.specimens.forEach(specimen => {
        // identifiedAs
        if (specimen.identifiedAs && Array.isArray(specimen.identifiedAs)) {
            specimen.identifiedAs.forEach(rel => {
                if (rel.OTU) identifiedAsOTUs.push(rel.OTU);
            });
        }
        // typeOf
        if (specimen.typeOf && Array.isArray(specimen.typeOf)) {
            specimen.typeOf.forEach(rel => {
                if (rel.OTU) typeOfOTUs.push(rel.OTU);
            });
        }
        // holotypeOf
        if (specimen.holotypeOf && Array.isArray(specimen.holotypeOf)) {
            specimen.holotypeOf.forEach(rel => {
                if (rel.OTU) holotypeOfOTUs.push(rel.OTU);
            });
        }
    });

    return { identifiedAsOTUs, typeOfOTUs, holotypeOfOTUs };
}

function Specimens(props) { //TODO: move this to standalone file in Specimens folder?
    console.log("Specimens");
    if (!props.specimens) return ''; //TODO: is this the best place to handle this?
    const specimens = alphabetize([...props.specimens], "name");
    
    const style = props.top ? {marginLeft:"4em"} : {marginLeft:"2em"};
    console.log(style);
    return specimens.map(({pbotID, name}) => {
        const directURL = new URL(window.location.origin + "/query/specimen/" + pbotID + "?includeImages=true&includeDescriptions=true&includeOTUs=true");
        return (
            <>
            <Link key={pbotID}  style={style} color="success.main" underline="hover" href={directURL}  target="_blank">{name}</Link><br />
            </>
        )
    });
}

function OTUs(props) {
    // props.collection should be a Collection object
    const style = props.top ? {marginLeft:"4em"} : {marginLeft:"2em"};
    const { identifiedAsOTUs, typeOfOTUs, holotypeOfOTUs } = aggregateOTUs(props.collection);
    const renderOTUs = (otus) => {
        if (!otus || otus.length === 0) return <span style={{marginLeft:"1em"}}>(none)</span>;
        return otus.map(otu => {
            const directURL = new URL(window.location.origin + "/query/otu/" + otu.pbotID + "?includeHolotypeDescription=true&includeMergedDescription=true");
            return (
                <span key={otu.pbotID}>
                    <Link color="success.main" underline="hover" href={directURL} target="_blank">{otu.name || otu.pbotID}</Link>
                    <br />
                </span>
            );
        });
    };

    return (
        <div style={style}>
            <div>
                <b>Identified</b><br />
                {renderOTUs(identifiedAsOTUs)}
            </div>
            <div style={{marginTop:"1em"}}>
                <b>Types</b><br />
                {renderOTUs(typeOfOTUs)}
            </div>
            <div style={{marginTop:"1em"}}>
                <b>Holotypes</b><br />
                {renderOTUs(holotypeOfOTUs)}
            </div>
        </div>
    );
}


function Collections(props) {
    console.log(props);
    console.log(props.filters.genus);
    
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const groups = props.standAlone ? '' : ', $groups: [ID!] ';
    let filter = '';
    if (props.standAlone) {
        if (filters.pbotID && Array.isArray(filters.pbotID)) {
            filter += `, filter: {pbotID_in: $pbotID}`
        }
    } else  {
        filter = ", filter: {"
        if (!filters.name && !filters.specimens && !filters.references && !filters.otu && !filters.majorTaxonGroup && !filters.pbdbParentTaxon && !filters.family && !filters.genus && !filters.species && !filters.partsPreserved && !filters.notableFeatures && !filters.preservationModeIDs && !filters.lat && !filters.lon && !filters.enterers && !filters.intervals) {
            filter += "elementOf_some: {pbotID_in: $groups}"
        } else {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}";

            if (filters.name) {
                console.log("adding name")
                filter += ", {name_regexp: $name}"
            }
            if (filters.preservationModeIDs) {
                console.log("adding preservationModeIDs")
                filter += ", {preservationModes_some: {pbotID_in: $preservationModeIDs}}"
            }

            if (filters.partsPreserved) {
                filter += `, {
                    specimens_some: {
                        partsPreserved_some: {
                            pbotID_in: $partsPreserved
                        }
                    }
                }`
            }

            if (filters.notableFeatures) {
                filter += `, {
                    specimens_some: {
                        notableFeatures_some: {
                            pbotID_in: $notableFeatures
                        }
                    }
                }`
            }

            if (filters.specimens) {
                filter += `, {
                    specimens_some: {
                        pbotID_in: $specimens 
                    }
                }`
            }

            if (filters.lat && filters.lon) {
                filter += `, {
                    location_distance_lt: {
                        point: {
                          latitude: $lat
                          longitude: $lon
                        }
                        distance:10000
                      }
                }`
            }

            if (filters.enterers) {
               filter += `, {
                    enteredBy_some: {
                        Person: {
                            pbotID_in: $enterers, 
                        }
                        type: "CREATE"
                    }
                }`
            }

            if (filters.references) {
                filter += `, {
                    references_some: {
                        Reference: {
                            pbotID_in: $references 
                        } 
                    }
                }`
            }

            if (filters.otu) {
                filter += `, {
                    specimens_some: {
                        identifiedAs_some: {
                            OTU: {
                                pbotID: $otu
                            }
                        }
                    }
                }`
            }

            if (filters.majorTaxonGroup) {
                filter += `, {
                    specimens_some: {
                        identifiedAs_some: {
                            OTU: {
                                majorTaxonGroup: $majorTaxonGroup
                            }
                        }
                    }
                }`
            }

            if (filters.pbdbParentTaxon) {
                filter += `, {
                    specimens_some: {
                        identifiedAs_some: {
                            OTU: {
                                pbdbParentTaxon: $pbdbParentTaxon
                            }
                        }
                    }
                }`
            }

            if (filters.family) {
                filter += `, {
                    specimens_some: {
                        identifiedAs_some: {
                            OTU: {
                                family: $family
                            }
                        }
                    }
                }`
            }

            if (filters.genus) {
                filter += `, {
                    specimens_some: {
                        identifiedAs_some: {
                            OTU: {
                                genus: $genus
                            }
                        }
                    }
                }`
            }

            if (filters.species) {
                filter += `, {
                    specimens_some: {
                        identifiedAs_some: {
                            OTU: {
                                species: $species
                            }
                        }
                    }
                }`
            }

            if (filters.intervals) {
                filter += `, {
                    OR: [
                        {mininterval_in: $intervals},
                        {maxinterval_in: $intervals}
                    ]
                }`
            }

            filter +="]"
        }
        filter += "}"
    }
    console.log(filter)

    const fields = 
        props.standAlone ?
        `
            pbotID
            name
            collectionType
            sizeClasses
            location {
                latitude
                longitude
            }
            gpsCoordinateUncertainty
            geographicResolution
            geographicComments
            protectedSite
            country
            state
            timescale
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
                name
            }
            elementOf {
                name
            }
            references (orderBy: order_asc) {
                Reference {
                    pbotID
                    title
                    year
                }
                order
            }
            specimens @include(if: $includeSpecimens) {
                pbotID
                name
                identifiedAs @include(if: $includeOTUs){
                    OTU {
                        pbotID
                        name
                    }
                }
                typeOf @include(if: $includeOTUs){
                    OTU {
                        pbotID
                        name
                    }
                }
                holotypeOf @include(if: $includeOTUs){
                    OTU {
                        pbotID
                        name
                    }
                }
            }
        `
        : props.handleSelect ?
        `
            pbotID
            name
            collectionType
            sizeClasses
            location {
                latitude
                longitude
            }
            gpsCoordinateUncertainty
            geographicResolution
            geographicComments
            protectedSite
            country
            state
            timescale
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
                name
                pbotID
            }
            elementOf {
                name
                pbotID
            }
            references (orderBy: order_asc) {
                Reference {
                    title
                    year
                    pbotID
                }
                order
            }
        `
        :
        `
            pbotID
            name
            mininterval
            maxinterval
            country
        `;
    
    let gQL;
    if (!props.standAlone) {
        gQL = gql`
            query (
                $pbotID: ID, 
                ${filters.name ? ", $name: String" : ""}
                $country: String, 
                $state: String, 
                $collectionType: String, 
                $lithology: String, 
                $sizeClasses: [String], 
                $environment: String, 
                $collectionMethods: [String], 
                $pbdbid: String, 
                $stratigraphicGroup: String, 
                $stratigraphicFormation: String, 
                $stratigraphicMember: String, 
                $stratigraphicBed: String, 
                $mininterval: String, 
                $maxinterval: String ${groups} 
                ${filters.preservationModeIDs ? ", $preservationModeIDs: [ID!]" : ""} 
                ${filters.partsPreserved ? ", $partsPreserved: [ID!]" : ""} 
                ${filters.notableFeatures ? ", $notableFeatures: [ID!]" : ""} 
                ${filters.specimens ? ", $specimens: [ID!]" : ""} 
                ${filters.enterers ? ", $enterers: [ID!]" : ""} 
                ${filters.references ? ", $references: [ID!]" : ""}
                ${filters.otu ? ", $otu: ID" : ""}
                ${filters.majorTaxonGroup ? ", $majorTaxonGroup: String" : ""}
                ${filters.pbdbParentTaxon ? ", $pbdbParentTaxon: String" : ""}
                ${filters.family ? ", $family: String" : ""}
                ${filters.genus ? ", $genus: String" : ""}
                ${filters.species ? ", $species: String" : ""}
                ${filters.lat ? ", $lat: Float" : ""}
                ${filters.lon ? ", $lon: Float" : ""}
                ${filters.intervals ? ", $intervals: [String!]" : ""}
            ) {
                Collection (
                    pbotID: $pbotID, 
                    country: $country, 
                    state: $state, 
                    collectionType: $collectionType,  
                    lithology: $lithology, 
                    sizeClasses: $sizeClasses,  
                    environment: $environment, 
                    collectionMethods: $collectionMethods, 
                    pbdbid: $pbdbid, 
                    stratigraphicGroup: $stratigraphicGroup, 
                    stratigraphicFormation: $stratigraphicFormation, 
                    stratigraphicMember: $stratigraphicMember, 
                    stratigraphicBed: $stratigraphicBed, 
                    mininterval: $mininterval, 
                    maxinterval: $maxinterval 
                    ${filter}
                ) {
                    ${fields}
                }
            }
        `
    } else {
        gQL = gql`
            query (
                $pbotID: ${filters.pbotID && Array.isArray(filters.pbotID) ?
                    "[ID!]" : "ID"},
                $name: String, 
                $country: String, 
                $state: String, 
                $collectionType: String, 
                ${groups} 
                $includeSpecimens: Boolean! 
                $includeOTUs: Boolean! 
                ${filters.collection ? ", $collection: ID" : ""}) {
                Collection (
                    ${filters.pbotID && !Array.isArray(filters.pbotID) ?
                        "pbotID: $pbotID" : ""}, 
                    name: $name, 
                    country: $country, 
                    state: $state, 
                    collectionType: $collectionType 
                    ${filter}) {
                    ${fields}
                }            
            }
        `;
    }
    
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters,
            includeSpecimens: props.includeSpecimens,
            includeOTUs: props.includeOTUs,
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
    if (collections.length === 0) {
        return (
            <div style={style}>
                No {(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
            </div>
        )
    }
    if (props.handleSelect) {
        return (
            <List sx={{ pt: 0 }}>
            {collections.map((collection) => (
                <ListItem disableGutters key={collection.pbotID}>
                    <ListItemButton onClick={() => props.handleSelect(collection)} >
                        <ListItemText 
                        primary={collection.name} secondary={`pbot id: ${collection.pbotID}`} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        )
    }

    const directQParams = [];
    if (props.includeSpecimens) {
        directQParams.push("includeSpecimens");
    }
    if (props.includeOTUs) {
        directQParams.push("includeOTUs");
    }

    const jsonDirectQParams = directQParams.concat(["format=json"])


    if (props.standAlone) {
        if (props.format && "JSON" === props.format.toUpperCase()) {
            return (
                <><pre>{JSON.stringify(data, null, 2)}</pre></>
            )
        }

        const boxedDisplay = {wordWrap: "break-word", border: 0, margin:"4px",  paddingLeft:"2px"};
        const accstyle = {textAlign: "left", marginLeft:"10px", marginRight:"10px" /*width: "95%",  marginLeft:"8px"*/}

        return (
            collections.map((collection) => {
                const directURL = new URL(window.location.origin + "/query/collection/" + collection.pbotID);
                if (props.includeSpecimens) {
                    directURL.searchParams.append("includeSpecimens", "true");
                }
                if (props.includeOTUs) {
                    directURL.searchParams.append("includeOTUs", "true");
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
                                        Collection
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                                    <Typography variant="h5" sx={{marginRight: "10px"}}>
                                        Workspace: {collection.elementOf[0].name}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Paper elevation={0} sx={{padding:"2px", margin:"10px", marginTop:"15px", background:"#d0d0d0"}}>
                                <Box sx={boxedDisplay}>
                                    <b>{collection.name}</b>
                                </Box>
                                <Box sx={boxedDisplay}>
                                    <Typography variant="caption" sx={{lineHeight:0}}>PBot ID</Typography><br />{collection.pbotID}
                                </Box>
                                <Box sx={boxedDisplay}>
                                    <Typography variant="caption" sx={{lineHeight:0}}>Direct link</Typography><br /><DirectQueryLink type="collection" pbotID={collection.pbotID} params={directQParams} />
                                </Box>
                                <Box sx={boxedDisplay}>
                                    <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><DirectQueryLink type="collection" pbotID={collection.pbotID} params={jsonDirectQParams} />
                                </Box>
                                <Box sx={boxedDisplay}>
                                    <Typography variant="caption" sx={{lineHeight:0}}>PBDB ID</Typography><br />{collection.pbdbid}
                                </Box>
                            </Paper>

                            <Accordion style={accstyle} defaultExpanded={false}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="required-content"
                                    id="required-header"                        
                                >
                                    Location
                                </AccordionSummary>
                                <AccordionDetails>

                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Latitude</Typography><br />
                                        {collection.location.latitude}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Longitude</Typography><br />
                                        {collection.location.longitude}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">GPS coordinate uncertainty</Typography><br />
                                        {collection.gpsCoordinateUncertainty}
                                    </Box>
                                    <br />
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Country</Typography><br />
                                        {collection.country}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">State</Typography><br />
                                        {collection.state}
                                    </Box>
                                    <br />
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Protected site</Typography><br />
                                        {collection.protectedSite ? 'Yes' : 'No'}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Scale of geographic resolution</Typography><br />
                                        {collection.geographicResolution}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Notes on geographic information</Typography><br />
                                        {collection.geographicComments}
                                    </Box>

                                </AccordionDetails>
                            </Accordion>

                            <Accordion style={accstyle} defaultExpanded={false}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="required-content"
                                    id="required-header"                        
                                >
                                    Age
                                </AccordionSummary>
                                <AccordionDetails>

                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Timescale</Typography><br />
                                        {collection.timescale}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Max interval</Typography><br />
                                        {collection.maxinterval}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Min interval</Typography><br />
                                        {collection.mininterval}
                                    </Box>
                                    <br />
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Direct date</Typography><br />
                                        {collection.directDate}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Direct date error</Typography><br />
                                        {collection.directDateError}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Direct date type</Typography><br />
                                        {collection.directDateType}
                                    </Box>
                                    <br />
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Numeric maximum age</Typography><br />
                                        {collection.numericAgeMax}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Numeric maximum age error</Typography><br />
                                        {collection.numericAgeMaxError}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Numeric maximum age type</Typography><br />
                                        {collection.numericAgeMaxType}
                                    </Box>
                                    <br />
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Numeric minimum age</Typography><br />
                                        {collection.numericAgeMin}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Numeric minimum age error</Typography><br />
                                        {collection.numericAgeMinError}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Numeric minimum age type</Typography><br />
                                        {collection.numericAgeMinType}
                                    </Box>
                                    <br />
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Notes on age information</Typography><br />
                                        {collection.ageComments}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion style={accstyle} defaultExpanded={false}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="required-content"
                                    id="required-header"                        
                                >
                                    Geologic
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Lithology</Typography><br />
                                        {collection.lithology}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Additional lithology information</Typography><br />
                                        {collection.additionalLithology}
                                    </Box>
                                    <br />
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Stratigraphic group</Typography><br />
                                        {collection.stratigraphicGroup}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Stratigraphic formation</Typography><br />
                                        {collection.stratigraphicFormation}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Stratigraphic member</Typography><br />
                                        {collection.stratigraphicMember}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Stratigraphic bed</Typography><br />
                                        {collection.stratigraphicBed}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Notes on stratigraphy</Typography><br />
                                        {collection.stratigraphicComments}
                                    </Box>
                                    <br />
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Environment</Typography><br />
                                        {collection.environment}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Notes on environment</Typography><br />
                                        {collection.environmentComments}
                                    </Box>
                                    
                                </AccordionDetails>
                            </Accordion>

                            <Accordion style={accstyle} defaultExpanded={false}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="required-content"
                                    id="required-header"                        
                                >
                                    Collecting
                                </AccordionSummary>
                                <AccordionDetails>

                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Collection type</Typography><br />
                                        {collection.collectionType}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Preservation modes</Typography><br />
                                            {collection.preservationModes.map(pm => (
                                                <div key={pm.pbotID} >{pm.name}</div>
                                            ))}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Size classes</Typography><br />
                                            {collection.sizeClasses.map(sc => (
                                                <div key={sc} >{sc}</div>
                                            ))}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Collection methods</Typography><br />
                                        {collection.collectionMethods}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Collectors</Typography><br />
                                        {collection.collectors}
                                    </Box>
                                    <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Notes on collection methods</Typography><br />
                                        {collection.collectionComments}
                                    </Box>

                                </AccordionDetails>
                            </Accordion>

                            <Accordion style={accstyle} defaultExpanded={false}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="required-content"
                                    id="required-header"                        
                                >
                                    References
                                </AccordionSummary>
                                <AccordionDetails>

                                    {sort([...collection.references], "#order").map(reference => {
                                        const directURL = new URL(window.location.origin + "/query/reference/" + reference.Reference.pbotID);
                                        return (
                                            <Link key={reference.Reference.pbotID}  color="success.main" underline="hover" href={directURL}  target="_blank">{reference.Reference.title}, {reference.Reference.year}</Link>
                                        )
                                    })}

                                </AccordionDetails>
                            </Accordion>

                            <Accordion style={accstyle} defaultExpanded={false}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="required-content"
                                    id="required-header"                        
                                >
                                    Specimens
                                </AccordionSummary>
                                <AccordionDetails>

                                    {collection.specimens && collection.specimens.length > 0 &&
                                    <>
                                        <Specimens specimens={collection.specimens} top="true"/>
                                    </>
                                    }

                                </AccordionDetails>
                            </Accordion>

                            <Accordion style={accstyle} defaultExpanded={false}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="otus-content"
                                    id="otus-header"
                                >
                                    OTUs
                                </AccordionSummary>
                                <AccordionDetails>
                                    <OTUs collection={collection} top={true} />
                                </AccordionDetails>
                            </Accordion>

                            </>
                        }
                    </div>
                )
            })
        );
    } else {

        const boxedDisplay = {wordWrap: "break-word", border: 0, mt: "10px", paddingLeft:"2px"};

        return (
            <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="collections table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Min age</TableCell>
                            <TableCell>Max age</TableCell>
                            <TableCell>Country</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {collections.map((collection) => {
                            const directURL = new URL(window.location.origin + "/query/collection/" + collection.pbotID);
                            if (props.includeSpecimens) {
                                directURL.searchParams.append("includeSpecimens", "true");
                            }
                            if (props.includeOTUs) {
                                directURL.searchParams.append("includeOTUs", "true");
                            }
                            return (
                                <AlternatingTableRow key={collection.pbotID}>
                                    <TableCell>
                                        <DirectQueryLink style={{fontWeight:"bold"}} type="collection" pbotID={collection.pbotID} params={directQParams} text={collection.name || "(name missing)"} />
                                    </TableCell>
                                    <TableCell>
                                        {collection.mininterval}
                                    </TableCell>
                                    <TableCell>
                                        {collection.maxinterval}
                                    </TableCell>
                                    <TableCell>
                                        {collection.country}
                                    </TableCell>
                                </AlternatingTableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><DirectQueryLink type="collection" pbotID={collections} params={jsonDirectQParams} />
            </Box>

            </>
        )
    }

}

const CollectionQueryResults = ({queryParams, handleSelect}) => {
    console.log("CollectionQueryResults")
    console.log(queryParams);

    const global = useContext(GlobalContext);


    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const intervals = useFetchIntervals(
        queryParams.mininterval,
        queryParams.maxinterval,
        queryParams.includeOverlappingIntervals, 
        setLoading, setError
    );

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error.message}</p>

    console.log("overlapping intervals")
    console.log(intervals)

    console.log("queryParams.mininterval")
    console.log(queryParams.mininterval)

    return (
        <Collections 
            filters={{
                pbotID: queryParams.collectionID || null,
                name: queryParams.name ? `(?i).*${queryParams.name.replace(/\s+/, '.*')}.*` : null,
                lat: parseFloat(queryParams.lat) || null, 
                lon: parseFloat(queryParams.lon) || null,
                country: queryParams.country || null,
                state: queryParams.state || null,
                collectionType: queryParams.collectiontype || null,
                sizeClasses: queryParams.sizeclasses && queryParams.sizeclasses.length > 0 ? queryParams.sizeclasses : null,
                lithology: queryParams.lithology || null,
                environment: queryParams.environment || null,
                pbdbid: queryParams.pbdbid || null,
                stratigraphicGroup: queryParams.stratigraphicgroup || null,
                stratigraphicFormation: queryParams.stratigraphicformation || null,
                stratigraphicMember: queryParams.stratigraphicmember || null,
                stratigraphicBed: queryParams.stratigraphicbed || null,
                mininterval: queryParams.mininterval && !queryParams.includeOverlappingIntervals ?
                    JSON.parse(queryParams.mininterval).name : null,
                maxinterval: queryParams.maxinterval && !queryParams.includeOverlappingIntervals ?
                    JSON.parse(queryParams.maxinterval).name : null,
                intervals: intervals,
                collectionMethods: queryParams.collectionmethods && queryParams.collectionmethods.length > 0 ? queryParams.collectionmethods : null,
                preservationModeIDs: queryParams.preservationmodes && queryParams.preservationmodes.length > 0 ? queryParams.preservationmodes : null,
                partsPreserved: queryParams.partsPreserved && queryParams.partsPreserved.length > 0 ? queryParams.partsPreserved : null,
                notableFeatures: queryParams.notableFeatures && queryParams.notableFeatures.length > 0 ? queryParams.notableFeatures : null,
                specimens: queryParams.specimens && queryParams.specimens.length > 0 ? queryParams.specimens.map(s => s.pbotID) : null,
                enterers: queryParams.enterers && queryParams.enterers.length > 0 ?queryParams.enterers.map(({pbotID}) => pbotID)  : null, 
                references: queryParams.references && queryParams.references.length > 0 ? queryParams.references.map(r => r.pbotID) : null,
                otu: queryParams.otu || null,
                majorTaxonGroup: queryParams.majorTaxonGroup || null,
                pbdbParentTaxon: queryParams.pbdbParentTaxon || null,
                family: queryParams.family || null,
                genus: queryParams.genus || null,
                species: queryParams.species || null,
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeSpecimens={queryParams.includeSpecimens} 
            includeOTUs={queryParams.includeOTUs} 
            includeOverlappingIntervals={queryParams.includeOverlappingIntervals}
            standAlone={queryParams.standAlone} 
            handleSelect={handleSelect}
            format={queryParams.format}
        />
    );
};

export default CollectionQueryResults;
