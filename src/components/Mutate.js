import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid, Button, Divider } from '@material-ui/core';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import DescriptionQueryForm from './Description/DescriptionQueryForm';
import SpecimenQueryForm from './Specimen/SpecimenQueryForm';
import SchemaQueryForm from './Schema/SchemaQueryForm';
import DescriptionMutateForm from './Description/DescriptionMutateForm';
import CharacterInstanceMutateForm from './CharacterInstance/CharacterInstanceMutateForm';
import SpecimenMutateForm from './Specimen/SpecimenMutateForm';
import ReferenceMutateForm from './Reference/ReferenceMutateForm';
import SchemaMutateForm from './Schema/SchemaMutateForm';
import CharacterMutateForm from './Character/CharacterMutateForm';
import StateMutateForm from './State/StateMutateForm';
import PersonMutateForm from './Person/PersonMutateForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { ToggleButtonGroup } from '@material-ui/lab';
import { ToggleButton } from '@material-ui/lab';

const Mutate = ({queryParams, handleQueryParamChange, selectedForm, handleFormChange, showResult, setShowResult}) => {
    /*
    const [selectedForm, setSelectedForm] = useState('OTU');

    const handleChange = (event) => {
        handleFormChange(event);
       //console.log(selectedForm);
    };
    */
    const [mode, setMode] = React.useState('create');
    
    const [showRegistration, setShowRegistration] = useState(false);
    
    const [token, setToken] = useState(localStorage.getItem('PBOTMutationToken'));
    
    const handleModeChange = (event, newMode) => {
        setMode(newMode);
    }

    const handleLogout = () => {
        localStorage.removeItem('PBOTMutationToken');
        setToken(localStorage.getItem('PBOTMutationToken'));
    }

    if(!token) {
        if (!showRegistration) {
            return <LoginForm setToken={setToken} setShowRegistration={setShowRegistration} />
        } else {
            return <RegisterForm setShowRegistration={setShowRegistration}/>
        }
    }
    
    return (
        <div>
            <Button variant="text" color="secondary" onClick={() => {handleLogout();}}>Logout</Button>
            <Grid container spacing={3}>
                <Grid item>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="form" name="form1" value={selectedForm} onChange={handleFormChange}>
                        <FormControlLabel value="Description-mutate" control={<Radio />} label="Description" labelPlacement="end"/>
                        <FormControlLabel value="CharacterInstance-mutate" control={<Radio />} label="Character Instance" labelPlacement="end"/>
                        <FormControlLabel value="Specimen-mutate" control={<Radio />} label="Specimen" labelPlacement="end" />
                        <Divider />
                        <FormControlLabel value="Reference-mutate" control={<Radio />} label="Reference" labelPlacement="end" />
                        <FormControlLabel value="Schema-mutate" control={<Radio />} label="Schema" labelPlacement="end" />
                        <FormControlLabel value="Character-mutate" control={<Radio />} label="Character" labelPlacement="end" />
                        <FormControlLabel value="State-mutate" control={<Radio />} label="State" labelPlacement="end" />
                        <Divider />
                        <FormControlLabel value="Person-mutate" control={<Radio />} label="Person" labelPlacement="end" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                
                <Grid item>
                    <ToggleButtonGroup
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
                
                    <div hidden={selectedForm !== "Description-mutate"}>
                        <DescriptionMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult} mode={mode}/>
                    </div>

                    <div hidden={selectedForm !== "CharacterInstance-mutate"}>
                        <CharacterInstanceMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult} mode={mode}/>
                    </div>
                    
                    <div hidden={selectedForm !== "Specimen-mutate"}>
                        <SpecimenMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult} mode={mode}/>
                    </div>

                    <div hidden={selectedForm !== "Reference-mutate"}>
                        <ReferenceMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult} mode={mode}/>
                    </div>

                    <div hidden={selectedForm !== "Schema-mutate"}>
                        <SchemaMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult} mode={mode}/>
                    </div>
                    
                    <div hidden={selectedForm !== "Character-mutate"}>
                        <CharacterMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult} mode={mode}/>
                    </div>
                    
                    <div hidden={selectedForm !== "State-mutate"}>
                        <StateMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult} mode={mode}/>
                    </div>

                    <div hidden={selectedForm !== "Person-mutate"}>
                        <PersonMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult} mode={mode}/>
                    </div>
                    
                </Grid>
            </Grid>
        </div>
  );
};

export default Mutate;
