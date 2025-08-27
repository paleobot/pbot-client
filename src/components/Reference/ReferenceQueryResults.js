import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { alphabetize, sort, AlternatingTableRow, DirectQueryLink } from '../../util.js';
import { Link, Grid, List, ListItem, ListItemButton, ListItemText, Typography, TableContainer, Table, TableCell, TableBody, TableRow, styled, Paper, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReferenceSet from 'yup/lib/util/ReferenceSet.js';

function References(props) {
    console.log("References")
    console.log(props);
    
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    console.log(filters)

    const groups = props.standAlone ? '' : ', $groups: [ID!] ';
    
    const filter = props.standAlone ? 
        (filters.pbotID && Array.isArray(filters.pbotID)) ?
            `filter: {pbotID_in: $pbotID}` 
            :
            ''  
        : 
        ',  filter:{elementOf_some: {pbotID_in: $groups}}'

    let gQL;
    if (!props.standAlone) {
        gQL = gql`
        query (
            $pbotID: ID, 
            ${filters.title ? `$title: String,` : ''}
            ${filters.authors && filters.authors.length > 0 ? `$authors: [ID!],` : ''} 
            $year: String, 
            ${filters.bookTitle ? `$bookTitle: String,` : ''} 
            $publicationType: String, 
            $pbdbid: String, 
            $doi: String, 
            $groups: [ID!], 
            $excludeList: [ID!]
        ) {
            Reference (
                pbotID: $pbotID, 
                year: $year, 
                publicationType: $publicationType, 
                pbdbid: $pbdbid, 
                doi: $doi, 
                filter:{AND: [
                    ${filters.authors && filters.authors.length > 0 ? `{authoredBy_some: {Person: {pbotID_in: $authors}}},` : ''}
                    ${filters.title || filters.bookTitle ?
                        `{OR: [
                            ${filters.title ? `{title_regexp: $title},` : ''}
                            ${filters.bookTitle ? `{bookTitle_regexp: $bookTitle},` : ''}
                        ]},` : ''}
                    {elementOf_some: {pbotID_in: $groups}}, 
                    {pbotID_not_in: $excludeList}]}
            ) {
                pbotID
                title
                year
                publisher
                bookTitle  
                publicationType 
                firstPage
                lastPage 
                journal 
                publicationVolume 
                publicationNumber
                bookType 
                pbdbid 
                doi                    
                authoredBy {
                    Person {
                        pbotID
                        given
                        surname
                    }
                    order
                }
                elementOf {
                    name
                }
            }
        }
    `;
} else {
        gQL = gql`
            query (
                $pbotID: ${filters.pbotID && Array.isArray(filters.pbotID) ?
                    "[ID!]" : "ID"},
                ${groups}) {
                Reference (
                    ${filters.pbotID && !Array.isArray(filters.pbotID) ?
                        "pbotID: $pbotID" : ""}, 
                    ${filter}) {
                    pbotID
                    title
                    year
                    publisher
                    bookTitle  
                    publicationType 
                    firstPage
                    lastPage 
                    journal 
                    publicationVolume 
                    publicationNumber
                    bookType 
                    pbdbid 
                    doi                    
                    authoredBy (orderBy: order_asc) {
                        Person {
                            pbotID
                            given
                            surname
                        }
                        order
                    }
                    elementOf {
                        name
                    }
                }
            }
        `;
    }
        
    //For ReferenceManager applications, omit references that are already in the list
    const excludeIDs = props.exclude ? props.exclude.map(reference => reference.pbotID) : [];

    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters,
            excludeList: excludeIDs
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const references = sort([...data.Reference], "year", "title");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    if (references.length === 0) {
        return (
            <div style={style}>
                No {(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
            </div>
        )
    }

    if (props.select) {
        return (
            <List sx={{ pt: 0 }}>
            {references.map((reference) => (
                <ListItem  key={reference.pbotID}>
                    <ListItemButton onClick={() => props.handleSelect(reference)} >
                        <ListItemText 
                        primary={`${reference.year}, ${reference.title}`} secondary={`pbot id: ${reference.pbotID}`} />
                    </ListItemButton>
                </ListItem>
            ))}
            </List>
        )
    }
    
    const directQParams = [];

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
            references.map((reference) => {
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
                            <Typography variant="caption" sx={{lineHeight:0}}>Direct link</Typography><br /><DirectQueryLink type="reference" pbotID={reference.pbotID} params={directQParams} />
                        </Box>
                        <Box sx={boxedDisplay}>
                            <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><DirectQueryLink type="reference" pbotID={reference.pbotID} params={jsonDirectQParams} />
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
            })
        )
    }

    if (!props.standAlone) {


        const boxedDisplay = {wordWrap: "break-word", border: 0, mt: "10px", paddingLeft:"2px"};

        /*
        return (
            <Link style={listIndent} color="success.main" underline="hover" href={directURL}  target="_blank"><b>{`${reference.year}, ${reference.title}`}</b></Link>
        )
        */
        return (
            <>
           <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="references table">
                    <TableBody>
                    {references.map((reference) => {
                        const directURL = new URL(window.location.origin + "/query/reference/" + reference.pbotID);

                        return (
                        <AlternatingTableRow key={reference.pbotID}>
                            <TableCell align="left">{reference.year}</TableCell>
                            <TableCell component="th" scope="row">
                                <Link  color="success.main" underline="hover" href={directURL}  target="_blank"><b>{reference.title}</b></Link>
                            </TableCell>
                        </AlternatingTableRow>
                        )
                    })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><DirectQueryLink type="reference" pbotID={references} params={jsonDirectQParams} />
            </Box>

            </>
        )        
    }
}


const ReferenceQueryResults = ({queryParams, select, handleSelect, exclude}) => {
    console.log("ReferenceQueryResults")
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <References 
            filters={{
                pbotID: queryParams.referenceID || null,
                title: queryParams.title ? `(?i).*${queryParams.title.replace(/\s+/, '.*')}.*` : null, 
                bookTitle: queryParams.title ? `(?i).*${queryParams.title.replace(/\s+/, '.*')}.*` : null,
                authors: queryParams.authors ? queryParams.authors.map(a => a.pbotID) : null,
                publicationType: queryParams.published ? null : "unpublished",
                //firstPage: queryParams.firstPage || null,
                //lastPage: queryParams.lastPage || null,
                //journal:   queryParams.journal || null,
                //publicationVolume: queryParams.publicationVolume || null,
                //publicationNumber: queryParams.publicationNumber || null,
                //publisher: queryParams.publisher || null,
                //bookType:  queryParams.bookType || null,
                year: queryParams.year || null,
                pbdbid: queryParams.pbdbid || null,
                doi: queryParams.doi || null,
                groups: [global.publicGroupID],
            }}
            select={select}
            handleSelect={handleSelect}
            exclude={exclude}
            standAlone={queryParams.standAlone} 
            format={queryParams.format}
        />
    );
};

export default ReferenceQueryResults;
