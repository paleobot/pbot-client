import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography, List, ListItem, ListItemButton, ListItemText, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Card, Box, Stack, Accordion, AccordionDetails, AccordionSummary, OutlinedInput } from '@mui/material';
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
                        }
                        state {
                            State {
                                name
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
                $pbotID: ID, 
                $name: String, 
                ${groups} 
                $includeImages: Boolean!, 
                $includeDescriptions: Boolean!, 
                $includeOTUs: Boolean!
                ${filters.collection ? ", $collection: ID" : ""}
            ) {
                Specimen (pbotID: $pbotID, name: $name ${filter}) {
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
        return (
            specimens.map((s) => {
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
                    
                const history = sort(s.enteredBy.map(e => { 
                    return {
                        timestamp: e.timestamp.formatted,
                        type: e.type,
                        person: `${e.Person.given}${e.Person.middle ? ` ${e.Person.middle}` : ``} ${e.Person.surname}`
                    }}), "timestamp");
                console.log("history")
                console.log(history)

                const header1 = {marginLeft:"2em", marginTop:"10px"}
                const borderBoxedDisplay = {wordWrap: "break-word", border: 1, margin:"4px", paddingLeft:"2px"};
                const boxedDisplay = {wordWrap: "break-word", border: 0, margin:"4px",  paddingLeft:"2px"};
                const accstyle = {textAlign: "left", marginLeft:"10px", marginRight:"10px" /*width: "95%",  marginLeft:"8px"*/}

                return (
                <div key={s.pbotID} style={style}>
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
                                    Specimen
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                                <Typography variant="h5" sx={{marginRight: "10px"}}>
                                    Workspace: {s.elementOf[0].name}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} sx={{ml:"10px"}}>
                            <Grid item><b>direct link:</b></Grid>
                            <Grid item><Link color="success.main" underline="hover" href={directURL} target="_blank">{directURL.toString()}</Link></Grid>
                        </Grid>

                        <Paper elevation={0} sx={{padding:"2px", margin:"10px", marginTop:"15px", background:"#d0d0d0"}}>
                                        <Box sx={boxedDisplay}>
                                            <b>{s.name}</b>
                                        </Box>
                                        <Box sx={boxedDisplay}>
                                        <Typography variant="caption" sx={{lineHeight:0}}>PBot ID</Typography><br />{s.pbotID}
                                        </Box>
                                        <br />
                                        <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Repository</Typography><br />{s.repository}
                                        </Box>
                                        <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Other repository link</Typography><br />{s.otherRepositoryLink}
                                        </Box>
                                        <Box sx={boxedDisplay}>
                                        <Typography variant="caption">iDigBio InstitutionCode, CatalogNumber, uuid</Typography><br />{`${s.idigbioInstitutionCode}, ${s.idigbioCatalogNumber}, ${s.idigbiouuid}`}
                                        </Box>
                                        <br />
                                        <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Parts preserved</Typography><br />{s.partsPreserved.map((organ, index, arr) => organ.type + (index+1 === arr.length ? '' : ", "))}
                                        </Box>
                                        <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Notable features preserved</Typography><br />{s.notableFeatures.map((feature, index, arr) => feature.name + (index+1 === arr.length ? '' : ", "))}
                                        </Box>        
                                        <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Preservation modes</Typography><br />{s.preservationModes.map((pM, index, arr) => pM.name + (index+1 === arr.length ? '' : ", "))}
                                        </Box>    
                                        <br />
                                        <Box sx={boxedDisplay}>
                                        <Typography variant="caption">Data access groups</Typography><br />{s.elementOf.map((e, index, arr) => e.name + (index+1 === arr.length ? '' : ", "))} 
                                        </Box>    
                                    </Paper>


                        <Accordion style={accstyle} defaultExpanded={s.images && s.images.length > 0}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="required-content"
                                id="required-header"                        
                            >
                                Images
                            </AccordionSummary>
                            <AccordionDetails>

                                {s.images && s.images.length > 0 &&
                                <div style={carousel}>
                                {/*can't use thumbs because SecureImage does not immediately make image available*/}
                                <Carousel showThumbs={false}>  
                                    {s.images.map((image) => (
                                        <div key={image.pbotID} >
                                            {/*<img src={image.link} alt={image.caption}/>*/}
                                            <SecureImage src={image.link}/>
                                            <p className="legend">{image.caption}</p>
                                        </div>
                                    ))}
                                </Carousel>
                                </div>
                                }

                                {(!s.images || s.images.length === 0) &&
                                <div style={indent}>No images available</div>
                                }

                            </AccordionDetails>
                        </Accordion>

                        <Accordion style={accstyle} defaultExpanded={false}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="required-content"
                                id="required-header"                        
                            >
                                Location and geologic info
                            </AccordionSummary>
                            <AccordionDetails>

                                <Box sx={boxedDisplay}>
                                    <Typography variant="caption">Collection</Typography><br />
                                    <Link color="success.main" underline="hover" href={new URL(window.location.origin + "/query/collection/" + s.collection.pbotID).toString()}  target="_blank">{s.collection.name}</Link>
                                </Box>
                                <br />
                                <Box sx={boxedDisplay}><Typography variant="caption">Country</Typography><br />{s.collection.country ? 
                                                    `${Country.getCountryByCode(s.collection.country).name} (${s.collection.country})` :
                                                    ''}</Box>
                                <Box sx={boxedDisplay}><Typography variant="caption">State/province</Typography><br />{s.collection.country && 
                                                            s.collection.state ?
                                                                `${State.getStateByCodeAndCountry(s.collection.state, s.collection.country).name} (${s.collection.state})` : ''}</Box>
                                <br />
                                <Box sx={boxedDisplay}><Typography variant="caption">Geologic group</Typography><br />{s.collection.stratigraphicGroup}</Box>
                                <Box sx={boxedDisplay}><Typography variant="caption">Geologic formation</Typography><br />{s.collection.stratigraphicFormation}</Box>
                                <Box sx={boxedDisplay}><Typography variant="caption">Geologic member</Typography><br />{s.collection.stratigraphicMember}</Box>
                                <Box sx={boxedDisplay}><Typography variant="caption">Geologic bed</Typography><br />{s.collection.stratigraphicBed}</Box>
                                <br />
                                <Box sx={boxedDisplay}><Typography variant="caption">Maximum time interval</Typography><br />{s.collection.maxinterval}</Box>
                                <Box sx={boxedDisplay}><Typography variant="caption">Minimum time interval</Typography><br />{s.collection.mininterval}</Box>
 
                                {/*}
                                <Stack 
                                    spacing={{xs:2}}
                                    direction="row"
                                >
                                    <Box sx={{border: 1, margin:"4px"}}><b>collection:</b> asdkgj aslkdgj asaf</Box>
                                    <Box sx={{border: 1, margin:"4px"}}><b>country:</b> asdfdsaf</Box>
                                    <Box sx={{border: 1, margin:"4px"}}><b>state/province:</b> asdfdfda</Box>
                                </Stack>
                                */}
                                {/*
                                <Grid 
                                    container
                                    spacing={{xs:0}}
                                >
                                    <Grid
                                        item
                                        xs={6}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">Collection</Typography><br />{s.collection.name}</Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">Country</Typography><br />{s.collection.country}</Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">State/province</Typography><br />{s.collection.state}</Box>
                                    </Grid>
                                </Grid>
                                <Grid 
                                    container
                                    spacing={{xs:0}}
                                >
                                    <Grid
                                        item
                                        xs={3}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">Geologic group</Typography><br />{s.collection.stratigraphicGroup}</Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">Geologic formation</Typography><br />{s.collection.stratigraphicFormation}</Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">Geologic member</Typography><br />{s.collection.stratigraphicMember}</Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">Geologic bed</Typography><br />{s.collection.stratigraphicBed}</Box>
                                    </Grid>
                                </Grid>
                                <Grid 
                                    container
                                    spacing={{xs:0}}
                                >
                                    <Grid
                                        item
                                        xs={6}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">Maximum time interval</Typography><br />{s.collection.maxinterval}</Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                    >
                                        <Box sx={boxedDisplay}><Typography variant="caption">Minimum time interval</Typography><br />{s.collection.mininterval}</Box>
                                    </Grid>
                                </Grid>
                            */}

                            </AccordionDetails>
                        </Accordion>

                        <Accordion style={accstyle} defaultExpanded={false}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="required-content"
                                id="required-header"                        
                            >
                                Taxonomic data
                            </AccordionSummary>
                            <AccordionDetails>

                                {s.identifiedAs && s.identifiedAs.length > 0 &&
                                <TableContainer component={Paper}>
                                        <Table sx={{width:"100%", mr:"10px"}} aria-label="taxonomy table">
                                            <TableBody>
                                                {s.identifiedAs.map((otu, index, arr) => {
                                                    return (
                                                        <AlternatingTableRow key={otu.OTU.pbotID}>
                                                            <TableCell align="left" sx={{fontSize: "1rem"}}>
                                                                <Box sx={boxedDisplay}><Typography variant="caption">Example of taxon/OTU</Typography><br />
                                                                    <Link color="success.main" underline="hover" href={new URL(window.location.origin + "/query/otu/" + otu.OTU.pbotID).toString()}  target="_blank">{otu.OTU.name}</Link>
                                                                </Box>

                                                                <Box sx={boxedDisplay}><Typography variant="caption">Exemplar specimen type</Typography><br />{
                                                                            s.holotypeOf && s.holotypeOf.length > 0 && s.holotypeOf.map(h => h.OTU.pbotID).includes(otu.OTU.pbotID) ? 'holotype' : 
                                                                                s.typeOf && s.typeOf.length > 0 && s.typeOf.map(t => t.OTU.pbotID).includes(otu.OTU.pbotID) ? 'other' : 
                                                                                    ''}</Box>

                                                                <Box sx={boxedDisplay}><Typography variant="caption">Major Taxon group</Typography><br />{otu.OTU.majorTaxonGroup}</Box>

                                                                <Box sx={boxedDisplay}><Typography variant="caption">Parent taxon</Typography><br />{otu.OTU.pbdbParentTaxon}</Box>

                                                                <Box sx={boxedDisplay}><Typography variant="caption">Identified by</Typography><br />{s.identifiers.map((i, index, arr) => i.given + " " + i.middle + " " + i.surname + (index+1 === arr.length ? '' : ", "))}</Box>
                                                            </TableCell>
                                                        </AlternatingTableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                }

                                {(!s.identifiedAs || s.identifiedAs.length === 0) &&
                                <div style={indent}>No taxonomic available</div>
                                }


                            </AccordionDetails>
                        </Accordion>

                        <Accordion style={accstyle} defaultExpanded={false}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="required-content"
                                id="required-header"                        
                            >
                                Descriptions
                            </AccordionSummary>
                            <AccordionDetails>

                                {s.describedBy && s.describedBy.length > 0 && s.describedBy[0].Description &&
                                    <TableContainer component={Paper}>
                                    <Table sx={{width:"100%", mr:"10px"}} aria-label="description table">
                                        <TableBody>
                                            {s.describedBy.map((d, idx) => {
                                                return (
                                                    <AlternatingTableRow key={d.Description.pbotID}>
                                                        <TableCell align="left" sx={{fontSize: "1rem"}}>
                                                            <div><b>From schema "{d.Description.schema.title}"</b></div>
                                                            {d.Description.writtenDescription &&
                                                                <div style={indent}><b>written description:</b> {d.Description.writtenDescription}</div>
                                                            }
                                                            {d.Description.notes &&
                                                                <div style={indent}><b>notes:</b> {d.Description.notes}</div>
                                                            }
                                                            {(d.Description.characterInstances && d.Description.characterInstances.length > 0) &&
                                                            <div>
                                                                <div style={indent}><b>character states:</b></div>
                                                                <CharacterInstances style={indent2}  characterInstances={d.Description.characterInstances} />
                                                            </div>
                                                            }
                                                        </TableCell>
                                                    </AlternatingTableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                }

                                {(!s.describedBy || s.describedBy.length === 0 || !s.describedBy[0].Description) &&
                                <div style={indent}>No descriptions available</div>
                                }                            
                            </AccordionDetails>
                        </Accordion>


                        <Accordion style={accstyle} defaultExpanded={false}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="required-content"
                                id="required-header"                        
                            >
                                History
                            </AccordionSummary>
                            <AccordionDetails>
                                         <TableContainer component={Paper}>
                                            <Table sx={{width:"100%", mr:"10px"}} aria-label="history table">
                                                <TableBody>
                                                    {history.map(eb => {
                                                    return (
                                                            <AlternatingTableRow key={eb.timestamp}>
                                                                <TableCell align="left">
                                                                    {eb.timestamp}
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    {eb.type}
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    {eb.person}
                                                                </TableCell>
                                                            </AlternatingTableRow>
                                                    )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        
                            </AccordionDetails>
                        </Accordion>

                        <Accordion style={accstyle} defaultExpanded={false}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="required-content"
                                id="required-header"                        
                            >
                                Notes
                            </AccordionSummary>
                            <AccordionDetails>
                                {s.notes}
                            </AccordionDetails>
                        </Accordion>


                        <Accordion style={accstyle} defaultExpanded={false}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="required-content"
                                id="required-header"                        
                            >
                                Comments
                            </AccordionSummary>
                            <AccordionDetails>
                                Comments have not been implemented for Specimens. This is a placeholder.
                            </AccordionDetails>
                        </Accordion>

                        <br />
                        </>
                    }

                </div>
                )
            })
        );
    } else {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="specimens table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
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

    return (
        <Specimens 
            filters={{
                pbotID: queryParams.specimenID,
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
            includeImages={true}
            includeDescriptions={true} 
            includeOTUs={true} 
            standAlone={queryParams.standAlone} 
            handleSelect={handleSelect}
            exclude={exclude}
        />
    );
};

export default SpecimenQueryResults;
