import {
    gql, useQuery
} from "@apollo/client";
import React, {useState} from 'react';
import { sort } from '../../util.js';
  
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import CharacterInstanceMutateForm from "../CharacterInstance/CharacterInstanceMutateForm.js";
import CharacterInstanceMutateResults from "../CharacterInstance/CharacterInstanceMutateResults.js";

const CharacterInstanceDialog = (props) => {
    console.log("CharacterInstanceDialog")
    console.log(props)
    const [showResult, setShowResult] = useState(false);
    const [queryParams, setQueryParams] = useState([]);

    const handleSubmit = (values) => {
        setQueryParams(values);
        setShowResult(true);
    }

    return (
        <Dialog fullWidth={true} open={props.open}>
            <DialogTitle>
                Create character instance             
            </DialogTitle>
            <DialogContent>
                {!showResult &&
                <CharacterInstanceMutateForm handleSubmit={handleSubmit} mode="create" description={props.description} schema={props.schema} character={props.character}/>
                }
                {showResult &&
                <CharacterInstanceMutateResults queryParams={queryParams} handleClose={props.handleClose}/>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="secondary">
                    {showResult ? "OK" : "Cancel"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const Character = (props) => {
    console.log("Character");
    console.log(props.schema)
    console.log(props.description)
    const [addDialogOpen, setAddDialogOpen] = React.useState(false);
    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const accstyle = {textAlign: "left", width: "100%"}
    const states = props.character.states;

    let characters;
    if (props.character.characters && props.character.characters.length > 0) { 
        characters = sort([...props.character.characters], "order", "name");
    }

    return (
        <>
        {characters &&
            <Accordion style={accstyle} defaultExpanded={false}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="required-content"
                    id="required-header"                        
                >
                    <b>{props.character.name}</b>
                </AccordionSummary>
                <AccordionDetails>
                    {(props.character.characterInstances && props.character.characterInstances.length > 0) &&
                        <>
                        {props.character.characterInstances.map(cI=> {
                            return (
                                <div>{cI.state.State.name}</div>
                            )
                        })}
                        </>
                    }
                    {(states && states.length > 0) &&
                        <Button
                            type="button"
                            variant="text" 
                            color="secondary" 
                            onClick={()=>{console.log("click"); console.log(props.values); /*setDesc(props.values.description); setSch(props.values.schema);*/ setAddDialogOpen(true)}}
                            disabled={false}
                        >
                            Add character instance
                        </Button>
                    }
                    {characters.map((character) => {
                        return (
                            <Character 
                                key={character.pbotID} 
                                character={character}
                                schema={props.schema}
                                description={props.description}
                            />
                        )       
                    })}
                </AccordionDetails>
            </Accordion>
        } 

        {!characters &&
            <>
            <div style={{marginTop: "1em"}}><b>{props.character.name}</b></div>
            {(props.character.characterInstances && props.character.characterInstances.length > 0) &&
                <>
                    {props.character.characterInstances.map(cI=> {
                        return (
                            <div>{cI.state.State.name}</div>
                        )
                    })}
                </>
            }
            {(states && states.length > 0) &&
                <Button
                    type="button"
                    variant="text" 
                    color="secondary" 
                    onClick={()=>{console.log("click"); console.log(props.values); /*setDesc(props.values.description); setSch(props.values.schema);*/ setAddDialogOpen(true)}}
                    disabled={false}
                >
                    Add character instance
                </Button>
            }
            </>
        }

        {addDialogOpen && 
            <CharacterInstanceDialog description={props.description} schema={props.schema} open={addDialogOpen} character={props.character.pbotID} handleClose={handleAddDialogClose}  />
        }
        </>
    )

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
    console.log("CharacterAccordion");
    console.log(props.schema)
    console.log(props.description)
    const gQL = gql`
    fragment CharacterFields on Character {
        pbotID
        name
        definition
        order
        states {
            name
        }
        characterInstances (filter: {description: {pbotID: $descriptionID}}) {
            state {
                State {
                    name
                    pbotID
                }
            }
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

    query ($schemaID: ID, $descriptionID: ID) {
        Schema (pbotID: $schemaID) {
            characters {
                ...CharacterFields
                ...CharactersRecurse
            }
        }
    }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {schemaID: props.schema, descriptionID: props.description}});

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
                        schema={props.schema}
                        description={props.description}
                    />
                )       
             })}

        </>
    );

}