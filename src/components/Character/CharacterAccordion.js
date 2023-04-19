import {
    gql, useQuery
} from "@apollo/client";
import React from 'react';
import { sort } from '../../util.js';
  
import { Accordion, AccordionDetails, AccordionSummary, MenuItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";

const Character = (props) => {
    const accstyle = {textAlign: "left", width: "100%"}
    const states = props.character.states;

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
                    {(states && states.length > 0) &&
                        <> 
                           <Formik
                                initialValues={{
                                    states: [], 
                                }}
                           >
                                {props => (
                                <Form>
                                <Field
                                    component={TextField}
                                    type="text"
                                    name="states"
                                    label="States"
                                    fullWidth 
                                    select={true}
                                    SelectProps={{
                                        multiple: true,
                                    }}
                                    disabled={false}
                                >
                                    {sortAndFlatten([...states], 0).map(({ pbotID, name, style }) => (
                                        <MenuItem 
                                            style={style}
                                            key={pbotID} 
                                            value={name + "~," + pbotID}
                                        >{name}</MenuItem>
                                    ))}
                                </Field>
                                </Form>
                                )}
                            </Formik>

                        </>
                    }
                </AccordionDetails>
            </Accordion>
        ) 
    } else {
        return (
            <>
            <p><b>{props.character.name}</b></p>
            {(states && states.length > 0) &&
                <> 
                           <Formik
                                initialValues={{
                                    states: [], 
                                }}
                           >
                                {props => (
                                <Form>
                                <Field
                                    component={TextField}
                                    type="text"
                                    name="states"
                                    label="States"
                                    fullWidth 
                                    select={true}
                                    SelectProps={{
                                        multiple: true,
                                    }}
                                    disabled={false}
                                >
                                    {sortAndFlatten([...states], 0).map(({ pbotID, name, style }) => (
                                        <MenuItem 
                                            style={style}
                                            key={pbotID} 
                                            value={name + "~," + pbotID}
                                        >{name}</MenuItem>
                                    ))}
                                </Field>
                                </Form>
                                )}
                            </Formik>
                </>
            }
            </>
)
    }
}

const sortAndFlatten = (states, level) => {
    const lstates = sort([...states], "order", "name");
    
    const indent = level * 2;
    const fontWeight = level === 0 ? "bold" : "normal";
    const style = {marginLeft: indent + "em", fontWeight: fontWeight};

    let flatList = []; 
    lstates.forEach((state) => {
        
        
        const {states, ...lightState} = state; // remove characters
        flatList.push({
            ...lightState,
            style: style,
        });
        
        if (state.states && state.states.length > 0) {
            flatList = flatList.concat(sortAndFlatten(state.states, level+1));
        }
        return flatList;
        
        
    })
    return flatList
}

/*
const State = (props) => {
    const accstyle = {textAlign: "left", width: "100%"}
    if (props.state.states && props.state.states.length > 0) { 
        //const states = sort([...props.state.states], "order", "name");
        const states = sortAndFlatten([...props.state.states], 0);
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
                    <Field
                        component={TextField}
                        type="text"
                        name="states"
                        label="States"
                        fullWidth 
                        select={true}
                        SelectProps={{
                            multiple: true,
                        }}
                        disabled={false}
                    >
                        {states.map(({ pbotID, name, style }) => (
                            <MenuItem 
                                style={style}
                                key={pbotID} 
                                value={name + "~," + pbotID}
                            >{name}</MenuItem>
                        ))}
                    </Field>
                    </AccordionDetails>
            </Accordion>
        ) 
    } else {
        return (
            <p style={props.style}>{props.state.name}</p>
        )
    }
}
*/
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