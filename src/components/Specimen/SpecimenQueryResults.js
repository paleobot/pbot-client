import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';
import {publicGroupID} from '../Group/GroupSelect.js';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel'
import {SecureImage} from '../Image/SecureImage.js';

function Specimens(props) {
    console.log("SpecimenQueryResults Specimens");
    console.log(props);
 
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    const gQL = gql`
            query ($pbotID: ID, $name: String, $groups: [ID!], $includeImages: Boolean!, $includeDescriptions: Boolean!, $includeOTUs: Boolean! ${filters.collection ? ", $collection: ID" : ""}) {
                Specimen (pbotID: $pbotID, name: $name, filter: {
                    ${filters.collection ?
                        "AND: [{elementOf_some: {pbotID_in: $groups}}, {collection: {pbotID: $collection}}]" : 
                        "elementOf_some: {pbotID_in: $groups}"
                    }
                }) {
                    pbotID
                    name
                    preservationMode
                    idigbiouuid
                    pbdbcid
                    pbdboccid
                    organ {
                        type
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
                    exampleOf @include(if: $includeOTUs){
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
    ) : specimens.map((s) => (
        <div key={s.pbotID} style={style}>
            <b>{s.name || "(name missing)"}</b>
            <div style={indent}><b>pbotID:</b> {s.pbotID}</div>
            <div style={indent}><b>organ:</b> {s.organ.type}</div>
            <div style={indent}><b>preservation mode:</b> {s.preservationMode}</div>
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
            {s.exampleOf && s.exampleOf.length > 0 &&
                <div>
                    <div style={indent}><b>example of:</b></div>
                    {s.exampleOf.map((h, idx) => (
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
        </div>
    ));

}

const SpecimenQueryResults = ({queryParams, queryEntity}) => {
    console.log("SpecimenQueryResults");
    console.log(queryParams);

    let specimens = queryEntity === "Specimen" ? (
                    <Specimens 
                        filters={{
                            pbotID: queryParams.specimenID,
                            name: queryParams.name, 
                            collection: queryParams.collection || null, 
                            groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
                        }}
                        includeImages={queryParams.includeImages}
                        includeDescriptions={queryParams.includeDescriptions} 
                        includeOTUs={queryParams.includeOTUs} 
                    />
                ) : 
                '';
    
    return (
        <div>
            {specimens}
        </div>
    );
};

export default SpecimenQueryResults;
