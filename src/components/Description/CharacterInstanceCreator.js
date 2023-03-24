import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import CharacterInstanceMutateForm from '../CharacterInstance/CharacterInstanceMutateForm.js';
import CharacterInstanceMutateResults from '../CharacterInstance/CharacterInstanceMutateResults.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";
//import CharacterInstances from '../CharacterInstance/CharacterInstances.js';




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
                        characterInstance: props.deleteCI.pbotID,
                        description: null,
                        character: "x",
                        state: "x,y",
                        quantity: "",
                        order: "",
                        mode: "delete"
                    }} />
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
    cI.sortName = `
            ${cI.state.order !== null ? `${cI.state.order}` : ``}${cI.character.name}${cI.state.value !== null ? `${cI.state.value}` : `${cI.state.State.name}`}
`.toUpperCase();
return cI
};

function CharacterInstances(props) {
    //console.log("CharacterInstances");
    //const [open, setOpen] = React.useState(false);
 
    if (!props.characterInstances) return ''; //TODO: is this the best place to handle this?
    //console.log(props.characterInstances);

  /*
    const handleClose = () => {
        setOpen(false);
    };
*/
    let characterInstances = alphabetize([...props.characterInstances].map(cI => massage({...cI})), "sortName");
    
    const style = {marginLeft:"4em"}
    return characterInstances.map((cI) => (
        <div key={cI.pbotID}  style={props.style || style}>
            {cI.character.name}: {(cI.state.value !== null && cI.state.value !== '') ? `${cI.state.value}` : `${cI.state.State.name}`}{cI.state.order ? `, order: ${cI.state.order}` : ``}
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

/*
const CharacterInstanceDialog = (props) => {
    console.log("CharacterInstanceDialog")
    console.log(props)

    return (
        <Dialog fullWidth={true} open={props.open}>
            <DialogTitle>
                Create character instance             
            </DialogTitle>
            <DialogContent>
                Hi there
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="secondary">Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}
*/

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
                <CharacterInstanceMutateForm handleSubmit={handleSubmit} mode="create" description={props.description} schema={props.schema}/>
                }
                {showResult &&
                <CharacterInstanceMutateResults queryParams={queryParams} exclude={props.exclude} />
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

const CharacterInstanceList = (props) => {
    console.log("CharacterInstanceList");
    console.log(props);

    let descriptionGQL = gql`
            query ($pbotID: ID) {
                Description (pbotID: $pbotID) {
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
                            order
                        }
                    }
                }
            }
        `;
    
    const { loading, error, data } = useQuery(descriptionGQL, {
        variables: {
            pbotID: props.description
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <CharacterInstances deleteCI={props.deleteCI} setDeleteCI={props.setDeleteCI} setDeleteOpen={props.setDeleteOpen} characterInstances={data.Description[0].characterInstances} />
    );

}

const CharacterInstanceCreator = (props) => {
    //const formikProps = useFormikContext();

    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [deleteCI, setDeleteCI] = React.useState(null);
    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };

    const [addDialogOpen, setAddDialogOpen] = React.useState(false);
    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const accstyle = {textAlign: "left", width: "70%"}
    return (
        <>
            {props.values.schema &&
                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Character instances
                    </AccordionSummary>
                    <AccordionDetails>
                        <CharacterInstanceList deleteCI={deleteCI} setDeleteCI={setDeleteCI} setDeleteOpen={setDeleteConfirmOpen} description={props.values.description}/>
                        <Button
                            style={{marginTop:"1.5em"}}
                            type="button"
                            variant="text" 
                            color="secondary" 
                            onClick={()=>{console.log("click"); console.log(props.values); /*setDesc(props.values.description); setSch(props.values.schema);*/ setAddDialogOpen(true)}}
                            disabled={false}
                        >
                            Add character instance
                        </Button>
                    </AccordionDetails>
                </Accordion>
            }

            {addDialogOpen && 
                <CharacterInstanceDialog description={props.values.description} schema={props.values.schema} open={addDialogOpen} handleClose={handleAddDialogClose}  />
            }
            {deleteConfirmOpen && 
                <CharacterInstanceDeleteDialog open={deleteConfirmOpen} deleteCI={deleteCI} setDeleteCI={setDeleteCI} handleClose={handleDeleteConfirmClose} />
            }
        </>
    );
};

export default CharacterInstanceCreator;
