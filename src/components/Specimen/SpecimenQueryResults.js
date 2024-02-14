import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { Link, Grid, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel'
import {SecureImage} from '../Image/SecureImage.js';
import logo from '../../PBOT-logo-transparent.png';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

function Specimens(props) {
    console.log("SpecimenQueryResults Specimens");
    console.log(props);
 
    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    console.log(filters)

    const groups = props.standAlone ? '' : '$groups: [ID!] ';
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
        if (!filters.collection && !filters.preservationModes && !filters.partsPreserved && !filters.notableFeatures && !filters.identifiers && !filters.states && !filters.character && !filters.schema && !filters.references && !filters.description && !filters.identifiedAs && !filters.typeOf && !filters.holotypeOf) {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}, {pbotID_not_in: $excludeList}]"
        } else {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}, {pbotID_not_in: $excludeList}";
            if (filters.collection) {
                filter += ", {collection: {pbotID: $collection}}"
            }
            if (filters.preservationModes) {
                filter += ", {preservationModes: {pbotID_in: $preservationModes}}"
            }
            if (filters.partsPreserved) {
                console.log("adding partsPreserved")
                filter += ", {partsPreserved_some: {pbotID_in: $partsPreserved}}"
            }
            if (filters.notableFeatures) {
                filter += ", {notableFeatures_some: {pbotID_in: $notableFeatures}}"
            }
            if (filters.identifiers) {
                filter += ", {identifiers: {pbotID_in: $identifiers}}"
            }

            if (filters.references) {
                filter += `, {
                    references_some: {
                        Reference: {
                            pbotID_in: $references 
                        } 
                    }
                }`
            }

            if (filters.description) {
                filter += `, {
                    describedBy_some: {
                        Description: {
                            pbotID: $description 
                        } 
                    }
                }`
            }

            if (filters.identifiedAs) {
                filter += `, {
                    identifiedAs_some: {
                        OTU: {
                            pbotID: $identifiedAs 
                        } 
                    }
                }`
            }

            if (filters.typeOf) {
                filter += `, {
                    typeOf_some: {
                        OTU: {
                            pbotID: $typeOf 
                        } 
                    }
                }`
            }

            if (filters.holotypeOf) {
                filter += `, {
                    holotypeOf_some: {
                        OTU: {
                            pbotID: $holotypeOf 
                        } 
                    }
                }`
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

    const fields = 
        props.standAlone ?
        `
            pbotID
            name
            collection {
                name
            }
            repository
            otherRepositoryLink
            notes
            identifiers {
                given
                surname
            } 
            preservationModes {
                name
            }
            idigbioInstitutionCode
            idigbioCatalogNumber
            idigbiouuid
            pbdboccid
            partsPreserved {
                type
            }
            notableFeatures {
                name
            }
            elementOf {
                name
            }
            references (orderBy: order_asc) {
                Reference {
                    title
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
                    writtenDescription
                    notes
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
        `
        : props.handleSelect ?
        `
            pbotID
            name
            collection {
                name
                pbotID
            }
            repository
            otherRepositoryLink
            notes
            identifiers {
                given
                surname
                pbotID
            } 
            preservationModes {
                name
                pbotID
            }
            idigbioInstitutionCode
            idigbioCatalogNumber
            idigbiouuid
            pbdboccid
            partsPreserved {
                type
                pbotID
            }
            notableFeatures {
                name
                pbotID
            }
            elementOf {
                name
                pbotID
            }
            references (orderBy: order_asc) {
                Reference {
                    title
                    year
                    pbotID
                }
                order
            }
        `
        :
        `
            pbotID
            name
        `;

    let gQL;
    if (!props.standAlone) {
        gQL = gql`
            query (
                $pbotID: ID, 
                $name: String, 
                $idigbioInstitutionCode: String, 
                $idigbioCatalogNumber: String, 
                $idigbiouuid: String, 
                $repository: String,
                ${groups} 
                ${filters.preservationModes ? ", $preservationModes: [ID!]" : ""} 
                ${filters.partsPreserved ? ", $partsPreserved: [ID!]" : ""} 
                ${filters.notableFeatures ? ", $notableFeatures: [ID!]" : ""} 
                ${filters.identifiers ? ", $identifiers: [ID!]" : ""} 
                ${filters.references ? ", $references: [ID!]" : ""}
                ${filters.collection ? ", $collection: ID" : ""} 
                ${filters.schema ? ", $schema: ID" : ""} 
                ${filters.character ? ", $character: ID" : ""} 
                ${filters.states ? ", $states: [ID!]" : ""}, 
                ${filters.description ? ", $description: ID" : ""},
                ${filters.identifiedAs ? ", $identifiedAs: ID" : ""},
                ${filters.typeOf ? ", $typeOf: ID" : ""},
                ${filters.holotypeOf ? ", $holotypeOf: ID" : ""},
                $excludeList: [ID!]
            ) {
                Specimen (
                    pbotID: $pbotID, 
                    name: $name, 
                    idigbioInstitutionCode: $idigbioInstitutionCode, 
                    idigbioCatalogNumber: $idigbioCatalogNumber, 
                    idigbiouuid: $idigbiouuid, 
                    repository: $repository
                    ${filter}
                ) {
                    ${fields}
                }
            }
        `
    } else {
        gQL = gql`
            query (
                $pbotID: ID, 
                $name: String, 
                ${groups} 
                $includeImages: Boolean!, 
                $includeDescriptions: Boolean!, 
                $includeOTUs: Boolean! 
                ${filters.collection ? ", $collection: ID" : ""}
            ) {
                Specimen (pbotID: $pbotID, name: $name ${filter}) {
                    ${fields}
                }            
            }
        `;
    }
    
    //For SpecimenManager applications, omit specimens that are already in the list
    const excludeIDs = props.exclude ? props.exclude.map(specimen => specimen.pbotID) : [];
    console.log(excludeIDs)
    console.log(gQL)
 
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters,
            includeImages: props.includeImages,
            includeDescriptions: props.includeDescriptions,
            includeOTUs: props.includeOTUs,
            excludeList: excludeIDs
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
    if (specimens.length === 0) {
        return (
            <div style={style}>
                No {(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
            </div>
        )
    }
    if (props.handleSelect) {
        console.log("Manager results")
        return (
            <List sx={{ pt: 0 }}>
            {specimens.map((specimen) => (
                <ListItem disableGutters key={specimen.pbotID}>
                    <ListItemButton onClick={() => props.handleSelect(specimen)} >
                        <ListItemText 
                        primary={specimen.name} secondary={`pbot id: ${specimen.pbotID}`} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        )
    }
    return (
        specimens.map((s) => {
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
                
            const header1 = {marginLeft:"2em", marginTop:"10px"}
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

                    <div style={header1}><Typography variant="h6">Identity</Typography></div>
                    <div style={indent}><b>pbotID:</b> {s.pbotID}</div>
                    <div style={indent}><b>collection:</b> {s.collection.name}</div>
                    <div style={indent}><b>idigbio InstitutionCode/CatalogNumber/uuid:</b> {`${s.idigbioInstitutionCode}/${s.idigbioCatalogNumber}/${s.idigbiouuid}`}</div>
                    <div style={indent}><b>references:</b></div>
                    {s.references && s.references.length > 0 &&
                        <div>
                            {alphabetize([...s.references], "order").map((reference, idx) => (
                                <div key={idx} style={indent2}>{reference.Reference.title}, {reference.Reference.year}</div>
                            ))}
                        </div>
                    }

                    <div style={header1}><Typography variant="h6">Preservation</Typography></div>
                    <div style={indent}><b>parts preserved:</b> {s.partsPreserved.map((organ, index, arr) => organ.type + (index+1 === arr.length ? '' : ", "))}</div>
                        <div style={indent}><b>notable features:</b> {s.notableFeatures.map((feature, index, arr) => feature.name + (index+1 === arr.length ? '' : ", "))}</div>

                    <div style={indent}><b>preservation modes:</b> {s.preservationModes.map((pM, index, arr) => pM.name + (index+1 === arr.length ? '' : ", "))}</div>

                    <div style={header1}><Typography variant="h6">Repository</Typography></div>
                    <div style={indent}><b>repository:</b> {s.repository}</div>
                    <div style={indent}><b>other repository link:</b> {s.otherRepositoryLink}</div>

                    <div style={header1}><Typography variant="h6">Identification</Typography></div>
                    <div style={indent}><b>identified by:</b></div>
                    {s.identifiers && s.identifiers.length > 0 &&
                        <div>
                            {s.identifiers.map((i, idx) => (
                                <div key={idx} style={indent2}>{i.given + " " + i.surname}</div>
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

                    <div style={indent}><b>notes:</b> {s.notes}</div>

                    {s.images && s.images.length > 0 &&
                    <>
                    <div style={header1}><Typography variant="h6">Images</Typography></div>
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
                    </>
                    }
                    {s.describedBy && s.describedBy.length > 0 &&
                        <div>
                            <div style={indent}><b>descriptions:</b></div>
                            {s.describedBy.map((d,idx) => (
                                <div key={idx}>
                                    <div style={indent2}><b>from schema "{d.Description.schema.title}"</b></div>
                                    <div style={indent3}><b>written description:</b> {d.Description.writtenDescription}</div>
                                    <div style={indent3}><b>notes:</b> {d.Description.notes}</div>
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
                <Link style={indent} color="success.main" underline="hover" href={directURL}  target="_blank"><b>{s.name || "(name missing)"}</b></Link>
                }

            </div>
            )
        })
    );

}

const SpecimenQueryResults = ({queryParams, handleSelect, exclude}) => {
    console.log("SpecimenQueryResults");
    console.log(queryParams); 
    
    const global = useContext(GlobalContext);

    return (
        <Specimens 
            filters={{
                pbotID: queryParams.specimenID,
                name: queryParams.name, 
                description: queryParams.description || null,
                identifiedAs: queryParams.identifiedAs || null,
                typeOf: queryParams.typeOf || null,
                holotypeOf: queryParams.holotypeOf || null,
                schema: queryParams.character ? null : queryParams.schema || null,
                character: queryParams.states && queryParams.states.length > 0 ? null : queryParams.character || null,
                states: queryParams.states && queryParams.states.length > 0  ? queryParams.states.map(state => state.split("~,")[1]) : null,
                collection: queryParams.collection || null, 
                partsPreserved: queryParams.partsPreserved && queryParams.partsPreserved.length > 0 ? queryParams.partsPreserved : null,
                notableFeatures: queryParams.notableFeatures && queryParams.notableFeatures.length > 0 ? queryParams.notableFeatures : null,
                preservationModes: queryParams.preservationModes && queryParams.preservationModes.length > 0 ? queryParams.preservationModes : null,
                idigbioInstitutionCode: queryParams.idigbioInstitutionCode || null,
                idigbioCatalogNumber: queryParams.idigbioCatalogNumber || null,
                idigbiouuid: queryParams.idigbiouuid || null,
                repository: queryParams.repository || null,
                references: queryParams.references && queryParams.references.length > 0 ? queryParams.references.map(r => r.pbotID) : null,
                identifiers: queryParams.identifiers && queryParams.identifiers.length > 0 ?queryParams.identifiers.map(({pbotID}) => pbotID)  : null, 
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeImages={queryParams.includeImages}
            includeDescriptions={queryParams.includeDescriptions} 
            includeOTUs={queryParams.includeOTUs} 
            standAlone={queryParams.standAlone} 
            handleSelect={handleSelect}
            exclude={exclude}
        />
    );
};

export default SpecimenQueryResults;
