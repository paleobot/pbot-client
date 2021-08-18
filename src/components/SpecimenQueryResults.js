import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

function CharacterInstances(props) {
    console.log("CharacterInstances");
    if (!props.characterInstances) return ''; //TODO: is this the best place to handle this?
    console.log(props.characterInstances);
    let characterInstances = [...props.characterInstances];
    characterInstances.sort((a,b) => {
        const nameA = a.character.name.toUpperCase(); 
        const nameB = b.character.name.toUpperCase(); 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    const style = {marginLeft:"2em"}
    return characterInstances.map(({characterInstanceID, character, state}) => (
        <div key={characterInstanceID}  style={style}>
            {character.name}: {state.value !== null ? `${state.value}` : `${state.State.name}`}<br />
        </div>
    ));
}

/*
function OTUs(props) {
    console.log(props);
    console.log(props.filters.genus);
    const specs = Object.keys(props.filters).reduce((acc, key) => {
        console.log(key + ", " + props.filters[key]);
        if (props.filters[key]) acc += `, ${key}: "${props.filters[key]}"`;
        return acc;
    }, 'type: "OTU"');
    console.log(specs);

    let otuGQL;
    if (!props.includeComplex) {
        otuGQL = gql`
            query {
                Description(${specs}) {
                    descriptionID
                    name
                    family
                    genus
                    species
                }            
            }
        `;
    } else {
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
    }
    
    const { loading, error, data } = useQuery(otuGQL);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Description.map(({ descriptionID, name, family, genus, species, characterInstances }) => (
        <div key={descriptionID} style={style}>
            {descriptionID}: {name}, {family}, {genus}, {species} <br />
            <CharacterInstances characterInstances={characterInstances} />
            <br />
        </div>
    ));

}
*/

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
    
    const { loading, error, data } = useQuery(specimenGQL);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Specimen.map(({ specimenID, name, description, archtypeDescription }) => (
        <div key={specimenID} style={style}>
            {specimenID}: {name}{archtypeDescription ? `, ${archtypeDescription.Description.name}` : ""}{description ? "" : ", OTU specimen"}  <br />
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
        <ApolloProvider client={client}>
            {specimens}
        </ApolloProvider>
    );
};

export default SpecimenQueryResults;
