import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@material-ui/core';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import OTUQueryForm from './OTUQueryForm';
import SpecimenQueryForm from './SpecimenQueryForm';
import SchemaQueryForm from './SchemaQueryForm';
import OTUMutateForm from './OTUMutateForm';

const Mutate = ({queryParams, handleQueryParamChange, selectedForm, handleFormChange, showResult, setShowResult}) => {
    /*
    const [selectedForm, setSelectedForm] = useState('OTU');

    const handleChange = (event) => {
        handleFormChange(event);
       //console.log(selectedForm);
    };
    */
    
    return (
        <Grid container spacing={3}>
            <Grid item>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="form" name="form1" value={selectedForm} onChange={handleFormChange}>
                    <FormControlLabel value="OTU-mutate" control={<Radio />} label="OTU" labelPlacement="end"/>
                    <FormControlLabel value="Specimen-mutate" control={<Radio />} label="Specimen" labelPlacement="end" disabled />
                    <FormControlLabel value="Schema-mutate" control={<Radio />} label="Schema" labelPlacement="end" disabled />
                    </RadioGroup>
                </FormControl>
            </Grid>
            
            <Grid item>
                <div hidden={selectedForm !== "OTU-mutate"}>
                    <OTUMutateForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>
                    
                <div hidden={selectedForm !== "Specimen-mutate"}>
                    <SpecimenQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>

                <div hidden={selectedForm !== "Schema-mutate"}>
                    <SchemaQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>
                
            </Grid>
        </Grid>
  );
};

export default Mutate;
