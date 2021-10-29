import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import CharacterInstances from "../CharacterInstance/CharacterInstances";

function Specimens(props) {
    console.log("SpecimenQueryResults Specimens");
    console.log(props);
 
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    let gQL;
    if (!props.includeComplex) {
        gQL = gql`
            query ($specimenID: ID, $name: String, $locality: String) {
                Specimen (specimenID: $specimenID, name: $name, locality: $locality) {
                    specimenID
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
                            descriptionID
                        }
                    }
                }            
            }
        `;
    } else {
        gQL = gql`
            query ($specimenID: ID, $name: String, $locality: String) {
                Specimen (specimenID: $specimenID, name: $name, locality: $locality) {
                    specimenID
                    name
                    organ {
                        type
                    }
                    archtypeDescription {
                        Description {
                            descriptionID
                            type
                            name
                            family
                            genus
                            species
                            characterInstances {
                                characterInstanceID
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
                            descriptionID
                            type
                            name
                            family
                            genus
                            species
                            characterInstances {
                                characterInstanceID
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
           
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Specimen.map(({ specimenID, name, organ, description, archtypeDescription }) => (
        <div key={specimenID} style={style}>
            {specimenID}: {name}, {organ.type}{archtypeDescription ? `, ${archtypeDescription.Description.name}` : ""}{description ? "" : ", OTU specimen"}  <br />
             <CharacterInstances characterInstances={description ? 
                 description.Description.characterInstances : 
                 archtypeDescription ? 
                    archtypeDescription.Description.characterInstances :
                    ""
            } />
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
                            specimenID: queryParams.specimenID,
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
