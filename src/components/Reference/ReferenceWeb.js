import { alphabetize, sort, AlternatingTableRow, DirectQueryLink } from '../../util.js';
import { Link, Grid, List, ListItem, ListItemButton, ListItemText, Typography, TableContainer, Table, TableCell, TableBody, TableRow, styled, Paper, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReferenceSet from 'yup/lib/util/ReferenceSet.js';

export const ReferenceWeb = (props) => {
    console.log("ReferenceWeb");
    console.log(props);
    if (!props.reference && !props.references) return ''; //TODO: is this the best place to handle this?

    const reference = props.reference;
    
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const boxedDisplay = {wordWrap: "break-word", border: 0, margin:"4px",  paddingLeft:"2px"};
    const accstyle = {textAlign: "left", marginLeft:"10px", marginRight:"10px" /*width: "95%",  marginLeft:"8px"*/}

    console.log("*********************************")
    console.log(reference.pbotID);
    const directURL = new URL(window.location.origin + "/query/reference/" + reference.pbotID);
    console.log(directURL);
    console.log("*********************************")

    const listIndent = {marginLeft:"2em"}
    const header1 = {marginLeft:"2em", marginTop:"10px"}

    return (
        <div key={reference.pbotID} style={style}>
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
                        Reference
                    </Typography>
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                    <Typography variant="h5" sx={{marginRight: "10px"}}>
                        Workspace: {reference.elementOf[0].name}
                    </Typography>
                </Grid>
            </Grid>

            <Paper elevation={0} sx={{padding:"2px", margin:"10px", marginTop:"15px", background:"#d0d0d0"}}>
                <Box sx={boxedDisplay}>
                    <b>{reference.title}</b>
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>PBot ID</Typography><br />{reference.pbotID}
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>Direct link</Typography><br /><Link color="success.main" underline="hover" href={reference.directURL} target="_blank">{reference.directURL.toString()}</Link>
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><Link color="success.main" underline="hover" href={reference.jsonURL} target="_blank">{reference.jsonURL.toString()}</Link>
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>PDF link</Typography><br /><Link color="success.main" underline="hover" href={reference.pdfURL} target="_blank">{reference.pdfURL.toString()}</Link>
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>PBDB ID</Typography><br />{reference.pbdbid}
                </Box>
                {reference.doi &&
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>DOI</Typography><br />{reference.doi}
                </Box>}
            </Paper>

            <Accordion style={accstyle} defaultExpanded={false}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="required-content"
                    id="required-header"                        
                >
                    Publication details
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Authors</Typography>
                        {sort([...reference.authoredBy], "#order").map(author => (
                        <div key={author.Person.pbotID} >{author.Person.given} {author.Person.surname}</div>
                        ))}
                    </Box>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Year</Typography><br />{reference.year}
                    </Box>
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Publication type</Typography><br />{reference.publicationType}
                    </Box>
                    {reference.journal &&
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Journal</Typography><br />{reference.journal}
                    </Box>}
                    {reference.publicationVolume &&
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Publication volume</Typography><br />{reference.publicationVolume}
                    </Box>}
                    {reference.publicationNumber &&
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Publication number</Typography><br />{reference.publicationNumber}
                    </Box>}
                    {reference.bookTitle &&
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Book title</Typography><br />{reference.bookTitle}
                    </Box>}
                    {reference.bookType &&
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Book type</Typography><br />{reference.bookType}
                    </Box>}
                    {reference.publisher &&
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Publisher</Typography><br />{reference.publisher}
                    </Box>}
                    {reference.firstPage &&
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>First page</Typography><br />{reference.firstPage}
                    </Box>}
                    {reference.lastPage &&
                    <Box sx={boxedDisplay}>
                        <Typography variant="caption" sx={{lineHeight:0}}>Last page</Typography><br />{reference.lastPage}
                    </Box>}

                </AccordionDetails>
            </Accordion>
        </div>
    )
}
    