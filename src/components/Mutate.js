import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid, Button, Divider, Typography} from '@mui/material';
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
                    <FormControlLabel value="otu" control={<Radio />} label="OTU" labelPlacement="end"/>
                    <FormControlLabel value="synonym" control={<Radio />} label="Synonym" labelPlacement="end"/>
                    <FormControlLabel value="comment" control={<Radio />} label="Comment" labelPlacement="end"/>
                    <FormControlLabel value="description" control={<Radio />} label="Description" labelPlacement="end"/>
                    <FormControlLabel value="characterinstance" control={<Radio />} label="Character Instance" labelPlacement="end"/>
                    <FormControlLabel value="specimen" control={<Radio />} label="Specimen" labelPlacement="end" />
                    <FormControlLabel value="collection" control={<Radio />} label="Collection" labelPlacement="end" />
                    <Divider />
                    <FormControlLabel value="reference" control={<Radio />} label="Reference" labelPlacement="end" />
                    <FormControlLabel value="schema" control={<Radio />} label="Schema" labelPlacement="end" />
                    <FormControlLabel value="character" control={<Radio />} label="Character" labelPlacement="end" />
                    <FormControlLabel value="state" control={<Radio />} label="State" labelPlacement="end" />
                    <Divider />
                    <FormControlLabel value="group" control={<Radio />} label="Group" labelPlacement="end" />
                    <FormControlLabel value="person" control={<Radio />} label="Person" labelPlacement="end" />
                    <Divider />
                    <FormControlLabel value="image" control={<Radio />} label="Image" labelPlacement="end" />
                    </RadioGroup>
                </FormControl>
        );    
    }

    const [mode, setMode] = React.useState('create');
    
    const [showRegistration, setShowRegistration] = useState(false);
    
    //const [token, setToken] = useState(localStorage.getItem('PBOTMutationToken'));
    const [token, setToken] = useAuth();
    
    const handleModeChange = (event, newMode) => {
        setShowResult(false);
        setMode(newMode);
    }

    if(!token) {
        return (<p>Workbench access requires authentication</p>)
    }
    
    return (
        <div>
                <Grid container justifyContent="flex-end">
                    <ToggleButtonGroup sx={{marginTop: "5px"}} 
                        value={mode}
                        onChange={handleModeChange}
                        exclusive
                        aria-label="mutation type"
                        orientation="horizontal"
                        size="small"
                    >
                        <ToggleButton value="create" aria-label="create">
                            <AddIcon />
                        </ToggleButton>
                        <ToggleButton value="edit" aria-label="edit" >
                            <EditIcon />
                        </ToggleButton>
                        <ToggleButton value="delete" aria-label="delete" >
                            <RemoveIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>

            <Grid container spacing={3} style={{marginLeft:"10px"}}>
                <Grid item >
                    <FormSelector form={selectedForm} reset={forceUpdate} />
                </Grid>
            
                <Grid item alignItems="right" xs>
                    {selectedForm && <Typography variant="h5">Mutation parameters</Typography>}

                    {selectedForm === "otu" &&
                        <OTUMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "synonym" &&
                        <SynonymMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "comment" &&
                        <CommentMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "description" &&
                        <DescriptionMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "characterinstance" &&
                        <CharacterInstanceMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }
                    
                    {selectedForm === "specimen" &&
                        <SpecimenMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "collection" &&
                        <CollectionMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "reference" &&
                        <ReferenceMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "schema" &&
                        <SchemaMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }
                    
                    {selectedForm === "character" &&
                        <CharacterMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }
                    
                    {selectedForm === "state" &&
                        <StateMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "group" &&
                        <GroupMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }
                    
                   {selectedForm === "person" &&
                        <PersonMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                    {selectedForm === "image" &&
                        <ImageMutateForm handleSubmit={handleSubmit} setShowResult={setShowResult} mode={mode}/>
                    }

                </Grid>
            </Grid>
        </div>
  );
};

export default Mutate;
