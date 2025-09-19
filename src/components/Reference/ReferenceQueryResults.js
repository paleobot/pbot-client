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
import { ReferenceWeb } from './ReferenceWeb.js';
import { ReferencePDF } from './ReferencePDF.js';
import { Document, PDFViewer } from '@react-pdf/renderer';

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
    const pdfDirectQParams = directQParams.concat(["format=pdf"])

    if (props.standAlone) {

        if (props.format && "JSON" === props.format.toUpperCase()) {
            return (
                <><pre>{JSON.stringify(data, null, 2)}</pre></>
            )
        }

        const massageReference = (r) => {
            const reference = {...r}
            reference.directURL = new URL(window.location.origin + "/query/reference/" + reference.pbotID);
                
            reference.jsonURL = new URL(reference.directURL.toString());
            reference.jsonURL.searchParams.append("format", "json")

            reference.pdfURL = new URL(reference.directURL.toString());
            reference.pdfURL.searchParams.append("format", "pdf")

            return reference
        }


        const isPDF = props.format && "PDF" === props.format.toUpperCase()

        if (isPDF) {
            return (
                <>
                <PDFViewer style={{ width: '100%', height: '100vh' }}>
                    <Document>
                        {references.map((reference) => (
                            <ReferencePDF key={reference.pbotID} reference={massageReference(reference)} />
                        ))}
                    </Document>
                </PDFViewer>
                </>
            )
        } else {
            return (
                references.map((reference) => {
                    return (
                        <ReferenceWeb key={reference.pbotID} reference={massageReference(reference)} />
                    )
                })
            )       
        }    

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

            <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>PDF link</Typography><br /><DirectQueryLink type="reference" pbotID={references} params={pdfDirectQParams} />
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
