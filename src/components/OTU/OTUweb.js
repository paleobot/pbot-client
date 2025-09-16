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

const ImageTabs = ({holotypeImages, typeImages, identifiedImages}) => {
    const [value, setValue] = React.useState(
        holotypeImages && holotypeImages.length > 0 ? '1' :
        typeImages && typeImages.length > 0 ? '2' : 
        identifiedImages && identifiedImages.length > 0 ? '3' : '1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const carousel = {width: "60%", marginLeft: "2em", borderStyle:"solid"}
  
    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="type images" textColor="secondary" indicatorColor="secondary">
                    <Tab label="Holotype images" value="1" />
                    <Tab label="Other type images" value="2" />
                    <Tab label="Identified specimen images" value="3" />
                </TabList>
            </Box>
            <TabPanel value="1">
                {holotypeImages && holotypeImages.length > 0 &&
                <div style={carousel}>
                {/*can't use thumbs because SecureImage does not immediately make image available*/}
                <Carousel showThumbs={false}>  
                    {holotypeImages.map((image) => (
                        <div key={image.pbotID} >
                            {/*<img src={image.link} alt={image.caption}/>*/}
                            <SecureImage src={image.link}/>
                            <p className="legend">{image.caption}</p>
                        </div>
                    ))}
                </Carousel>
                </div>
                }

                {(!holotypeImages || holotypeImages.length === 0) &&
                    <div>No holotype images available</div>
                }
            </TabPanel>
            <TabPanel value="2">
            {typeImages && typeImages.length > 0 &&
                <div style={carousel}>
                {/*can't use thumbs because SecureImage does not immediately make image available*/}
                <Carousel showThumbs={false}>  
                    {typeImages.map((image) => (
                        <div key={image.pbotID} >
                            {/*<img src={image.link} alt={image.caption}/>*/}
                            <SecureImage src={image.link}/>
                            <p className="legend">{image.caption}</p>
                        </div>
                    ))}
                </Carousel>
                </div>
                }

                {(!typeImages || typeImages.length === 0) &&
                    <div>No type images available</div>
                }
            </TabPanel>
            <TabPanel value="3">
            {identifiedImages && identifiedImages.length > 0 &&
                <div style={carousel}>
                {/*can't use thumbs because SecureImage does not immediately make image available*/}
                <Carousel showThumbs={false}>  
                    {identifiedImages.map((image) => (
                        <div key={image.pbotID} >
                            {/*<img src={image.link} alt={image.caption}/>*/}
                            <SecureImage src={image.link}/>
                            <p className="legend">{image.caption}</p>
                        </div>
                    ))}
                </Carousel>
                </div>
                }

                {(!identifiedImages || identifiedImages.length === 0) &&
                    <div>No indentified specimen images available</div>
                }
            </TabPanel>
        </TabContext>
      </Box>
    );
}


