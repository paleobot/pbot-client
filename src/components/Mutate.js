import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid, Button } from '@material-ui/core';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import DescriptionQueryForm from './Description/DescriptionQueryForm';
import SpecimenQueryForm from './Specimen/SpecimenQueryForm';
import SchemaQueryForm from './Schema/SchemaQueryForm';
import DescriptionMutateForm from './Description/DescriptionMutateForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Mutate = ({queryParams, handleQueryParamChange, selectedForm, handleFormChange, showResult, setShowResult}) => {
    /*
    const [selectedForm, setSelectedForm] = useState('OTU');

    const handleChange = (event) => {
        handleFormChange(event);
       //console.log(selectedForm);
    };
    */
    
    const [showRegistration, setShowRegistration] = useState(false);
    
    const [token, setToken] = useState(localStorage.getItem('PBOTMutationToken'));

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
                        <FormControlLabel value="Specimen-mutate" control={<Radio />} label="Specimen" labelPlacement="end" disabled />
                        <FormControlLabel value="Schema-mutate" control={<Radio />} label="Schema" labelPlacement="end" disabled />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                
                <Grid item>
                    <div hidden={selectedForm !== "Description-mutate"}>
                        <DescriptionMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                    </div>
                        
                    <div hidden={selectedForm !== "Specimen-mutate"}>
                        <SpecimenQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                    </div>

                    <div hidden={selectedForm !== "Schema-mutate"}>
                        <SchemaQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                    </div>
                    
                </Grid>
            </Grid>
        </div>
  );
};

export default Mutate;
