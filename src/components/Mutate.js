import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid, Button, Divider, Typography, Tooltip} from '@mui/material';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import DescriptionMutateForm from './Description/DescriptionMutateForm';
import OTUMutateForm from './OTU/OTUMutateForm';
import SynonymMutateForm from './Synonym/SynonymMutateForm';
import CommentMutateForm from './Comment/CommentMutateForm';
import CharacterInstanceMutateForm from './CharacterInstance/CharacterInstanceMutateForm';
import SpecimenMutateForm from './Specimen/SpecimenMutateForm';
import ReferenceMutateForm from './Reference/ReferenceMutateForm';
import SchemaMutateForm from './Schema/SchemaMutateForm';
import CharacterMutateForm from './Character/CharacterMutateForm';
import StateMutateForm from './State/StateMutateForm';
import PersonMutateForm from './Person/PersonMutateForm';
import GroupMutateForm from './Group/GroupMutateForm';
import CollectionMutateForm from './Collection/CollectionMutateForm';
import ImageMutateForm from './Image/ImageMutateForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ToggleButtonGroup } from '@mui/material';
import { ToggleButton } from '@mui/material';

import FileUpload from './FileUpload';
import { useAuth } from './AuthContext';


const Mutate = ({handleSubmit, selectedForm, handleFormChange, setShowResult}) => {
    //This annoying bit of razzle-dazzle is to force MUI RadioGroup to reset when the path is just "/mutate".
    //Without this, if we had selected a form then navigated somewhere else then navigated back via a
    //Workbench button, the radio button was still set. I could find no graceful way to fix this, so...
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const FormSelector = (form, reset) => {
        if (!form) {
            reset();
        };
        return (
                <FormControl component="fieldset">
                    <RadioGroup aria-label="form" name="form1" value={selectedForm} onChange={handleFormChange}>
                        <FormControlLabel value="otu" control={<Radio />} label="Taxa (OTU)" labelPlacement="end"/>
                        <FormControlLabel value="description" control={<Radio />} label="Description" labelPlacement="end"/>
                        <FormControlLabel value="collection" control={<Radio />} label="Collection" labelPlacement="end" />
                        <FormControlLabel value="specimen" control={<Radio />} label="Specimen" labelPlacement="end" />
                        <FormControlLabel value="image" control={<Radio />} label="Image" labelPlacement="end" />

                        <Divider />

                        <FormControlLabel value="person" control={<Radio />} label="Person" labelPlacement="end" />
                        <FormControlLabel value="reference" control={<Radio />} label="Reference" labelPlacement="end" />
                        <FormControlLabel value="group" control={<Radio />} label="Group" labelPlacement="end" />

                        <Divider />

                        <FormControlLabel value="schema" control={<Radio />} label="Schema" labelPlacement="end" />
                        <FormControlLabel value="character" control={<Radio />} label="Character" labelPlacement="end" />
                        <FormControlLabel value="state" control={<Radio />} label="State" labelPlacement="end" />

                        <Divider />
                        
                        <FormControlLabel value="synonym" control={<Radio />} label="Synonym" labelPlacement="end"/>
                        <FormControlLabel value="comment" control={<Radio />} label="Comment" labelPlacement="end"/>
                    </RadioGroup>
                </FormControl>
        );    
    }

    const [mode, setMode] = React.useState('create');
    
    const [showRegistration, setShowRegistration] = useState(false);
    
    //const [token, setToken] = useState(localStorage.getItem('PBOTMutationToken'));
    const [token, setToken] = useAuth();
    
    const handleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setShowResult(false);
            setMode(newMode);
        }
    }

    if(!token) {
        return (<p>Workbench access requires authentication</p>)
    }
    
    return (
        <div>
            <Grid container spacing={3} style={{marginLeft:"10px"}}>
                <Grid item >
                    <FormSelector form={selectedForm} reset={forceUpdate} />
                </Grid>
            
                <Grid item alignItems="right" xs>
                    {selectedForm && 
                        <ToggleButtonGroup sx={{marginTop: "5px", marginBottom:"10px"}} 
                            value={mode}
                            onChange={handleModeChange}
                            exclusive
                            aria-label="mutation type"
                            orientation="horizontal"
                            size="small"
                        >
                            <ToggleButton value="create" aria-label="create">
                                <Tooltip title="Create">
                                    <AddIcon />
                                </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="edit" aria-label="edit" >
                                <Tooltip title="Edit">
                                    <EditIcon />
                                </Tooltip>
                            </ToggleButton>
                            <ToggleButton value="delete" aria-label="delete" >
                                <Tooltip title="Delete">
                                    <RemoveIcon />
                                </Tooltip>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    }

                    {selectedForm === "otu" &&
                        <OTUMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "synonym" &&
                        <SynonymMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "comment" &&
                        <CommentMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "description" &&
                        <DescriptionMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "specimen" &&
                        <SpecimenMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "collection" &&
                        <CollectionMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "reference" &&
                        <ReferenceMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "schema" &&
                        <SchemaMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }
                    
                    {selectedForm === "character" &&
                        <CharacterMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }
                    
                    {selectedForm === "state" &&
                        <StateMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "group" &&
                        <GroupMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }
                    
                   {selectedForm === "person" &&
                        <PersonMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "image" &&
                        <ImageMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                </Grid>
            </Grid>
        </div>
  );
};

export default Mutate;
