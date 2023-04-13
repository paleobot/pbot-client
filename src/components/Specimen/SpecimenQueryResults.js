import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography } from '@mui/material';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';
import {publicGroupID} from '../Group/GroupSelect.js';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel'
import {SecureImage} from '../Image/SecureImage.js';
import logo from '../../PBOT-logo-transparent.png';

function Specimens(props) {
    console.log("SpecimenQueryResults Specimens");
    console.log(props);
 
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    const groups = props.standAlone ? '' : '$groups: [ID!], ';
    /*
    const filter = props.standAlone ? '' : `,  filter: {
        ${filters.collection ?
            "AND: [{elementOf_some: {pbotID_in: $groups}}, {collection: {pbotID: $collection}}]" : 
            "elementOf_some: {pbotID_in: $groups}"
        }
    }`;
    */

    let filter = '';
    if (!props.standAlone) {
        filter = ", filter: {"
        if (!filters.collection && !filters.states && !filters.character && !filters.schema) {
            filter += "elementOf_some: {pbotID_in: $groups}"
        } else {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}";
            if (filters.collection) {
                filter += ", {collection: {pbotID: $collection}}"
            }
            if (filters.states) {
                filter += `, {
                    describedBy: {
                        Description: { 
                            characterInstances_some: {
                                state: {
                                    State: {pbotID_in: $states}
                                }
                            }
                        }
                    }
                }`
            } else if (filters.character) {
                filter += `, {
                    describedBy: {
                        Description: { 
                            characterInstances_some: {
                                character: {pbotID: $character}
                            }
                        }
                    }
                }`
            } else if (filters.schema) {
                filter += `, {
                    describedBy: {
                        Description: { 
                            schema: {pbotID: $schema}
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
            query ($pbotID: ID, $name: String, ${groups} ${filters.collection ? ", $collection: ID" : ""} ${filters.schema ? ", $schema: ID" : ""} ${filters.character ? ", $character: ID" : ""} ${filters.states ? ", $states: [ID!]" : ""}) {
                Specimen (pbotID: $pbotID, name: $name ${filter}) {
                    pbotID
                    name
                }
            }
        `
    } else {
        gQL = gql`
            query ($pbotID: ID, $name: String, ${groups} $includeImages: Boolean!, $includeDescriptions: Boolean!, $includeOTUs: Boolean! ${filters.collection ? ", $collection: ID" : ""}) {
                Specimen (pbotID: $pbotID, name: $name ${filter}) {
                    pbotID
                    name
                    preservationMode {
                        name
                    }
                    idigbiouuid
                    pbdbcid
                    pbdboccid
                    organs {
                        type
                    }
                    elementOf {
                        name
                    }
                    references {
                        Reference {
                            title
                            publisher
                            year
                        }
                        order
                    }
                    images @include(if: $includeImages) {
                            pbotID
                            link
                            caption
                    }
                    describedBy @include(if: $includeDescriptions) {
                        Description {
                            pbotID
                            name
                            schema {
                                title
                            }
                            characterInstances {
                                pbotID
                                character {
                                    name
                                }
                                state {
                                    State {
                                        name
                                    }
                                    value
                                }
                            }
                        }
                    }
                    identifiedAs @include(if: $includeOTUs){
                        OTU {
                            name
                            family
                            genus
                            species
                        }
                    }
                    typeOf @include(if: $includeOTUs){
                        OTU {
                            name
                            family
                            genus
                            species
                        }
                    }
                    holotypeOf @include(if: $includeOTUs){
                        OTU {
                            name
                            family
                            genus
                            species
                        }
                    }
                }            
            }
        `;
    }
    
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters,
            includeImages: props.includeImages,
            includeDescriptions: props.includeDescriptions,
            includeOTUs: props.includeOTUs,
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const specimens = alphabetize([...data.Specimen], "name");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const indent3 = {marginLeft:"6em"}
    const carousel = {width: "60%", marginLeft: "2em", borderStyle:"solid"}
    return (specimens.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : specimens.map((s) => {
        const directURL = new URL(window.location.origin + "/query/specimen/" + s.pbotID);
        if (props.includeImages) {
            directURL.searchParams.append("includeImages", "true");
        }
        if (props.includeDescriptions) {
            directURL.searchParams.append("includeDescriptions", "true");
        }
        if (props.includeOTUs) {
            directURL.searchParams.append("includeOTUs", "true");
        }
            
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
                            Specimen: {s.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                        <Typography variant="h5" sx={{marginRight: "10px"}}>
                            Workspace: {s.elementOf[0].name}
                        </Typography>
                    </Grid>
                </Grid>
                <div style={indent}><b>direct link:</b> <Link color="success.main" underline="hover" href={directURL}  target="_blank">{directURL.toString()}</Link></div>

                <div style={indent}><b>pbotID:</b> {s.pbotID}</div>
                <div style={indent}><b>organs:</b> {s.organs.map((organ, index, arr) => organ.type + (index+1 === arr.length ? '' : ", "))}</div>
                {/*A mild shenanigan here to handle old specimen nodes without PRESERVED_BY relationships*/}
                <div style={indent}><b>preservation mode:</b> {s.preservationMode && s.preservationMode.constructor.name === "Object" ? s.preservationMode.name : "unspecified"}</div>
                <div style={indent}><b>idigbiouuid:</b> {s.idigbiouuid}</div>
                <div style={indent}><b>pbdbcid:</b> {s.pbdbcid}</div>
                <div style={indent}><b>pbdboccid:</b> {s.pbdboccid}</div>
                {s.images && s.images.length > 0 &&
                    <div style={carousel}>
                    {/*can't use thumbs because SecureImage does not immediately make image available*/}
                    <Carousel showThumbs={false}>  
                        {s.images.map((image) => (
                            <div key={image.pbotID} >
                                {/*<img src={image.link} alt={image.caption}/>*/}
                                <SecureImage src={image.link}/>
                            </div>
                        ))}
                    </Carousel>
                    </div>
                }
                {s.holotypeOf && s.holotypeOf.length > 0 &&
                    <div>
                        <div style={indent}><b>holotype of:</b></div>
                        {s.holotypeOf.map((h, idx) => (
                            <div key={idx}>
                                <div style={indent2}><b>name: {h.OTU.name}</b></div>
                                <div style={indent2}><b>family: {h.OTU.family}</b></div>
                                <div style={indent2}><b>genus: {h.OTU.genus}</b></div>
                                <div style={indent2}><b>species: {h.OTU.species}</b></div>
                            </div>
                        ))}
                    </div>
                }
                {s.typeOf && s.typeOf.length > 0 &&
                    <div>
                        <div style={indent}><b>type of:</b></div>
                        {s.typeOf.map((h, idx) => (
                            <div key={idx}>
                                <div style={indent2}><b>name: {h.OTU.name}</b></div>
                                <div style={indent2}><b>family: {h.OTU.family}</b></div>
                                <div style={indent2}><b>genus: {h.OTU.genus}</b></div>
                                <div style={indent2}><b>species: {h.OTU.species}</b></div>
                            </div>
                        ))}
                    </div>
                }
                {s.identifiedAs && s.identifiedAs.length > 0 &&
                    <div>
                        <div style={indent}><b>identified as:</b></div>
                        {s.identifiedAs.map((h, idx) => (
                            <div key={idx}>
                                <div style={indent2}><b>name: {h.OTU.name}</b></div>
                                <div style={indent2}><b>family: {h.OTU.family}</b></div>
                                <div style={indent2}><b>genus: {h.OTU.genus}</b></div>
                                <div style={indent2}><b>species: {h.OTU.species}</b></div>
                            </div>
                        ))}
                    </div>
                }
                {s.references && s.references.length > 0 &&
                    <div>
                        <div style={indent}><b>references:</b></div>
                        {alphabetize([...s.references], "order").map((reference, idx) => (
                            <div key={idx} style={indent2}>{reference.Reference.title}, {reference.Reference.publisher}, {reference.Reference.year}</div>
                        ))}
                    </div>
                }
                {s.describedBy && s.describedBy.length > 0 &&
                    <div>
                        <div style={indent}><b>descriptions:</b></div>
                        {s.describedBy.map((d,idx) => (
                            <div key={idx}>
                                <div style={indent2}><b>{d.Description.schema.title}</b></div>
                                {(d.Description.characterInstances && d.Description.characterInstances.length > 0) &&
                                <div>
                                    <CharacterInstances style={indent3}  characterInstances={d.Description.characterInstances} />
                                </div>
                                }
                            </div>
                        ))}
                    </div>
                }
            
                <br />
                </>
            }

            {!props.standAlone &&
            <Link color="success.main" underline="hover" href={directURL}  target="_blank"><b>{s.name || "(name missing)"}</b></Link>
            }

        </div>
        )
    });

}

const SpecimenQueryResults = ({queryParams}) => {
    console.log("SpecimenQueryResults");
    console.log(queryParams);
    
    return (
        <Specimens 
            filters={{
                pbotID: queryParams.specimenID,
                name: queryParams.name, 
                schema: queryParams.character ? null : queryParams.schema || null,
                character: queryParams.states && queryParams.states.length > 0 ? null : queryParams.character || null,
                states: queryParams.states && queryParams.states.length > 0  ? queryParams.states.map(state => state.split("~,")[1]) : null,
                collection: queryParams.collection || null, 
                organs: queryParams.organs || null,
                groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
            }}
            includeImages={queryParams.includeImages}
            includeDescriptions={queryParams.includeDescriptions} 
            includeOTUs={queryParams.includeOTUs} 
            standAlone={queryParams.standAlone} 
        />
    );
};

export default SpecimenQueryResults;
