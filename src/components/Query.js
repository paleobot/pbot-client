import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@material-ui/core';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import OTUQueryForm from './OTUQueryForm';
import SpecimenQueryForm from './SpecimenQueryForm';
import SchemaQueryForm from './SchemaQueryForm';

const Query = ({queryParams, handleQueryParamChange, selectedForm, handleFormChange, showResult, setShowResult}) => {
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
                    <FormControlLabel value="OTU" control={<Radio />} label="OTU" labelPlacement="end"/>
                    <FormControlLabel value="Specimen" control={<Radio />} label="Specimen" labelPlacement="end"/>
                    <FormControlLabel value="Schema" control={<Radio />} label="Schema" labelPlacement="end" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            
            <Grid item>
                <div hidden={selectedForm !== "OTU"}>
                    <OTUQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>
                    
                <div hidden={selectedForm !== "Specimen"}>
                    <SpecimenQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>

                <div hidden={selectedForm !== "Schema"}>
                    <SchemaQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>
                
            </Grid>
        </Grid>
  );
};

export default Query;
