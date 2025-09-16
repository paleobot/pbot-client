import React from 'react';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize, sort, AlternatingTableRow, DirectQueryLink } from '../../util.js';
import { Link, Grid, Typography, List, ListItem, ListItemButton, ListItemText, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab } from '@mui/material';
import logo from '../../PBOT-logo-transparent.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Carousel } from 'react-responsive-carousel';
import { SecureImage } from '../Image/SecureImage';
import { array } from 'yup';
import { Country, State }  from 'country-state-city';
import { Comments } from '../Comment/Comments';
import { OTUweb } from './OTUweb';
import { OTUpdf } from './OTUpdf';
import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';



const massageOTU = (o, directQParams, jsonDirectQParams, pdfDirectQParams) => {
    const otu = {...o};
    otu.directQParams = directQParams;
    otu.jsonDirectQParams = jsonDirectQParams;
    otu.pdfDirectQParams = pdfDirectQParams;

    otu.history = sort(otu.enteredBy.map(e => { 
        return {
            timestamp: e.timestamp.formatted,
            type: e.type,
            person: `${e.Person.given}${e.Person.middle ? ` ${e.Person.middle}` : ``} ${e.Person.surname}`
        }
    }), "timestamp");

    //Private group membership of Specimens can cause empty values. 
    //Here we clean that up 
    if (otu.holotypeSpecimen && !otu.holotypeSpecimen.Specimen) {
        otu.holotypeSpecimen = null;
    }
    if (otu.typeSpecimens) {
        otu.typeSpecimens = otu.typeSpecimens.filter(tS => tS.Specimen)
        console.log("typeSpecimens0")
        console.log(otu.typeSpecimens)
    }
    if (otu.identifiedSpecimens) {
        otu.identifiedSpecimens = otu.identifiedSpecimens.filter(iS => iS.Specimen)
    }

    //For display purposes, we want to clear the holotype from the type specimens list and type specimens from the identified specimens list. We put these in new fields in case we need the full lists later.
    otu.exclusiveTypeSpecimens = otu.typeSpecimens.filter(tS => 
        otu.holotypeSpecimen ? 
            tS.Specimen.pbotID !== otu.holotypeSpecimen.Specimen.pbotID :
            true
    );

    const typeIDSet = new Set(otu.typeSpecimens.map(tS => tS.Specimen.pbotID));
    otu.exclusiveIdentifiedSpecimens = otu.identifiedSpecimens.filter(tS => {
        const typeIDSet = new Set(otu.typeSpecimens.map(tS => tS.Specimen.pbotID));
        return !typeIDSet.has(tS.Specimen.pbotID)
    });

    //Gather images for holotype, type specimens, and identified specimens
    const holotypeSpecimen = otu.holotypeSpecimen
    otu.holotypeImages = (holotypeSpecimen && holotypeSpecimen.Specimen && holotypeSpecimen.Specimen.images && holotypeSpecimen.Specimen.images.length > 0) ?
        holotypeSpecimen.Specimen.images.reduce((acc, i) => {
            acc.push({
                ...i, 
                caption: `${holotypeSpecimen.Specimen.name} - ${i.caption}`,
            })
            return acc
        }, []) : []; 

    let typeImages = [];
    otu.exclusiveTypeSpecimens.forEach(tS => {
        if (tS.Specimen && tS.Specimen.images) typeImages = typeImages.concat(
            tS.Specimen.images.reduce((acc, i) => {
                acc.push({
                    ...i,
                    caption: `${tS.Specimen.name} - ${i.caption}`,
                })     
                return acc                       
            }, [])
        )
    });
    otu.typeImages = typeImages;

    let identifiedImages = [];
    otu.exclusiveIdentifiedSpecimens.forEach(tS => {
        if (tS.Specimen && tS.Specimen.images) identifiedImages = identifiedImages.concat(
            tS.Specimen.images.reduce((acc, i) => {
                acc.push({
                    ...i,
                    caption: `${tS.Specimen.name} - ${i.caption}`,
                })     
                return acc                       
            }, [])
        )
    });
    otu.identifiedImages = identifiedImages;

    //TODO: We no longer use these interval/stratigraphy/geography aggregates, but leaving this here for now in case we want to bring it back
    const minIntervals = new Set();
    const maxIntervals = new Set();
    const stratigraphicGroups = new Set();
    const stratigraphicFormations = new Set();
    const stratigraphicMembers = new Set();
    const stratigraphicBeds = new Set();
    let minLat
    let maxLat
    let minLon
    let maxLon
    const countries = new Set();
    const states = new Set();
    otu.typeSpecimens.forEach(tS => {
        minIntervals.add(tS.Specimen.collection.mininterval);
        maxIntervals.add(tS.Specimen.collection.maxinterval);
        stratigraphicGroups.add(tS.Specimen.collection.stratigraphicGroup);
        stratigraphicFormations.add(tS.Specimen.collection.stratigraphicFormation);
        stratigraphicMembers.add(tS.Specimen.collection.stratigraphicMember);
        stratigraphicBeds.add(tS.Specimen.collection.stratigraphicBed);
        minLat = minLat ? 
            tS.Specimen.collection.lat < minLat ? 
                tS.Specimen.collection.lat : 
                minLat :
                tS.Specimen.collection.lat;
        maxLat = maxLat ? 
            tS.Specimen.collection.lat > maxLat ? 
                tS.Specimen.collection.lat : 
                maxLat :
                tS.Specimen.collection.lat;
        minLon = minLon ? 
            tS.Specimen.collection.lon < minLon ? 
                tS.Specimen.collection.lon : 
                minLon :
                tS.Specimen.collection.lon;
        maxLon = maxLon ?
            tS.Specimen.collection.lon > maxLon ? 
                tS.Specimen.collection.lon : 
                maxLon :
                tS.Specimen.collection.lon;
        if (tS.Specimen.collection.country) {
            countries.add(tS.Specimen.collection.country);
            if (tS.Specimen.collection.state) {
                states.add({
                    country: tS.Specimen.collection.country,
                    state: tS.Specimen.collection.state
                })
            }
        }
    })
    otu.minIntervals = minIntervals;
    otu.maxIntervals = maxIntervals;
    otu.stratigraphicGroups = stratigraphicGroups;
    otu.stratigraphicFormations = stratigraphicFormations;
    otu.stratigraphicMembers = stratigraphicMembers;
    otu.stratigraphicBeds = stratigraphicBeds;
    otu.minLat = minLat;
    otu.maxLat = maxLat;
    otu.minLon = minLon;
    otu.maxLon = maxLon;
    otu.countries = countries;
    otu.states = states;

    return otu;
}

