import React, { useState } from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid, Divider } from '@mui/material';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import OTUQueryForm from './OTU/OTUQueryForm';
import SpecimenQueryForm from './Specimen/SpecimenQueryForm';
import ReferenceQueryForm from './Reference/ReferenceQueryForm';
import SchemaQueryForm from './Schema/SchemaQueryForm';
import PersonQueryForm from './Person/PersonQueryForm';
import { useAuth } from './AuthContext';

const Query = ({queryParams, handleQueryParamChange, selectedForm, handleFormChange, showResult, setShowResult}) => {
    
    return (
        <Grid container spacing={3}>
            <Grid item>
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
            </Grid>
            
            <Grid item>
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
