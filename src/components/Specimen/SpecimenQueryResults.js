import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import CharacterInstances from "../CharacterInstance/CharacterInstances";

function Specimens(props) {
    console.log("SpecimenQueryResults Specimens");
    console.log(props);
    let specs = Object.keys(props.filters).reduce((acc, key) => {
        console.log(key + ", " + props.filters[key]);
        if (props.filters[key]) acc += `, ${key}: "${props.filters[key]}"`;
        return acc;
    }, '');
    specs = specs === '' ? '' : `(${specs})`;
    console.log(specs);

    let specimenGQL;
    if (!props.includeComplex) {
        specimenGQL = gql`
            query {
                Specimen${specs} {
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
        specimenGQL = gql`
            query {
                Specimen${specs} {
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
        /*
        otuGQL = gql`
            query {
                Description (${specs}) {
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
        `;
        */
    }
    
    const { loading, error, data } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Specimen.map(({ specimenID, name, organ, description, archtypeDescription }) => (
        <div key={specimenID} style={style}>
            {specimenID}: {name}, {organ.type}{archtypeDescription ? `, ${archtypeDescription.Description.name}` : ""}{description ? "" : ", OTU specimen"}  <br />
             <CharacterInstances characterInstances={description ? description.Description.characterInstances : archtypeDescription.Description.characterInstances} />
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
