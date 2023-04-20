import {
    gql, useQuery
} from "@apollo/client";
import React, {useState} from 'react';
import { alphabetize, sort } from '../../util.js';
  
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import CharacterInstanceMutateForm from "../CharacterInstance/CharacterInstanceMutateForm.js";
import CharacterInstanceMutateResults from "../CharacterInstance/CharacterInstanceMutateResults.js";

const CharacterInstanceDeleteDialog = (props) => {
    const [showResult, setShowResult] = useState(false);

    return (
        <Dialog fullWidth={true} open={props.open}>
            <DialogTitle>
                Delete Character Instance
            </DialogTitle>
            <DialogContent>
                {showResult &&
                    <CharacterInstanceMutateResults queryParams={{
                        //All we care about here is characterInstance.
                        //The rest is stub data to satisfy the graphql interface. 
                        characterInstance: props.deleteCI.pbotID,
                        description: null,
                        character: "x",
                        state: "x~,y",
                        quantity: "",
                        order: "",
                        mode: "delete"
                    }}  handleClose={props.handleClose} />
                }
                {!showResult &&
                <>
                <p>You are about to delete the Character Instance <i>{props.deleteCI.character.name} - {props.deleteCI.state.State.name}</i></p>
                <p>Are you sure you want to do this?</p>
                </>
                }
            </DialogContent>
            <DialogActions>
                {showResult &&
                    <Button onClick={props.handleClose} color="secondary">Ok</Button>
                }
                {!showResult &&
                <>
                    <Button onClick={()=>{setShowResult(true)}} color="secondary">Do it</Button>
                    <Button onClick={() => {props.setDeleteCI(null); props.handleClose()}} color="secondary">Cancel</Button>
                </>
                }
            </DialogActions>
        </Dialog>
    )
}

const massage = cI => {
    cI.sortName01 = cI.state.order !== null ? `${cI.state.order}` : ``;
    cI.sortName02 = `${cI.state.State.name}`.toUpperCase();
    console.log("massage")
    console.log(cI);
    return cI
};

function CharacterInstances(props) {
    //console.log("CharacterInstances");
    //const [open, setOpen] = React.useState(false);
 
    if (!props.characterInstances) return ''; 

    let characterInstances = sort([...props.characterInstances].map(cI => massage({...cI})), "#sortName01", "sortName02");
    
    const style = {marginLeft:"4em"}
    return characterInstances.map((cI) => (
        <div key={cI.pbotID}  style={props.style || style}>
            {(cI.state.value !== null && cI.state.value !== '') ? `${cI.state.value}` : `${cI.state.State.name}`}{cI.state.order ? `, order: ${cI.state.order}` : ``}
            <Button
                type="button"
                variant="text" 
                color="secondary" 
                size="large"
                onClick={() => {props.setDeleteCI(cI); props.setDeleteOpen(true)}}
                sx={{width:"50px"}}
            >
                X
            </Button>
            <br />
        </div>
    ));
}

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
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [deleteCI, setDeleteCI] = React.useState(null);
    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
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
                        <CharacterInstances deleteCI={deleteCI} setDeleteCI={setDeleteCI} setDeleteOpen={setDeleteConfirmOpen} characterInstances={props.character.characterInstances} />
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
                <CharacterInstances deleteCI={deleteCI} setDeleteCI={setDeleteCI} setDeleteOpen={setDeleteConfirmOpen} characterInstances={props.character.characterInstances} />
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
        {deleteConfirmOpen && 
            <CharacterInstanceDeleteDialog open={deleteConfirmOpen} deleteCI={deleteCI} setDeleteCI={setDeleteCI} handleClose={handleDeleteConfirmClose} />
        }
        </>
    )

}

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
            pbotID
            character {
                name
            }
            state {
                State {
                    name
                    pbotID
                }
                order
                value
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