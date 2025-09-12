import { Link, Grid, Typography, TableContainer, Paper, Table, TableBody, TableCell, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { alphabetize, AlternatingTableRow, DirectQueryLink, sort } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Characters from "../Character/Characters";

export const SchemaWeb = (props) => {
    console.log("SchemaWeb");
    console.log(props);
    if (!props.schema) return ''; //TODO: is this the best place to handle this?
    
    const schema = props.schema;

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const boxedDisplay = {wordWrap: "break-word", border: 0, margin:"4px",  paddingLeft:"2px"};
    const accstyle = {textAlign: "left", marginLeft:"10px", marginRight:"10px" /*width: "95%",  marginLeft:"8px"*/}

    return (
        <div key={schema.pbotID} style={style}>
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
                        Schema
                    </Typography>
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                    <Typography variant="h5" sx={{marginRight: "10px"}}>
                        Workspace: {schema.elementOf[0].name}
                    </Typography>
                </Grid>
            </Grid>

            <Paper elevation={0} sx={{padding:"2px", margin:"10px", marginTop:"15px", background:"#d0d0d0"}}>
                <Box sx={boxedDisplay}>
                    <b>{schema.title}</b>
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>PBot ID</Typography><br />{schema.pbotID}
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>Direct link</Typography><br /><Link color="success.main" underline="hover" href={schema.directURL} target="_blank">{schema.directURL.toString()}</Link>
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><Link color="success.main" underline="hover" href={schema.jsonURL} target="_blank">{schema.jsonURL.toString()}</Link>
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>Year</Typography><br />{schema.year}
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>Purpose</Typography><br />{schema.purpose}
                </Box>
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>Acknowledgments</Typography><br />{schema.acknowledgments}
                </Box>
                {schema.partsPreserved && schema.partsPreserved.length > 0 &&
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>Parts preserved</Typography><br />
                    {alphabetize([...schema.partsPreserved], "type").map(partPreserved => (
                        <div key={partPreserved.type}>{partPreserved.type}</div>
                    ))}

                </Box>}
                {schema.notableFeatures && schema.notableFeatures.length > 0 &&
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>Notable features</Typography><br />
                    {alphabetize([...schema.notableFeatures], "name").map(notableFeature => (
                        <div key={notableFeature.name}>{notableFeature.name}</div>
                    ))}

                </Box>}
                {schema.references && schema.references.length > 0 &&
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>References</Typography><br />
                    {sort([...schema.references], "#order").map(reference => (
                        <div key={reference.Reference.pbotID}>{reference.Reference.title}, {reference.Reference.year}</div>
                    ))}
                </Box>}
                {schema.authoredBy && schema.authoredBy.length > 0 &&
                <Box sx={boxedDisplay}>
                    <Typography variant="caption" sx={{lineHeight:0}}>Authors</Typography><br />
                    {sort([...schema.authoredBy], "#order").map(author => (
                        <div key={author.Person.pbotID}>{author.Person.given} {author.Person.surname}</div>
                    ))}
                </Box>}
            </Paper>

            <Accordion style={accstyle} defaultExpanded={false}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="required-content"
                    id="required-header"                        
                >
                    Characters
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={boxedDisplay}>
                        <Characters characters={schema.characters} top="true"/>
                    </Box>
                </AccordionDetails>
            </Accordion>

        </div>
    )
}
