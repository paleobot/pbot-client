import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { alphabetize, sort, AlternatingTableRow } from '../../util.js';
import { Link, Grid, List, ListItem, ListItemButton, ListItemText, Typography, TableContainer, Table, TableCell, TableBody, TableRow, styled, Paper } from '@mui/material';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';

function References(props) {
    console.log("References")
    console.log(props);
    
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    console.log(filters)

    const groups = props.standAlone ? '' : ', $groups: [ID!] ';
    const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'
    
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
            query ($pbotID: ID, ${groups}) {
                Reference (pbotID: $pbotID, ${filter}) {
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
    
    if (props.standAlone) {
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
                                Reference: {reference.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                            <Typography variant="h5" sx={{marginRight: "10px"}}>
                                Workspace: {reference.elementOf[0].name}
                            </Typography>
                        </Grid>
                    </Grid>
                    <div style={indent}><b>direct link:</b> <Link color="success.main" underline="hover" href={directURL}  target="_blank">{directURL.toString()}</Link></div>

                    <div style={header1}><Typography variant="h6">Identity</Typography></div>
                    <div style={indent}><b>pbotID:</b> {reference.pbotID}</div>
                    <div style={indent}><b>title:</b> {reference.title}</div>
                    {reference.doi && <div style={indent}><b>doi:</b> {reference.doi} </div>}
                    {reference.pbdbid && <div style={indent}><b>pbdb id:</b> {reference.pbdbid} </div>}


                    <div style={header1}><Typography variant="h6">Publication details</Typography></div>
                    <div style={indent}><b>authors:</b></div>
                        {sort([...reference.authoredBy], "#order").map(author => (
                            <div key={author.Person.pbotID} style={indent2}>{author.Person.given} {author.Person.surname}</div>
                        ))}
                    {reference.year && <div style={indent}><b>year:</b> {reference.year} </div>}
                    {reference.publicationType && <div style={indent}><b>publicationType</b> {reference.publicationType} </div>}
                    {reference.journal && <div style={indent}><b>journal</b> {reference.journal} </div> }
                    {reference.publicationVolume && <div style={indent}><b>publicationVolume</b> {reference.publicationVolume} </div>}
                    {reference.publicationNumber && <div style={indent}><b>publicationNumber</b> {reference.publicationNumber} </div>}
                    {reference.bookTitle && <div style={indent}><b>bookTitle</b> {reference.bookTitle} </div>}  
                    {reference.bookType && <div style={indent}><b>bookType</b> {reference.bookType} </div> }
                    {reference.publisher && <div style={indent}><b>publisher:</b> {reference.publisher}</div>} 
                    {reference.firstPage && <div style={indent}><b>firstPage</b> {reference.firstPage} </div>}
                    {reference.lastPage && <div style={indent}><b>lastPage</b> {reference.lastPage} </div>} 
                    
                    <br />
            </div>
            )
        })
    )}

    if (!props.standAlone) {
        /*
        return (
            <Link style={listIndent} color="success.main" underline="hover" href={directURL}  target="_blank"><b>{`${reference.year}, ${reference.title}`}</b></Link>
        )
        */
        return (
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
        />
    );
};

export default ReferenceQueryResults;
