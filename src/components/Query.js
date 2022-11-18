import React, { useState } from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid, Divider, Typography } from '@mui/material';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import OTUQueryForm from './OTU/OTUQueryForm';
import SpecimenQueryForm from './Specimen/SpecimenQueryForm';
import ReferenceQueryForm from './Reference/ReferenceQueryForm';
import SchemaQueryForm from './Schema/SchemaQueryForm';
import PersonQueryForm from './Person/PersonQueryForm';

const Query = ({queryParams, handleQueryParamChange, selectedForm, handleFormChange, showResult, setShowResult}) => {

    //This annoying bit of razzle-dazzle is to force MUI RadioGroup to reset when the path is just "/query".
    //Without this, if we had selected a form then navigated somewhere else then navigated back via an
    //Explore button, the radio button was still set. I could find no graceful way to fix this, so...
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const FormSelector = (form, reset) => {
        if (!form) {
            reset();
        };
        return (
            <FormControl component="fieldset">
                <RadioGroup aria-label="form" name="form1" value={selectedForm} onChange={handleFormChange}>
                <FormControlLabel value="OTU" control={<Radio />} label="OTU" labelPlacement="end"/>
                <FormControlLabel value="Specimen" control={<Radio />} label="Specimen" labelPlacement="end"/>
                <Divider />
                <FormControlLabel value="Reference" control={<Radio />} label="Reference" labelPlacement="end"/>
                <FormControlLabel value="Schema" control={<Radio />} label="Schema" labelPlacement="end" />
                <Divider />
                <FormControlLabel value="Person" control={<Radio />} label="Person" labelPlacement="end"/>
                </RadioGroup>
            </FormControl>  
        );    
    }
    
    return (
        <Grid container spacing={3} style={{marginLeft:"10px", marginTop: "5px"}}>
            <Grid item>
                <FormSelector form={selectedForm} reset={forceUpdate} />
            </Grid>
            
            <Grid item xs>
                {selectedForm && <Typography variant="h5">Search parameters</Typography>}
                <div hidden={selectedForm !== "OTU"}>
                    <OTUQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>
                    
                <div hidden={selectedForm !== "Specimen"}>
                    <SpecimenQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>

                <div hidden={selectedForm !== "Reference"}>
                    <ReferenceQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>

                <div hidden={selectedForm !== "Schema"}>
                    <SchemaQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>

                <div hidden={selectedForm !== "Person"}>
                    <PersonQueryForm queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} showResult={showResult} setShowResult={setShowResult}/>
                </div>
                
            </Grid>
        </Grid>
  );
};

export default Query;
