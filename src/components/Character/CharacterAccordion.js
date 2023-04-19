import {
    gql, useQuery
} from "@apollo/client";
import React from 'react';
import { sort } from '../../util.js';
  
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Character = (props) => {
    const accstyle = {textAlign: "left", width: "100%"}
    if (props.character.characters && props.character.characters.length > 0) { 
        const characters = sort([...props.character.characters], "order", "name");
        return (
            <Accordion style={accstyle} defaultExpanded={false}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="required-content"
                    id="required-header"                        
                >
                    <b>{props.character.name}</b>
                </AccordionSummary>
                <AccordionDetails>
                    {characters.map((character) => {
                        return (
                            <Character 
                                key={character.pbotID} 
                                character={character}
                            />
                        )       
                    })}
                    {(props.character.states && props.character.states.length > 0) &&
                        <> 
                        {sort([...props.character.states], "order", "name").map((state) => {
                            return (
                                <State 
                                    key={state.pbotID} 
                                    state={state}
                                />
                            )       
                        })}
                        </>
                    }
                </AccordionDetails>
            </Accordion>
        ) 
    } else {
        return (
            <>
            <p><b>{props.character.name}</b></p>
            {(props.character.states && props.character.states.length > 0) &&
                <> 
                {sort([...props.character.states], "order", "name").map((state) => {
                    return (
                        <State 
                            key={state.pbotID} 
                            state={state}
                        />
                    )       
                })}
                </>
            }
            </>
)
    }
}

const State = (props) => {
    const accstyle = {textAlign: "left", width: "100%"}
    if (props.state.states && props.state.states.length > 0) { 
        const states = sort([...props.state.states], "order", "name");
        return (
            <Accordion style={accstyle} defaultExpanded={false}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="required-content"
                    id="required-header"                        
                >
                    {props.state.name}
                </AccordionSummary>
                <AccordionDetails>
                    <p>{props.state.name}</p>
                    {states.map((state) => {
                        return (
                            <State 
                                style={{marginLeft:"2em"}}
                                key={state.pbotID} 
                                state={state}
                            />
                        )       
                    })}
                </AccordionDetails>
            </Accordion>
        ) 
    } else {
        return (
            <p style={props.style}>{props.state.name}</p>
        )
    }
}

export const CharacterAccordion = (props) => {
    const gQL = gql`
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

    query ($schemaID: ID) {
        Schema (pbotID: $schemaID) {
            characters {
                ...CharacterFields
                ...CharactersRecurse
            }
        }
    }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {schemaID: props.schema}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                    
    console.log(">>>>>>>>>>>>Results<<<<<<<<<<<<<");
    console.log(data.Schema[0].characters);

    const characters = sort([...data.Schema[0].characters], "order", "name");
    //const states = sort([...data.Schema[0].states], "order", "name");

    const style = {minWidth: "12ch"}
    return data.Schema[0].characters && data.Schema[0].characters.length === 0 ? null : (
        <>
            {characters.map((character) => {
                return (
                    <Character 
                        key={character.pbotID} 
                        character={character}
                    />
                )       
             })}

        </>
    );

}