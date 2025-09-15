import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography, Stack, List, ListItem, ListItemButton, ListItemText, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { alphabetize, AlternatingTableRow, DirectQueryLink, sort, useFetchIntervals } from '../../util.js';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import { CollectionWeb } from './CollectionWeb.js';
import { CollectionPDF } from './CollectionPDF.js';
import { Document, PDFViewer } from '@react-pdf/renderer';

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


        const massageCollection = (c) => {
            const collection = {...c}
            collection.directURL = new URL(window.location.origin + "/query/collection/" + collection.pbotID);

            if (props.includeSpecimens) {
                collection.directURL.searchParams.append("includeSpecimens", "true");
            }
            if (props.includeOTUs) {
                collection.directURL.searchParams.append("includeOTUs", "true");
            }
                
            collection.jsonURL = new URL(collection.directURL.toString());
            collection.jsonURL.searchParams.append("format", "json")

            collection.pdfURL = new URL(collection.directURL.toString());
            collection.pdfURL.searchParams.append("format", "pdf")

            return collection
        }

        const isPDF = props.format && "PDF" === props.format.toUpperCase()

        if (isPDF) {
            return (
                <>
                <PDFViewer style={{ width: '100%', height: '100vh' }}>
                    <Document>
                        <CollectionPDF collection={massageCollection(collections[0])} />
                    </Document>
                </PDFViewer>
                </>
            )
        } else {
            return (
                collections.map((collection) => {
                    const c = massageCollection(collection);
                    return (
                        <CollectionWeb key={c.pbotID} collection={c} style={{marginBottom:"20px"}} />
                    )
                })
            )           
        }
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
