import {
    gql, useQuery
} from "@apollo/client";
import React, {useState} from 'react';
import { alphabetize, sort } from '../../util.js';
  
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import CharacterInstanceMutateForm from "../CharacterInstance/CharacterInstanceMutateForm.js";
import CharacterInstanceMutateResults from "../CharacterInstance/CharacterInstanceMutateResults.js";

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EditIcon from '@mui/icons-material/Edit';

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      //borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));
  
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));
  
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
    
    const style = {marginLeft:"2em"}
    return characterInstances.map((cI) => (
        <div key={cI.pbotID}  style={props.style || style}>
            <Grid container spacing={2}>
                <Grid xs={8} style={{padding:"5px"}}>
                    {(cI.state.value !== null && cI.state.value !== '') ? `${cI.state.value}` : `${cI.state.State.name}`}{cI.state.order ? `, order: ${cI.state.order}` : ``}
                </Grid>
                <Grid xs={4} style={{padding:"5px"}}>
                    <Button
                        type="button"
                        variant="text" 
                        color="secondary" 
                        size="small"
                        onClick={() => {props.setEditCI(cI); props.setEditOpen(true)}}
                        sx={{minWidth: "20px", padding: "0px"}}
                    >
                        <EditIcon fontSize="small"/>
                    </Button>
                    <Button
                        type="button"
                        variant="text" 
                        color="secondary" 
                        size="small"
                        onClick={() => {props.setDeleteCI(cI); props.setDeleteOpen(true)}}
                        sx={{marginLeft: "10px", minWidth: "20px", padding:"0px"}}
                    >
                        <ClearOutlinedIcon fontSize="small"/>
                    </Button>
                </Grid>
            </Grid>
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

const CharacterInstanceEditDialog = (props) => {
    console.log("CharacterInstanceEditDialog")
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
                Edit character instance             
            </DialogTitle>
            <DialogContent>
                {!showResult &&
                <CharacterInstanceMutateForm handleSubmit={handleSubmit} mode="edit" description={props.description} schema={props.schema} character={props.character} characterInstance={props.editCI}/>
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

const CharacterInstanceExec = (props) => {
    const [addDialogOpen, setAddDialogOpen] = React.useState(false);
    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editCI, setEditCI] = React.useState(null);
    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [deleteCI, setDeleteCI] = React.useState(null);
    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };
    
    const states = props.character.states;

    return (
    <>
        {(props.character.characterInstances && props.character.characterInstances.length > 0) &&
            <div style={{marginTop:"10px"}}>
                <CharacterInstances deleteCI={deleteCI} setDeleteCI={setDeleteCI} setDeleteOpen={setDeleteConfirmOpen} editCI={editCI} setEditCI={setEditCI} setEditOpen={setEditDialogOpen} characterInstances={props.character.characterInstances} />
            </div>
        }
        {(states && states.length > 0) &&
            <Button
                type="button"
                variant="text" 
                color="secondary" 
                onClick={()=>{console.log("click"); console.log(props.values); /*setDesc(props.values.description); setSch(props.values.schema);*/ setAddDialogOpen(true)}}
                disabled={false}
            >
                <AddBoxOutlinedIcon/>
                
            </Button>
        }

        {addDialogOpen && 
            <CharacterInstanceDialog description={props.description} schema={props.schema} open={addDialogOpen} character={props.character.pbotID} handleClose={handleAddDialogClose}  />
        }
        {editDialogOpen && 
            <CharacterInstanceEditDialog description={props.description} schema={props.schema}character={props.character.pbotID} open={editDialogOpen} editCI={editCI} setEditCI={setEditCI} handleClose={handleEditDialogClose} />
        }
        {deleteConfirmOpen && 
            <CharacterInstanceDeleteDialog open={deleteConfirmOpen} deleteCI={deleteCI} setDeleteCI={setDeleteCI} handleClose={handleDeleteConfirmClose} />
        }
    </>
    )
}

const Character = (props) => {
    //console.log("Character");
    //console.log(props.schema)
    //console.log(props.description)

    const accstyle = {textAlign: "left", width: "100%", marginTop: "1em"}

    let subCharacters;
    if (props.character.characters && props.character.characters.length > 0) { 
        subCharacters = sort([...props.character.characters], "order", "name");
    }

    return (
        <>
        {subCharacters &&
            <Accordion style={accstyle} defaultExpanded={false} >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="required-content"
                    id="required-header"                         
                >
                    <b>{props.character.name}</b>
                </AccordionSummary>
                <AccordionDetails>
                    <CharacterInstanceExec character={props.character} schema={props.schema} description={props.description}/>
                   {subCharacters.map((character) => {
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

        {!subCharacters &&
            <>
                <div style={{marginTop: "1em"}}><b>{props.character.name}</b></div>
                <CharacterInstanceExec character={props.character} schema={props.schema} description={props.description}/>
            </>
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