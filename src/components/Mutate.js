import { Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Tooltip } from '@mui/material';
import React, { useContext, useState } from 'react';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import RemoveIcon from '@mui/icons-material/Remove';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import CollectionMutateForm from './Collection/CollectionMutateForm';
import UserMutateForm from './User/UserMutateForm';

import { useAuth } from './AuthContext';
import CollectionGroupMutateForm from './CollectionGroup/CollectionGroupMutateForm';
import { GlobalContext } from './GlobalContext';

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
                        <FormControlLabel value="collection" control={<Radio />} label="Collection" labelPlacement="end" />

                        <Divider />

                        {user && user.role_id === global.superuserID && 
                        <>
                            <FormControlLabel value="collectionGroup" control={<Radio />} label="Collection group" labelPlacement="end" />
                            <FormControlLabel value="user" control={<Radio />} label="User" labelPlacement="end" />
                        </>
                        }
                    </RadioGroup>
                </FormControl>
        );    
    }

    const [mode, setMode] = React.useState('create');
    
    const [showRegistration, setShowRegistration] = useState(false);
    
    const global = useContext(GlobalContext);
    const {token, user} = useAuth();
     
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
                <Grid item size={2}>
                    <FormSelector form={selectedForm} reset={forceUpdate} />
                </Grid>
            
                <Grid item alignItems="right" size={6}>
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
                            {(selectedForm !== "collectionGroup" && selectedForm !== "user") &&
                                <ToggleButton value="replace" aria-label="replace" >
                                    <Tooltip title="Replace">
                                        <LibraryAddIcon />
                                    </Tooltip>
                                </ToggleButton>
                            }
                            {selectedForm !== "collectionGroup" &&
                                <ToggleButton value="delete" aria-label="delete" disabled={selectedForm === "person"}>
                                    <Tooltip title="Delete">
                                        <RemoveIcon />
                                    </Tooltip>
                                </ToggleButton>
                            }   
                        </ToggleButtonGroup>
                    }


                    {selectedForm === "collection" &&
                        <CollectionMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                    {selectedForm === "collectionGroup" &&
                        <CollectionGroupMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }

                   {selectedForm === "user" &&
                        <UserMutateForm handleSubmit={handleSubmit} mode={mode}/>
                    }


                </Grid>
            </Grid>
        </div>
  );
};

export default Mutate;
