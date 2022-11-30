import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography } from '@mui/material';
import Characters from "../Character/Characters";
import { alphabetize } from '../../util.js';
import {publicGroupID} from '../Group/GroupSelect.js';
import logo from '../../PBOT-logo-transparent.png';

function Schemas(props) {
    console.log(props);
    console.log(props.filters.genus);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const groups = props.standAlone ? '' : ', $groups: [ID!] ';
    const filter = props.standAlone ? '' : ',  filter:{elementOf_some: {pbotID_in: $groups}}'
    
    let gQL;
    if (!props.includeCharacters) {
        gQL = gql`
            query ($pbotID: ID, $title: String, $year: String ${groups}) {
                Schema (pbotID: $pbotID, title: $title, year: $year ${filter}) {
                    pbotID
                    title
                    year
                    acknowledgments
                    elementOf {
                        name
                    }
                    references {
                        Reference {
                            pbotID
                            title
                            publisher
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
                        }
                    }
                }
            }

            fragment StateFields on State {
                name
                definition
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
                    elementOf {
                        name
                    }
                    references {
                        Reference {
                            pbotID
                            title
                            publisher
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
            No {(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : schemas.map((schema) => (
        <div key={schema.pbotID} style={style}>
            { props.standAlone &&     
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
            }

            {!props.standAlone &&
            <b>{schema.title || "(title missing)"}</b>
            }

            <div style={indent}><b>direct link:</b> <Link underline="hover" href={window.location.origin + "/query/schema/" + schema.pbotID}  target="_blank">{window.location.origin}/query/schema/{schema.pbotID}</Link></div>

            <div style={indent}><b>pbotID:</b> {schema.pbotID}</div>
            <div style={indent}><b>year:</b> {schema.year} </div>
            {schema.acknowledgments && <div style={indent}><b>acknowledgments:</b> {schema.acknowledgments} </div>}
            {schema.references && schema.references.length > 0 &&
                <div>
                    <div style={indent}><b>references:</b></div>
                    {alphabetize([...schema.references], "order").map(reference => (
                        <div key={reference.Reference.pbotID} style={indent2}>{reference.Reference.title}, {reference.Reference.publisher}, {reference.Reference.year}</div>
                    ))}
                </div>
            }
            {schema.authoredBy && schema.authoredBy.length > 0 &&
                <div>
                    <div style={indent}><b>authors:</b></div>
                    {alphabetize([...schema.authoredBy], "order").map(author => (
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
        </div>
    ));

}

const SchemaQueryResults = ({queryParams}) => {
    console.log("SchemaQueryResults")
    console.log(queryParams);
    console.log(publicGroupID);
    return (
        <Schemas 
            filters={{
                pbotID: queryParams.schemaID,
                title: queryParams.title, 
                year: queryParams.year, 
                groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
            }}
            includeCharacters={queryParams.includeCharacters} 
            standAlone={queryParams.standAlone} 
        />
    );
};

export default SchemaQueryResults;
