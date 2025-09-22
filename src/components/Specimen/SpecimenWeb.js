import { Link, Grid, Typography, List, ListItem, ListItemButton, ListItemText, TableContainer, Table, TableBody, Paper, TableCell, TableHead, TableRow, Card, Box, Stack, Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import {Carousel} from 'react-responsive-carousel'
import {SecureImage} from '../Image/SecureImage.js';
import logo from '../../PBOT-logo-transparent.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Country, State }  from 'country-state-city';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize, sort, AlternatingTableRow, useFetchIntervals } from '../../util.js';

export const SpecimenWeb = (props) => {
    //console.log("SpecimenWeb");
    const s = props.specimen;
    if (!s) return ''; //TODO: is this the best place to handle this?
    //console.log(s);

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const indent3 = {marginLeft:"6em"}
    const carousel = {width: "60%", marginLeft: "2em", borderStyle:"solid"}
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

            <Paper elevation={0} sx={{padding:"2px", margin:"10px", marginTop:"15px", background:"#d0d0d0"}}>
                <Box sx={boxedDisplay}>
                    <b>{s.name}</b>
                </Box>
                <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>PBot ID</Typography><br />{s.pbotID}
                </Box>
                <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>Direct link</Typography><br /><Link color="success.main" underline="hover" href={s.directURL} target="_blank">{s.directURL.toString()}</Link>
                </Box>
                <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><Link color="success.main" underline="hover" href={s.jsonURL} target="_blank">{s.jsonURL.toString()}</Link>
                </Box>
                <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>PDF link</Typography><br /><Link color="success.main" underline="hover" href={s.pdfURL} target="_blank">{s.pdfURL.toString()}</Link>
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
                        <Link color="success.main" underline="hover" href={new URL(window.location.origin + "/query/collection/" + s.collection.pbotID + "?includeSpecimens=true").toString()}  target="_blank">{s.collection.name}</Link>
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
                                                        <Link color="success.main" underline="hover" href={new URL(window.location.origin + "/query/otu/" + otu.OTU.pbotID + "?includeHolotypeDescription=true&includeMergedDescription=true").toString()}  target="_blank">{otu.OTU.name}</Link>
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
                                        {s.history.map(eb => {
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
}
