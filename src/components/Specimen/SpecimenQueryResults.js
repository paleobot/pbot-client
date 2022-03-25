import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';

function Specimens(props) {
    console.log("SpecimenQueryResults Specimens");
    console.log(props);
 
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    let gQL;
    if (!props.includeComplex) {
        gQL = gql`
            query ($pbotID: ID, $name: String, $locality: String) {
                Specimen (pbotID: $pbotID, name: $name, locality: $locality) {
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
                }            
            }
        `;
    } else {
        gQL = gql`
            query ($pbotID: ID, $name: String, $locality: String) {
                Specimen (pbotID: $pbotID, name: $name, locality: $locality) {
                    pbotID
                    name
                    organ {
                        type
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
    return (specimens.length === 0) ? (
        <div style={style}>
            No public results were found.
        </div>
    ) : specimens.map(({ pbotID, name, organ, description, archtypeDescription }) => (
        <div key={pbotID} style={style}>
            <b>{name || "(name missing)"}</b>
            <div style={indent}><b>pbotID:</b> {pbotID}</div>
            <div style={indent}><b>organ:</b> {organ.type}</div>
            <div style={indent}><b>archtype description:</b> {archtypeDescription ? `${archtypeDescription.Description.name}` : ""}</div>
            <div style={indent}><b>description:</b> {description ? "" : "OTU specimen"}</div>
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
