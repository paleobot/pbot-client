import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';
import {publicGroupID} from '../Group/GroupSelect.js';

function Specimens(props) {
    console.log("SpecimenQueryResults Specimens");
    console.log(props);
 
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    let gQL;
    if (!props.includeComplex) {
        gQL = gql`
            query ($pbotID: ID, $name: String, $locality: String, $groups: [ID!] ${filters.collection ? ", $collection: ID" : ""}) {
                Specimen (pbotID: $pbotID, name: $name, locality: $locality, filter: {
                    ${filters.collection ?
                        "AND: [{elementOf_some: {pbotID_in: $groups}}, {collection: {pbotID: $collection}}]" : 
                        "elementOf_some: {pbotID_in: $groups}"
                    }
                }) {
                    pbotID
                    name
                    organ {
                        type
                    }
                    archtypeDescription {
                        Description {
                            name
                        }
                    }
                    description {
                        Description {
                            pbotID
                        }
                    }
                    references {
                        Reference {
                            title
                            publisher
                            year
                        }
                        order
                    }
                }            
            }
        `;
    } else {
        gQL = gql`
            query ($pbotID: ID, $name: String, $locality: String, $groups: [ID!] ${filters.collection ? ", $collection: ID" : ""}) {
                Specimen (pbotID: $pbotID, name: $name, locality: $locality, filter: {
                    ${filters.collection ?
                        "AND: [{elementOf_some: {pbotID_in: $groups}}, {collection: {pbotID: $collection}}]" : 
                        "elementOf_some: {pbotID_in: $groups}"
                    }
                }) {
                    pbotID
                    name
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
                    archtypeDescription {
                        Description {
                            pbotID
                            type
                            name
                            family
                            genus
                            species
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
                    description {
                        Description {
                            pbotID
                            type
                            name
                            family
                            genus
                            species
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
           
    const specimens = alphabetize([...data.Specimen], "name");

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    return (specimens.length === 0) ? (
        <div style={style}>
            No {(filters.groups && filters.groups.length === 1 && publicGroupID === filters.groups[0]) ? "public" : ""} results were found.
        </div>
    ) : specimens.map(({ pbotID, name, organ, description, archtypeDescription, references }) => (
        <div key={pbotID} style={style}>
            <b>{name || "(name missing)"}</b>
            <div style={indent}><b>pbotID:</b> {pbotID}</div>
            <div style={indent}><b>organ:</b> {organ.type}</div>
            <div style={indent}><b>archetype description:</b> {archtypeDescription ? `${archtypeDescription.Description.name}` : ""}</div>
            <div style={indent}><b>description:</b> {description ? "" : "OTU specimen"}</div>
            {references && references.length > 0 &&
                <div>
                    <div style={indent}><b>references:</b></div>
                    {alphabetize([...references], "order").map(reference => (
                        <div style={indent2}>{reference.Reference.title}, {reference.Reference.publisher}, {reference.Reference.year}</div>
                    ))}
                </div>
            }
            {((description && description.Description.characterInstances && description.Description.characterInstances.length > 0) || (archtypeDescription && archtypeDescription.Description.characterInstances && archtypeDescription.Description.characterInstances.length > 0)) &&
            <div>
                <div style={indent}><b>character instances:</b></div>
                <CharacterInstances characterInstances={description ? 
                    description.Description.characterInstances : 
                    archtypeDescription ? 
                        archtypeDescription.Description.characterInstances :
                        ""
                } />
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
                            locality: queryParams.locality, 
                            collection: queryParams.collection || null, 
                            groups: queryParams.groups.length === 0 ? [publicGroupID] : queryParams.groups, 
                        }}
                        includeComplex={queryParams.includeComplex} 
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
