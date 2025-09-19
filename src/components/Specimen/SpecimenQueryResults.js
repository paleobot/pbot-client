import React, {useState} from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography, List, ListItem, ListItemButton, ListItemText, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Card, Box, Stack, Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize, sort, AlternatingTableRow, useFetchIntervals } from '../../util.js';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel'
import {SecureImage} from '../Image/SecureImage.js';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import { SpecimenFilterHelper } from './SpecimenFilterHelper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Country, State }  from 'country-state-city';
import { SpecimenWeb } from './SpecimenWeb.js';
import { SpecimenPdf } from './SpecimenPdf.js';
import { Document, Page, PDFViewer, Text, View } from '@react-pdf/renderer';

function Specimens(props) {
    console.log("SpecimenQueryResults Specimens");
    console.log(props);

    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    console.log(filters)

    const groups = props.standAlone ? '' : '$groups: [ID!] ';
    /*
    const filter = props.standAlone ? '' : `,  filter: {
        ${filters.collection ?
            "AND: [{elementOf_some: {pbotID_in: $groups}}, {collection: {pbotID: $collection}}]" : 
            "elementOf_some: {pbotID_in: $groups}"
        }
    }`;
    */

    const filter = SpecimenFilterHelper(filters, props);
    console.log(filter)

    const fields = 
        props.standAlone ?
        `
            pbotID
            name
            specimenNumber
            collection {
                pbotID
                name
                country
                state
                stratigraphicGroup
                stratigraphicFormation
                stratigraphicMember
                stratigraphicBed
                maxinterval
                mininterval
            
            }
            repository
            otherRepositoryLink
            notes
            identifiers {
                given
                middle
                surname
            } 
            preservationModes {
                name
            }
            idigbioInstitutionCode
            idigbioCatalogNumber
            idigbiouuid
            pbdboccid
            partsPreserved {
                type
            }
            notableFeatures {
                name
            }
            elementOf {
                name
            }
            references (orderBy: order_asc) {
                Reference {
                    title
                    year
                }
                order
            }
            enteredBy {
                timestamp {
                    formatted
                }
                type
                Person {
                    given
                    middle
                    surname
                }
            }
            images @include(if: $includeImages) {
                pbotID
                link
                caption
            }
            describedBy @include(if: $includeDescriptions) {
                Description {
                    pbotID
                    name
                    writtenDescription
                    notes
                    schema {
                        title
                    }
                    characterInstances {
                        pbotID
                        character {
                            name
                            deepOrder
                        }
                        state {
                            State {
                                name
                                deepOrder
                            }
                            value
                        }
                    }
                }
            }
            identifiedAs @include(if: $includeOTUs){
                OTU {
                    pbotID
                    name
                    family
                    genus
                    species
                    majorTaxonGroup
                    pbdbParentTaxon
                }
            }
            typeOf @include(if: $includeOTUs){
                OTU {
                    pbotID
                    name
                    family
                    genus
                    species
                }
            }
            holotypeOf @include(if: $includeOTUs){
                OTU {
                    pbotID
                    name
                    family
                    genus
                    species
                }
            }
        `
        : props.handleSelect ?
        `
            pbotID
            name
            collection {
                name
                pbotID
            }
            repository
            otherRepositoryLink
            notes
            identifiers {
                given
                surname
                pbotID
            } 
            preservationModes {
                name
                pbotID
            }
            idigbioInstitutionCode
            idigbioCatalogNumber
            idigbiouuid
            pbdboccid
            partsPreserved {
                type
                pbotID
            }
            notableFeatures {
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
            partsPreserved {
                type
            }
            collection {
                country
                mininterval
                maxinterval
            }
            enteredBy {
                type
                Person {
                    given
                    surname
                }
            }
        `;

    let gQL;
    if (!props.standAlone) {

        //To support an AND query on mulitiple character instances, we must generate a
        //query clause for each. A fully specified character instance includes a schema,
        //a character, and a state. There must be an explicit query variable for each 
        //schema, character, and state. These are set up here.
        //
        //We allow partial specification (i.e. can specify only a schema or a schema 
        //and character). 
        let schemaIDstrings = [], characterIDstrings = [], stateIDstrings = []
        if (filters.characterInstances) {
            filters.characterInstances.forEach((ci,i) => {
                schemaIDstrings[i] = `, $schema${i}: ID`;
                filters[`schema${i}`] = ci.schema;
                if (ci.character) {
                    characterIDstrings[i] = `, $character${i}: ID`;
                    filters[`character${i}`] = ci.character;
                }
                if (ci.state) {
                    stateIDstrings[i] = `, $state${i}: ID`;
                    filters[`state${i}`] = ci.state;
                }   
            })
        }

        gQL = gql`
            query (
                $pbotID: ID, 
                ${filters.name ? ", $name: String" : ""}
                $idigbioInstitutionCode: String, 
                $idigbioCatalogNumber: String, 
                $idigbiouuid: String, 
                $repository: String,
                ${groups} 
                ${filters.preservationModes ? ", $preservationModes: [ID!]" : ""} 
                ${filters.partsPreserved ? ", $partsPreserved: [ID!]" : ""} 
                ${filters.notableFeatures ? ", $notableFeatures: [ID!]" : ""} 
                ${filters.identifiers ? ", $identifiers: [ID!]" : ""} 
                ${filters.enterers ? ", $enterers: [ID!]" : ""} 
                ${filters.references ? ", $references: [ID!]" : ""}
                ${filters.collection ? ", $collection: ID" : ""} 
                ${schemaIDstrings}
                ${characterIDstrings}
                ${stateIDstrings}
                ${filters.description ? ", $description: ID" : ""},
                ${filters.identifiedAs ? ", $identifiedAs: ID" : ""},
                ${filters.typeOf ? ", $typeOf: ID" : ""},
                ${filters.holotypeOf ? ", $holotypeOf: ID" : ""},
                ${filters.majorTaxonGroup ? ", $majorTaxonGroup: String" : ""}
                ${filters.pbdbParentTaxon ? ", $pbdbParentTaxon: String" : ""}
                ${filters.family ? ", $family: String" : ""}
                ${filters.genus ? ", $genus: String" : ""}
                ${filters.species ? ", $species: String" : ""}
                ${filters.mininterval ? ", $mininterval: String" : ""}
                ${filters.maxinterval ? ", $maxinterval: String" : ""}
                ${filters.lat ? ", $lat: Float" : ""}
                ${filters.lon ? ", $lon: Float" : ""}
                ${filters.country ? ", $country: String" : ""}
                ${filters.state ? ", $state: String" : ""}
                ${filters.stratigraphicGroup ? ", $stratigraphicGroup: String" : ""}
                ${filters.stratigraphicFormation ? ", $stratigraphicFormation: String" : ""}
                ${filters.stratigraphicMember ? ", $stratigraphicMember: String" : ""}
                ${filters.stratigraphicBed ? ", $stratigraphicBed: String" : ""}
                ${filters.intervals ? ", $intervals: [String!]" : ""}
                $excludeList: [ID!]
            ) {
                Specimen (
                    pbotID: $pbotID, 
                    idigbioInstitutionCode: $idigbioInstitutionCode, 
                    idigbioCatalogNumber: $idigbioCatalogNumber, 
                    idigbiouuid: $idigbiouuid, 
                    repository: $repository
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
                ${groups} 
                $includeImages: Boolean!, 
                $includeDescriptions: Boolean!, 
                $includeOTUs: Boolean!
                ${filters.collection ? ", $collection: ID" : ""}
            ) {
                Specimen (
                    ${filters.pbotID && !Array.isArray(filters.pbotID) ?
                        "pbotID: $pbotID" : ""}, 
                    name: $name 
                    ${filter}) {
                    ${fields}
                }            
            }
        `;
    }
    
    //For SpecimenManager applications, omit specimens that are already in the list
    const excludeIDs = props.exclude ? props.exclude.map(specimen => specimen.pbotID) : [];
    console.log(excludeIDs)
    console.log(gQL)
 
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters,
            includeImages: props.includeImages,
            includeDescriptions: props.includeDescriptions,
            includeOTUs: props.includeOTUs,
            excludeList: excludeIDs,
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const specimens = alphabetize([...data.Specimen], "name");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const indent3 = {marginLeft:"6em"}
    const carousel = {width: "60%", marginLeft: "2em", borderStyle:"solid"}
    if (specimens.length === 0) {
        return (
            <div style={style}>
                No {(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
            </div>
        )
    }
    if (props.handleSelect) {
        console.log("Manager results")
        return (
            <List sx={{ pt: 0 }}>
            {specimens.map((specimen) => (
                <ListItem disableGutters key={specimen.pbotID}>
                    <ListItemButton onClick={() => props.handleSelect(specimen)} >
                        <ListItemText 
                        primary={specimen.name} secondary={`pbot id: ${specimen.pbotID}`} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        )
    }
    if (props.standAlone) {
        if (props.format && "JSON" === props.format.toUpperCase()) {
            return (
                <><pre>{JSON.stringify(data, null, 2)}</pre></>
            )
        }

        const massageSpecimen = (sp) => {
            const s = {...sp}
            s.directURL = new URL(window.location.origin + "/query/specimen/" + s.pbotID);
            if (props.includeImages) {
                s.directURL.searchParams.append("includeImages", "true");
            }
            if (props.includeDescriptions) {
                s.directURL.searchParams.append("includeDescriptions", "true");
            }
            if (props.includeOTUs) {
                s.directURL.searchParams.append("includeOTUs", "true");
            }
                
            s.jsonURL = new URL(s.directURL.toString());
            s.jsonURL.searchParams.append("format", "json")

            s.pdfURL = new URL(s.directURL.toString());
            s.pdfURL.searchParams.append("format", "pdf")

            s.history = sort(s.enteredBy.map(e => { 
                return {
                    timestamp: e.timestamp.formatted,
                    type: e.type,
                    person: `${e.Person.given}${e.Person.middle ? ` ${e.Person.middle}` : ``} ${e.Person.surname}`
                }}), "timestamp");
            console.log("history")
            console.log(s.history)
            return s
        }

        const isPDF = props.format && "PDF" === props.format.toUpperCase()

        if (isPDF) {
            return (
                <>
                <PDFViewer style={{ width: '100%', height: '100vh' }}>
                    <Document>
                        {specimens.map((s) => {
                            return (
                                <SpecimenPdf key={s.pbotID} specimen={massageSpecimen(s)} standAlone={props.standAlone} />
                            );
                        })}
                    </Document>
                </PDFViewer>
                </>
            );
        } else {
            return (
                specimens.map((s) => {
                    //const specimen = massageSpecimen(s);
                    return (<SpecimenWeb key={s.pbotID} specimen={massageSpecimen(s)} standAlone={props.standAlone} />);
                })
            );
        }
    } else {

        const jsonURL = new URL(window.location.origin + "/query/specimen/" + specimens.reduce((acc, s) => {
            return '' === acc ?
                s.pbotID :
                acc + "," + s.pbotID
        }, ''));
        if (props.includeImages) {
            jsonURL.searchParams.append("includeImages", "true");
        }
        if (props.includeDescriptions) {
            jsonURL.searchParams.append("includeDescriptions", "true");
        }
        if (props.includeOTUs) {
            jsonURL.searchParams.append("includeOTUs", "true");
        }
        const pdfURL = new URL(jsonURL.toString());
        jsonURL.searchParams.append("format", "json")
        pdfURL.searchParams.append("format", "pdf")

        const boxedDisplay = {wordWrap: "break-word", border: 0, mt: "10px", paddingLeft:"2px"};

        return (
            <>
                        
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="specimens table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Specimen number</TableCell>
                            <TableCell>Parts preserved</TableCell>
                            <TableCell>Min age</TableCell>
                            <TableCell>Max age</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Entered by</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {specimens.map((s) => {
                            const directURL = new URL(window.location.origin + "/query/specimen/" + s.pbotID);
                            if (props.includeImages) {
                                directURL.searchParams.append("includeImages", "true");
                            }
                            if (props.includeDescriptions) {
                                directURL.searchParams.append("includeDescriptions", "true");
                            }
                            if (props.includeOTUs) {
                                directURL.searchParams.append("includeOTUs", "true");
                            }
                            return (
                                <AlternatingTableRow key={s.pbotID}>
                                    <TableCell align="left">
                                        <Link color="success.main" underline="hover" href={directURL}  target="_blank"><b>{s.name || "(name missing)"}</b></Link>
                                    </TableCell>
                                    <TableCell>
                                        {s.partsPreserved.map((p, i) => {
                                            return (
                                                <span key={p.type}>
                                                {i > 0 ? ', ' : ''}{p.type}
                                                </span>
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {s.collection.mininterval}
                                    </TableCell>
                                    <TableCell>
                                        {s.collection.maxinterval}
                                    </TableCell>
                                    <TableCell>
                                        {s.collection.country}
                                    </TableCell>
                                    <TableCell>
                                        {s.enteredBy.map((p) => {
                                            if ("CREATE" === p.type) {
                                                return (
                                                    <span key={p.Person.given+p.Person.middle+p.Person.surname}>
                                                    {`${p.Person.given}${p.Person.middle ? ` ${p.Person.middle}` : ''} ${p.Person.surname}`}
                                                    </span>
                                                )
                                            } else {
                                                return ('')
                                            }
                                        })}
                                    </TableCell>
                                </AlternatingTableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><Link color="success.main" underline="hover" href={jsonURL} target="_blank">{jsonURL.toString()}</Link>
            </Box>
            <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>PDF link</Typography><br /><Link color="success.main" underline="hover" href={pdfURL} target="_blank">{pdfURL.toString()}</Link>
            </Box>

        </>
        )
    }

}

const SpecimenQueryResults = ({queryParams, handleSelect, exclude}) => {
    console.log("SpecimenQueryResults");
    console.log(queryParams); 

    console.log(queryParams.characterInstances)
    
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

    //To support an AND query on mulitiple character instances, we must generate a
    //query clause for each. A fully specified character instance includes a schema,
    //a character, and a state. There must be an explicit query variable for each 
    //schema, character, and state. These are set up here.
    //
    //To streamline the UI, we allow multiple states to be entered for a given 
    //character. This results in a nested array, which must be flattened.
    let characterInstances;
    if (queryParams.characterInstances && queryParams.characterInstances.length > 0) {
        characterInstances = queryParams.characterInstances.reduce((acc, ci) => {
            console.log(ci)
            if (ci.states && ci.states.length > 0) {
                ci.states.filter(n => n !== '').forEach((s) => {
                    console.log(s)
                    acc.push({
                        schema: ci.schema,
                        character: ci.character,
                        state: s.split("~,")[1]
                    });
                })
            } else if (ci.character) { 
                acc.push({
                    schema: ci.schema,
                    character: ci.character
                })
            } else {
                acc.push({
                    schema: ci.schema,
               })
            }
            return acc;
        }, [])
    }
    console.log("Flattened characterInstances")
    console.log(characterInstances)

    console.log(queryParams.specimenID)

    return (
        <Specimens 
            filters={{
                pbotID: queryParams.specimenID || null,
                name: queryParams.name ? `(?i).*${queryParams.name.replace(/\s+/, '.*')}.*` : null,
                description: queryParams.description || null,
                identifiedAs: queryParams.identifiedAs || null,
                typeOf: queryParams.typeOf || null,
                holotypeOf: queryParams.holotypeOf || null,
                characterInstances: characterInstances || null,
                collection: queryParams.collection || null, 
                partsPreserved: queryParams.partsPreserved && queryParams.partsPreserved.length > 0 ? queryParams.partsPreserved : null,
                notableFeatures: queryParams.notableFeatures && queryParams.notableFeatures.length > 0 ? queryParams.notableFeatures : null,
                preservationModes: queryParams.preservationModes && queryParams.preservationModes.length > 0 ? queryParams.preservationModes : null,
                idigbioInstitutionCode: queryParams.idigbioInstitutionCode || null,
                idigbioCatalogNumber: queryParams.idigbioCatalogNumber || null,
                idigbiouuid: queryParams.idigbiouuid || null,
                repository: queryParams.repository || null,
                references: queryParams.references && queryParams.references.length > 0 ? queryParams.references.map(r => r.pbotID) : null,
                identifiers: queryParams.identifiers && queryParams.identifiers.length > 0 ?queryParams.identifiers.map(({pbotID}) => pbotID)  : null, 
                enterers: queryParams.enterers && queryParams.enterers.length > 0 ?queryParams.enterers.map(({pbotID}) => pbotID)  : null, 
                majorTaxonGroup: queryParams.majorTaxonGroup || null,
                pbdbParentTaxon: queryParams.pbdbParentTaxon || null,
                family: queryParams.family || null,
                genus: queryParams.genus || null,
                species: queryParams.species || null,
                mininterval: queryParams.mininterval && !queryParams.includeOverlappingIntervals ?
                    JSON.parse(queryParams.mininterval).name : null,
                maxinterval: queryParams.maxinterval && !queryParams.includeOverlappingIntervals ?
                    JSON.parse(queryParams.maxinterval).name : null,
                intervals: intervals,
                lat: parseFloat(queryParams.lat) || null, 
                lon: parseFloat(queryParams.lon) || null,
                country: queryParams.country || null,
                state: queryParams.state || null,
                stratigraphicGroup: queryParams.stratigraphicgroup || null,
                stratigraphicFormation: queryParams.stratigraphicformation || null,
                stratigraphicMember: queryParams.stratigraphicmember || null,
                stratigraphicBed: queryParams.stratigraphicbed || null,
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeOverlappingIntervals={queryParams.includeOverlappingIntervals}
            includeImages={queryParams.includeImages}
            includeDescriptions={queryParams.includeDescriptions} 
            includeOTUs={queryParams.includeOTUs} 
            standAlone={queryParams.standAlone} 
            handleSelect={handleSelect}
            exclude={exclude}
            format={queryParams.format}
        />
    );
};

export default SpecimenQueryResults;
