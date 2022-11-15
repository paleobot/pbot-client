import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Query from './Query';
import Mutate from './Mutate';
import { useOutletContext } from "react-router-dom";

const Action = ({selectedForm}/*{queryParams, handleQueryParamChange, formClass, handleFormClass, selectedForm, handleFormChange, showResult, setShowResult}*/) => {

    const [queryParams, handleQueryParamChange, formClass, handleFormClass, handleFormChange, showResult, setShowResult] = useOutletContext();

    return (
        <div>
            <div hidden={formClass !== "query"}>
                <Query queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
            </div>
                
            <div hidden={formClass !== "mutate"}>
                <Mutate queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
            </div>
        </div>
    );
}

export default Action;