// SpecimenTable: reusable table for holotype, other type specimens, and additional specimens
function SpecimenTable({ title, specimens }) {
    const specimenDirectQParams = ["includeImages", "includeDescriptions", "includeOTUs"];
    const indent = { marginLeft: "2em" };
    return (
        <>
            <div style={indent}><b>{title}</b></div>
            <Box sx={{ overflowX: 'auto', maxWidth: '90%' }}>
                <TableContainer component={Paper} style={{ marginLeft: '2em', marginBottom: '1em', minWidth: 600, maxWidth: '90%'}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Specimen name</TableCell>
                                <TableCell>Collection name</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Min interval</TableCell>
                                <TableCell>Max interval</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {specimens
                                .filter(s => s.Specimen && s.Specimen.collection)
                                .sort((a, b) => {
                                    const nameA = a.Specimen.collection.name || '';
                                    const nameB = b.Specimen.collection.name || '';
                                    return nameA.localeCompare(nameB);
                                })
                                .map(s => (
                                    <TableRow key={s.Specimen.pbotID}>
                                        <TableCell>
                                            <DirectQueryLink type="specimen" pbotID={s.Specimen.pbotID} params={specimenDirectQParams}>
                                                {s.Specimen.name}
                                            </DirectQueryLink>
                                        </TableCell>
                                        <TableCell>
                                            <DirectQueryLink
                                                type="collection"
                                                pbotID={s.Specimen.collection.pbotID}
                                                params={["includeSpecimens", "includeOTUs"]}
                                            >
                                                {s.Specimen.collection.name}
                                            </DirectQueryLink>
                                        </TableCell>
                                        <TableCell>{s.Specimen.collection.country}</TableCell>
                                        <TableCell>{s.Specimen.collection.mininterval}</TableCell>
                                        <TableCell>{s.Specimen.collection.maxinterval}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}

export const OTUweb = (props) => {

    let { pbotID, name, authority, diagnosis, qualityIndex, majorTaxonGroup, pbdbParentTaxon, family, genus, pfnGenusLink, species, pfnSpeciesLink, additionalClades, holotypeSpecimen, typeSpecimens, identifiedSpecimens, mergedDescription, synonyms, elementOf, notes, partsPreserved, notableFeatures, enteredBy, directQParams, jsonDirectQParams, pdfDirectQParams, history, holotypeImages, typeImages, identifiedImages, minIntervals, maxIntervals, stratigraphicGroups, stratigraphicFormations, stratigraphicMembers, stratigraphicBeds, minLat, maxLat, minLon, maxLon, countries, states, exclusiveTypeSpecimens, exclusiveIdentifiedSpecimens} = props.otu;

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const indent3 = {marginLeft:"6em"}
    const indent4 = {marginLeft:"8em"}
    const indent5 = {marginLeft:"10em"}
    const indent6 = {marginLeft:"12em"}
    const indent7 = {marginLeft:"14em"}
    const boxedDisplay = {wordWrap: "break-word", border: 0, margin:"4px",  paddingLeft:"2px"};
    const accstyle = {textAlign: "left", marginLeft:"10px", marginRight:"10px" /*width: "95%",  marginLeft:"8px"*/}

    /*
    Moving to OTUs.js
    //Private group membership of Specimens can cause empty values. 
    //Here we clean that up 
    if (holotypeSpecimen && !holotypeSpecimen.Specimen) {
        holotypeSpecimen = null;
    }
    if (typeSpecimens) {
        typeSpecimens = typeSpecimens.filter(tS => tS.Specimen)
        console.log("typeSpecimens0")
        console.log(typeSpecimens)
    }
    if (identifiedSpecimens) {
        identifiedSpecimens = identifiedSpecimens.filter(iS => iS.Specimen)
    }
    */

    const header1 = {marginLeft:"2em", marginTop:"10px"}
    return (
        <div key={pbotID} style={style}>
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
                            OTU
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                        <Typography variant="h5" sx={{marginRight: "10px"}}>
                            Workspace: {elementOf[0].name}
                        </Typography>
                    </Grid>
                </Grid>

                <Paper elevation={0} sx={{padding:"2px", margin:"10px", marginTop:"15px", background:"#d0d0d0"}}>
                    <Box sx={boxedDisplay}>
                        <b>{name}</b>
                    </Box>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>PBot ID</Typography><br />{pbotID}
                    </Box>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Direct link</Typography><br /><DirectQueryLink type="otu" pbotID={pbotID} params={directQParams} />
                    </Box>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><DirectQueryLink type="otu" pbotID={pbotID} params={jsonDirectQParams} />
                    </Box>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>PDF link</Typography><br /><DirectQueryLink type="otu" pbotID={pbotID} params={pdfDirectQParams} />
                    </Box>
                    <br />
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Authority</Typography><br />{authority}
                    </Box>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Quality index</Typography><br />{qualityIndex}
                    </Box>
                    <br />

                    <Box sx={boxedDisplay}>
                        <Typography variant="caption">Parts preserved</Typography><br />{partsPreserved.map((organ, index, arr) => organ.type + (index+1 === arr.length ? '' : ", "))}
                    </Box>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption">Notable features preserved</Typography><br />{notableFeatures.map((feature, index, arr) => feature.name + (index+1 === arr.length ? '' : ", "))}
                    </Box>        
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption">Data access groups</Typography><br />{elementOf.map((e, index, arr) => e.name + (index+1 === arr.length ? '' : ", "))} 
                    </Box>    
                </Paper>

                <Accordion style={accstyle} defaultExpanded={holotypeImages.length > 0 || typeImages.length > 0}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Images
                    </AccordionSummary>
                    <AccordionDetails>

                        <ImageTabs holotypeImages={holotypeImages} typeImages={typeImages} identifiedImages={identifiedImages}/>

                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Taxonomy
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={boxedDisplay}><Typography variant="caption">Major Taxon group</Typography><br />{majorTaxonGroup}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Family</Typography><br />{family}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Genus</Typography><br />{genus}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Specific epithet</Typography><br />{species}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Parent taxon</Typography><br />{pbdbParentTaxon}</Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Diagnosis
                    </AccordionSummary>
                    <AccordionDetails>
                        {diagnosis}
                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Holotype descriptions
                    </AccordionSummary>
                    <AccordionDetails>
                        {holotypeSpecimen && 
                            holotypeSpecimen.Specimen.describedBy && 
                            holotypeSpecimen.Specimen.describedBy[0] &&
                            holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances && holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances.length > 0 &&            
                            <> 
                            <TableContainer component={Paper}>
                            <Table sx={{width:"100%", mr:"10px"}} aria-label="description table">
                                <TableBody>
                                        {alphabetize([...holotypeSpecimen.Specimen.describedBy], "Description.schema.title").map((d, i) => (
                                            <AlternatingTableRow key={d.Description.pbotID}>
                                                <TableCell align="left" sx={{fontSize: "1rem"}}>
                                                    <div ><b>From schema "{d.Description.schema.title}":</b></div>
                                                    { d.Description.writtenDescription &&
                                                    <div style={indent}><b>written description:</b> {d.Description.writtenDescription}</div>
                                                    }   
                                                    {d.Description.notes &&
                                                    <div style={indent}><b>notes:</b> {d.Description.notes}</div>
                                                    }   
                                                    <div style={indent}><b>character states:</b></div>
                                                    <CharacterInstances style={indent2} characterInstances={d.Description.characterInstances} />
                                                    </TableCell>
                                            </AlternatingTableRow>    
                                        ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                            </>
                        }

                        {(!holotypeSpecimen || 
                            !holotypeSpecimen.Specimen.describedBy || 
                            !holotypeSpecimen.Specimen.describedBy[0] ||
                            !holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances || 
                            !holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances.length > 0) &&
                            <div style={indent}>No holotype descriptions available</div>
                        }


                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Merged exemplar descriptions 
                    </AccordionSummary>
                    <AccordionDetails>
                        {mergedDescription && mergedDescription.length > 0 &&
                            <>
                            <TableContainer component={Paper}>
                            <Table sx={{width:"100%", mr:"10px"}} aria-label="description table">
                                <TableBody>
                                    {alphabetize([...mergedDescription], "schema").reduce((acc, ci) => acc.includes(ci.schema) ? acc : acc.concat(ci.schema),[]).map((s,i) => {
                                        return (
                                            <AlternatingTableRow key={`${s.schema}${i}`}>
                                                <TableCell align="left" sx={{fontSize: "1rem"}}>
                                                        <div><b>From schema "{s}":</b></div>
                                                        <div style={indent}><b>character states:</b></div>
                                                        {sort(mergedDescription.reduce((acc, ci) => {
                                                            if (ci.schema === s) {
                                                                acc.push({
                                                                    ...ci,
                                                                    deepOrder: `${ci.characterDeepOrder}.${ci.stateDeepOrder}`
                                                                });
                                                            }
                                                            return acc;
                                                        }, []), "deepOrder").map ((ci, i) =>  (
                                                            <div style={indent2} key={i}>{ci.characterName}:{"quantity" === ci.stateName ? ci.stateValue : ci.stateName}{ci.stateOrder  ? ', order:' + ci.stateOrder : ''}</div>
                                                        ))}

                                                </TableCell>
                                            </AlternatingTableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                            </TableContainer>

                            {(!mergedDescription || !mergedDescription.length > 0) &&
                                <div style={indent}>No merged descriptions available</div>
                            }

                            </>
                        } 

                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Exemplar specimens 
                    </AccordionSummary>
                    <AccordionDetails>
                        {holotypeSpecimen && (
                        <>
                            <SpecimenTable title="Holotype specimen" specimens={[holotypeSpecimen]}/>
                        </>
                        )}
                        {exclusiveTypeSpecimens && exclusiveTypeSpecimens.length > 0 &&
                        <>
                            <br />
                            <SpecimenTable title="Other type specimens" specimens={exclusiveTypeSpecimens}/>
                        </>
                        }

                        {(!holotypeSpecimen && (!typeSpecimens || typeSpecimens.length === 0)) &&
                            <div style={indent}>No type specimens available</div>
                        }

                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Additional specimens 
                    </AccordionSummary>
                    <AccordionDetails>
                        {exclusiveIdentifiedSpecimens && exclusiveIdentifiedSpecimens.length > 0 &&
                        <>
                            <SpecimenTable title="Additional specimens" specimens={exclusiveIdentifiedSpecimens}/>
                        </>
                        }
                        {(!exclusiveIdentifiedSpecimens || exclusiveIdentifiedSpecimens.length === 0) &&
                            <div style={indent}>No additional specimens available</div>
                        }
                    </AccordionDetails>
                </Accordion>

{/*
                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Location and geologic info 
                    </AccordionSummary>
                    <AccordionDetails>

                        <Box sx={boxedDisplay}><Typography variant="caption">Minimum latitude</Typography><br />{minLat}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Maximum latitude</Typography><br />{maxLat}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Minimum longitude</Typography><br />{minLon}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Maximum longitude</Typography><br />{maxLon}</Box>
                        <br />
                        <Box sx={boxedDisplay}>
                            <Typography variant="caption">Countries/States</Typography><br />
                            {Array.from(countries).map(country => {
                                return (
                                    <div key={country}>{Country.getCountryByCode(country).name}
                                        {Array.from(states).filter(s => s.country === country).map(state => (
                                            <div style={indent} key={`${country}${state}`}>{State.getStateByCodeAndCountry(state.state, state.country).name}</div>
                                        ))}
                                    </div>
                                )
                            })} 
                        </Box>
                        <br />
                        <Box sx={boxedDisplay}><Typography variant="caption">Geologic groups</Typography><br />{Array.from(stratigraphicGroups).map((g,i) => (<div key={i}>{g}</div>))}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Geologic formations</Typography><br />{Array.from(stratigraphicFormations).map((g,i) => (<div key={i}>{g}</div>))}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Geologic members</Typography><br />{Array.from(stratigraphicMembers).map((g,i) => (<div key={i}>{g}</div>))}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Geologic beds</Typography><br />{Array.from(stratigraphicBeds).map((g,i) => (<div key={i}>{g}</div>))}</Box>
                        <br />
                        <Box sx={boxedDisplay}><Typography variant="caption">Maximum time intervals</Typography><br />{Array.from(maxIntervals).map((g,i) => (<div key={i}>{g}</div>))}</Box>
                        <Box sx={boxedDisplay}><Typography variant="caption">Minimum time intervals</Typography><br />{Array.from(minIntervals).map((g,i) => (<div key={i}>{g}</div>))}</Box>

                    </AccordionDetails>
                </Accordion>
*/}

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
                        {notes}
                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Synonyms
                    </AccordionSummary>
                    <AccordionDetails>
                    {synonyms && synonyms.length > 0 &&
                    <TableContainer component={Paper}>
                        <Table sx={{width:"100%", mr:"10px"}} aria-label="synonym table">
                            <TableBody>
                                {synonyms.map((synonym, i) => {
                                    const synOTU = synonym.otus.filter(synOtu => synOtu.pbotID !== pbotID)[0];
                                    return (
                                        <AlternatingTableRow key={synOTU.pbotID}>
                                            <TableCell align="left">
                                                <DirectQueryLink type="otu" pbotID={synOTU.pbotID} params={directQParams} >
                                                    {synOTU.name}
                                                </DirectQueryLink>
                                                {synonym.explanation &&
                                                    <Box sx={boxedDisplay}>
                                                        <Typography variant="caption">Explanation</Typography><br />
                                                        {synonym.explanation}
                                                    </Box>
                                                }
                                                {synonym.references && synonym.references.length > 0 &&
                                                    <Box sx={boxedDisplay}>
                                                        <Typography variant="caption">References</Typography><br />
                                                        {sort([...synonym.references], "order").map((ref, idx, arr) => (
                                                            <span key={ref.Reference.pbotID}>
                                                                <DirectQueryLink type="reference" pbotID={ref.Reference.pbotID} text={ref.Reference.title} />
                                                                {idx < arr.length - 1 ? ', ' : ''}
                                                            </span>
                                                        ))}
                                                    </Box>
                                                }
                                                {synOTU.family &&
                                                <Box sx={boxedDisplay}><Typography variant="caption">Family</Typography><br /><i>{synOTU.family}</i></Box>
                                                }
                                                {synOTU.genus &&
                                                <Box sx={boxedDisplay}><Typography variant="caption">Genus</Typography><br /><i>{synOTU.genus}</i></Box>
                                                }
                                                {synOTU.species &&
                                                <Box sx={boxedDisplay}><Typography variant="caption">Specific epithet</Typography><br /><i>{synOTU.species}</i></Box>
                                                }
                                                {synOTU.identifiedSpecimens &&
                                                <Box sx={boxedDisplay}><Typography variant="caption">Number of identified specimens</Typography><br />{synOTU.identifiedSpecimens.length}</Box>
                                                }
                                                {synonym.comments && synonym.comments.length > 0 &&
                                                    <Box sx={boxedDisplay}>
                                                        <Typography variant="caption">Comments</Typography><br />
                                                        <Comments comments={synonym.comments} level={1}/>
                                                    </Box>
                                                }
                                            </TableCell>
                                        </AlternatingTableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>                                        
                    }
                    {(!synonyms || !synonyms.length > 0) &&
                        <div style={indent}>No proposed synonyms</div>
                    }

                    </AccordionDetails>
                </Accordion>
                <br />
                </>
        </div>
    )
}
