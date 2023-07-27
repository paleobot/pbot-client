import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography } from '@mui/material';
import Characters from "../Character/Characters";
import { alphabetize, sort } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

function Schemas(props) {
    console.log(props);
    console.log(props.filters.genus);
    
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const groups = props.standAlone ? '' : ', $groups: [ID!] ';
    //const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'
    
    let filter = '';
    if (!props.standAlone) {
        filter = ", filter: {"
        if (!filters.partsPreserved && !filters.notableFeatures) {
            filter += "elementOf_some: {pbotID_in: $groups}"
        } else {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}";
            if (filters.partsPreserved) {
                console.log("adding partsPreserved")
                filter += ", {partsPreserved_some: {pbotID_in: $partsPreserved}}"
            }
            if (filters.notableFeatures) {
                filter += ", {notableFeatures_some: {pbotID_in: $notableFeatures}}"
            }
            filter +="]"
        }
        filter += "}"
    }
    console.log(filter)

    let gQL;
    if (!props.standAlone) {
        gQL = gql`
            query ($pbotID: ID, $title: String, $year: String ${groups} ${filters.partsPreserved ? ", $partsPreserved: [ID!]" : ""} ${filters.notableFeatures ? ", $notableFeatures: [ID!]" : ""}) {
                Schema (pbotID: $pbotID, title: $title, year: $year ${filter}) {
                    pbotID
                    title
                }
            }
        `
    } else if (!props.includeCharacters) {
        gQL = gql`
            query ($pbotID: ID, $title: String, $year: String ${groups}) {
                Schema (pbotID: $pbotID, title: $title, year: $year ${filter}) {
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

            query ($pbotID: ID, $title: String, $year: String ${groups}) {
                Schema (pbotID: $pbotID, title: $title, year: $year ${filter}) {
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
           
    const schemas = alphabetize([...data.Schema], "title");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    return (schemas.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : schemas.map((schema) => {

        const directURL = new URL(window.location.origin + "/query/schema/" + schema.pbotID);
        if (props.includeCharacters) {
            directURL.searchParams.append("includeCharacters", "true");
        }
            
        return (
            <div key={schema.pbotID} style={style}>
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
                                Schema: {schema.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                            <Typography variant="h5" sx={{marginRight: "10px"}}>
                                Workspace: {schema.elementOf[0].name}
                            </Typography>
                        </Grid>
                    </Grid>
                    <div style={indent}><b>direct link:</b> <Link color="success.main" underline="hover" href={directURL}  target="_blank">{directURL.toString()}</Link></div>

                    <div style={indent}><b>pbotID:</b> {schema.pbotID}</div>
                    <div style={indent}><b>year:</b> {schema.year} </div>
                    <div style={indent}><b>purpose:</b> {schema.purpose} </div>
                    {schema.acknowledgments && <div style={indent}><b>acknowledgments:</b> {schema.acknowledgments} </div>}
                    {schema.partsPreserved && schema.partsPreserved.length > 0 &&
                        <div>
                            <div style={indent}><b>parts preserved:</b></div>
                            {alphabetize([...schema.partsPreserved], "type").map(partPreserved => (
                                <div key={partPreserved.type} style={indent2}>{partPreserved.type}</div>
                            ))}
                        </div>
                    }
                    {schema.notableFeatures && schema.notableFeatures.length > 0 &&
                        <div>
                            <div style={indent}><b>notable features:</b></div>
                            {alphabetize([...schema.notableFeatures], "name").map(notableFeature => (
                                <div key={notableFeature.name} style={indent2}>{notableFeature.name}</div>
                            ))}
                        </div>
                    }
                    {schema.references && schema.references.length > 0 &&
                        <div>
                            <div style={indent}><b>references:</b></div>
                            {sort([...schema.references], "#order").map(reference => (
                                <div key={reference.Reference.pbotID} style={indent2}>{reference.Reference.title}, {reference.Reference.year}</div>
                            ))}
                        </div>
                    }
                    {schema.authoredBy && schema.authoredBy.length > 0 &&
                        <div>
                            <div style={indent}><b>authors:</b></div>
                            {sort([...schema.authoredBy], "#order").map(author => (
                                <div key={author.Person.pbotID} style={indent2}>{author.Person.given} {author.Person.surname}</div>
                            ))}
                        </div>
                    }
                    {schema.characters && schema.characters.length > 0 &&
                        <div>
                            <div style={indent}><b>characters:</b></div>
                            <Characters characters={schema.characters} top="true"/>
                        </div>
                    }
                    <br />
                    </>
                }

                {!props.standAlone &&
                <Link style={indent} color="success.main" underline="hover" href={directURL}  target="_blank"><b>{schema.title || "(title missing)"}</b></Link>
                }

            </div>
        )
    });

}

const SchemaQueryResults = ({queryParams}) => {
    console.log("SchemaQueryResults")
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <Schemas 
            filters={{
                pbotID: queryParams.schemaID,
                title: queryParams.title, 
                year: queryParams.year, 
                partsPreserved: queryParams.partsPreserved && queryParams.partsPreserved.length > 0 ? queryParams.partsPreserved : null,
                notableFeatures: queryParams.notableFeatures && queryParams.notableFeatures.length > 0 ? queryParams.notableFeatures : null,
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeCharacters={queryParams.includeCharacters} 
            standAlone={queryParams.standAlone} 
        />
    );
};

export default SchemaQueryResults;