function OTUs(props) {
    console.log("OTUs");
    console.log(props.data);
    const otus = props.data ? alphabetize([...props.data.OTU], "name") : [];
    console.log(otus);
    
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const indent3 = {marginLeft:"6em"}
    const indent4 = {marginLeft:"8em"}
    const indent5 = {marginLeft:"10em"}
    const indent6 = {marginLeft:"12em"}
    const indent7 = {marginLeft:"14em"}
    
    if (otus.length === 0) {
        return (
            <div style={style}>
                No {(props.public) ? "public" : ""} results were found.
            </div>
        )
    }
    if (props.select) {
        return (
            <List sx={{ pt: 0 }}>
            {otus.map((otu) => (
                <ListItem disableGutters key={otu.pbotID}>
                    <ListItemButton onClick={() => props.handleSelect(otu)} >
                        <ListItemText 
                        primary={otu.name} secondary={`pbot id: ${otu.pbotID}`} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        )
    }

    const directQParams = [];
    if (props.includeSynonyms) {
        directQParams.push("includeSynonyms");
    }
    if (props.includeComments) {
        directQParams.push("includeComments");
    }
    if (props.includeHolotypeDescription) {
        directQParams.push("includeHolotypeDescription");
    }
    if (props.includeMergedDescription) {
        directQParams.push("includeMergedDescription");
    }

    const jsonDirectQParams = directQParams.concat(["format=json"])
    const pdfDirectQParams = directQParams.concat(["format=pdf"])

    if (props.standalone) {
    //TODO:Figure out a more modular way to handle nested comments query and presentation  

        if (props.format && "JSON" === props.format.toUpperCase()) {
            return (
                <><pre>{JSON.stringify(props.data, null, 2)}</pre></>
            )
        }

        /*
        if (props.format && "PDF" === props.format.toUpperCase()) {
            return <OTUpdf2 otus={otus} />;
        }
        */
        const isPDF = props.format && "PDF" === props.format.toUpperCase()

        const boxedDisplay = {wordWrap: "break-word", border: 0, margin:"4px",  paddingLeft:"2px"};
        const accstyle = {textAlign: "left", marginLeft:"10px", marginRight:"10px" /*width: "95%",  marginLeft:"8px"*/}

        if (isPDF) {
            return (
                <PDFViewer style={{ width: '100%', height: '100vh' }}>
                    <Document>
                        {otus.map((o) => {
                            const otu = massageOTU(o, directQParams, jsonDirectQParams, pdfDirectQParams);
                            return (<OTUpdf key={otu.pbotID} otu={otu} />);
                        })}
                    </Document>
                </PDFViewer>
            )
        } else {
            return (
                <>
                {otus.map((o) => {
                    const otu = massageOTU(o, directQParams, jsonDirectQParams, pdfDirectQParams);
                    return (<OTUweb key={otu.pbotID} otu={otu} />);
                })}
                </>
            )
        }

    } else {

        const boxedDisplay = {wordWrap: "break-word", border: 0, mt: "10px", paddingLeft:"2px"};

        return (
            <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="otus table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Plant part</TableCell>
                            <TableCell>Entered by</TableCell>
                       </TableRow>
                    </TableHead>
                    <TableBody>
                        {otus.map((o) => {
                            return (
                                <AlternatingTableRow key={o.pbotID}>
                                    <TableCell>
                                        <DirectQueryLink style={{fontWeight:"bold"}} type="otu" pbotID={o.pbotID} params={directQParams} text={o.name || "(name missing)"} />
                                    </TableCell>
                                    <TableCell>
                                        {o.partsPreserved.map((p, i) => {
                                            return (
                                                <span key={i}>
                                                {i > 0 ? ', ' : ''}{p.type}
                                                </span>
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {o.enteredBy.map((p, i) => {
                                            if ("CREATE" === p.type) {
                                                return (
                                                    <span key={i}>
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
                <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><DirectQueryLink type="otu" pbotID={otus} params={jsonDirectQParams} />
            </Box>

            </>
        )
    }
        
    
}


export default OTUs;
