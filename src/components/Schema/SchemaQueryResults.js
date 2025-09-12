import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography, TableContainer, Paper, Table, TableBody, TableCell, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Characters from "../Character/Characters";
import { alphabetize, AlternatingTableRow, DirectQueryLink, sort } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SchemaWeb } from './SchemaWeb.js';
import { Document, PDFViewer } from '@react-pdf/renderer';
import { SchemaPdf } from './SchemaPdf.js';

function Schemas(props) {
    console.log("Schemas")
    console.log(props);
        
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const groups = props.standAlone ? '' : ', $groups: [ID!] ';
    //const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'
    
    let filter = '';
    if (props.standAlone) {
        if (filters.pbotID && Array.isArray(filters.pbotID)) {
            filter += `, filter: {pbotID_in: $pbotID}`
        }
    } else  {
        filter = ", filter: {"
        if (!filters.title && !filters.partsPreserved && !filters.notableFeatures && !filters.reference && !filters.purpose && !filters.specimen) {
            filter += "elementOf_some: {pbotID_in: $groups}"
        } else {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}";
            if (filters.title) {
                filter += ", {title_regexp: $title}"
            }
            if (filters.partsPreserved) {
                filter += ", {partsPreserved_some: {pbotID_in: $partsPreserved}}"
            }
            if (filters.notableFeatures) {
                filter += ", {notableFeatures_some: {pbotID_in: $notableFeatures}}"
            }

            if (filters.purpose) {
                filter += ", {purpose_contains: $purpose}"
            }

            if (filters.reference) {
                filter += `, {
                    references_some: {
                        Reference: {
                            pbotID: $reference 
                        } 
                    }
                }`
            }

            if (filters.specimen) {
                filter += `, {
                    appliedBy_some: {
                        specimens_some : {
                            Specimen: {
                                pbotID: $specimen
                            }
                        } 
                    }
                }`
            }

            filter +="]"
        }
        filter += "}"
    }
    console.log(filter)

    let gQL;
    if (!props.standAlone) {
        gQL = gql`
            query (
                $pbotID: ID, 
                $year: String,
                ${groups} 
                ${filters.title ? ", $title: String" : ""} 
                ${filters.purpose ? ", $purpose: String" : ""} 
                ${filters.partsPreserved ? ", $partsPreserved: [ID!]" : ""} 
                ${filters.notableFeatures ? ", $notableFeatures: [ID!]" : ""}
                ${filters.reference ? ", $reference: ID" : ""}
                ${filters.specimen ? ", $specimen: ID" : ""}
            ) {
                Schema (
                    pbotID: $pbotID, 
                    year: $year
                    ${filter}
                ) {
                    pbotID
                    title
                    year
                }
            }
        `
    } else if (!props.includeCharacters) {
        gQL = gql`
            query (
                $pbotID: ${filters.pbotID && Array.isArray(filters.pbotID) ?
                    "[ID!]" : "ID"},
                $year: String 
                ${groups}
                ${filters.title ? ", $title: String" : ""} 
            ) {
                Schema (
                    ${filters.pbotID && !Array.isArray(filters.pbotID) ?
                        "pbotID: $pbotID" : ""}, 
                    year: $year
                    ${filter}
                ) {
                    pbotID
                    title
                    year
                    acknowledgments
                    purpose
                    partsPreserved {
                        type
                    }
                    notableFeatures {
                        name
                    }
                    elementOf {
                        name
                    }
                    references {
                        Reference {
                            pbotID
                            title
                            year
                        }
                        order
                    }
                    authoredBy {
                        Person {
                            pbotID
                            given
                            surname
                        }
                        order
                    }
                }            
            }
        `;
    } else {
        gQL = gql`
            fragment CharacterFields on Character {
                pbotID
                name
                definition
                order
                states {
                    ...StateFields
                    ...StatesRecurse
                }
            }

            fragment CharactersRecurse on Character {
                characters {
                    ...CharacterFields
                    characters {
                        ...CharacterFields
                        characters {
                            ...CharacterFields
                            characters {
                                ...CharacterFields
                                characters {
                                    ...CharacterFields
                                    characters {
                                        ...CharacterFields
                                    }
                                }
                            }
                        }
                    }
                }
            }

            fragment StateFields on State {
                name
                definition
                order
            }

            fragment StatesRecurse on State {
                states {
                    ...StateFields
                    states {
                        ...StateFields
                        states {
                            ...StateFields
                            states {
                                ...StateFields
                                states {
                                    ...StateFields
                                    states {
                                        ...StateFields
                                    }
                                }
                            }
                        }
                    }
                }
            }

            query (
                $pbotID: ${filters.pbotID && Array.isArray(filters.pbotID) ?
                    "[ID!]" : "ID"},
                $year: String 
                ${groups}
                ${filters.title ? ", $title: String" : ""} 
            ) {
                Schema (
                    ${filters.pbotID && !Array.isArray(filters.pbotID) ?
                        "pbotID: $pbotID" : ""}, 
                    year: $year 
                    ${filter}
                ) {
                    pbotID
                    title
                    year
                    acknowledgments
                    purpose
                    partsPreserved {
                        type
                    }
                    notableFeatures {
                        name
                    }
                    elementOf {
                        name
                    }
                    references {
                        Reference {
                            pbotID
                            title
                            year
                        }
                        order
                    }
                    authoredBy {
                        Person {
                            pbotID
                            given
                            surname
                        }
                        order
                    }
                    characters {
                        ...CharacterFields
                        ...CharactersRecurse
                    }
                }
            }
        `;
    }
    
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const schemas = sort([...data.Schema], "year", "title");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    if (schemas.length === 0) {
        return (
            <div style={style}>
                No {(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
            </div>
        )
    }
    
    const directQParams = [];
    if (props.includeCharacters) {
        directQParams.push("includeCharacters");
    }

    const jsonDirectQParams = directQParams.concat(["format=json"])

    if (props.standAlone) {

        if (props.format && "JSON" === props.format.toUpperCase()) {
            return (
                <><pre>{JSON.stringify(data, null, 2)}</pre></>
            )
        }

        const massageSchema = (sc) => {
            const s = {...sc}
            s.directURL = new URL(window.location.origin + "/query/schema/" + s.pbotID);
            s.directURL.searchParams.append("includeCharacters", "true");
                
            s.jsonURL = new URL(s.directURL.toString());
            s.jsonURL.searchParams.append("format", "json")

            s.pdfURL = new URL(s.directURL.toString());
            s.pdfURL.searchParams.append("format", "pdf")

            return s
        }

        const isPDF = props.format && "PDF" === props.format.toUpperCase()

        if (isPDF) {
            return (
                <>
                <PDFViewer style={{ width: '100%', height: '100vh' }}>
                    <Document>
                        {schemas.map((schema) => {
                            return (
                                <SchemaPdf key={schema.pbotID} schema={massageSchema(schema)} />
                            );
                        })}
                    </Document>
                </PDFViewer>
                </>
            );
        } else {
            return (
                schemas.map((schema) => {
                    return (
                        <SchemaWeb key={schema.pbotID} schema={massageSchema(schema)}/>
                    )
                })
            )
        }
    } else {

        const boxedDisplay = {wordWrap: "break-word", border: 0, mt: "10px", paddingLeft:"2px"};

        return (
            <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="schemas table">
                    <TableBody>
                        {schemas.map((schema) => {
                            const directURL = new URL(window.location.origin + "/query/schema/" + schema.pbotID);
                            //if (props.includeCharacters) {
                            //always include for now (pbot-dev#282)
                                directURL.searchParams.append("includeCharacters", "true");
                            //}
                
                            return (
                                <AlternatingTableRow key={schema.pbotID}>
                                    <TableCell align="left">{schema.year}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link color="success.main" underline="hover" href={directURL}  target="_blank"><b>{schema.title || "(title missing)"}</b></Link>
                                    </TableCell>
                                </AlternatingTableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={boxedDisplay}>
                <Typography variant="caption" sx={{lineHeight:0}}>JSON link</Typography><br /><DirectQueryLink type="schema" pbotID={schemas} params={jsonDirectQParams} />
            </Box>

            </>
        )
    }
}

const SchemaQueryResults = ({queryParams}) => {
    console.log("SchemaQueryResults")
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <Schemas 
            filters={{
                pbotID: queryParams.schemaID || null,
                title: queryParams.title ? `(?i).*${queryParams.title.replace(/\s+/, '.*')}.*` : null, 
                year: queryParams.year || null, 
                purpose: queryParams.purpose || null,
                specimen: queryParams.specimen || null,
                //some extra razzle-dazzle here use only non-empty pbotIDs
                //references: queryParams.references && queryParams.references.length > 0 ? queryParams.references.map(r => r.pbotID).reduce(r => '' !== r) : null,
                reference: queryParams.reference || null,
                partsPreserved: queryParams.partsPreserved && queryParams.partsPreserved.length > 0 ? queryParams.partsPreserved : null,
                notableFeatures: queryParams.notableFeatures && queryParams.notableFeatures.length > 0 ? queryParams.notableFeatures : null,
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeCharacters={queryParams.includeCharacters} 
            standAlone={queryParams.standAlone} 
            format={queryParams.format}
        />
    );
};

export default SchemaQueryResults;
