import { Link, Grid, Typography, Stack, List, ListItem, ListItemButton, ListItemText, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { alphabetize, AlternatingTableRow, DirectQueryLink, sort, useFetchIntervals } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';
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

export const CollectionWeb = (props) => {
    console.log("CollectionWeb");
    console.log(props);
    if (!props.collection) return '';

    const collection = props.collection;

    const boxedDisplay = {wordWrap: "break-word", border: 0, margin:"4px",  paddingLeft:"2px"};
    const accstyle = {textAlign: "left", marginLeft:"10px", marginRight:"10px" /*width: "95%",  marginLeft:"8px"*/}
    const style = props.style || {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}

    return (
        <>
        <div key={collection.pbotID} style={style}>
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
                    <Typography variant="caption" sx={{lineHeight:0}}>Direct link</Typography><br /><Link color="success.main" underline="hover" href={collection.directURL} target="_blank">{collection.directURL.toString()}</Link>
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><Link color="success.main" underline="hover" href={collection.jsonURL} target="_blank">{collection.jsonURL.toString()}</Link>
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
        </div>
        </>        
    )
}
