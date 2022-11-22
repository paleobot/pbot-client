import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Query from './Query';
import Mutate from './Mutate';
import { useOutletContext } from "react-router-dom";

const Action = ({selectedForm}/*{queryParams, handleSubmit, formClass, handleFormClass, selectedForm, handleFormChange, showResult, setShowResult}*/) => {

    const [handleSubmit, formClass, handleFormChange, setShowResult] = useOutletContext();

    return (
        <div>
            <div hidden={formClass !== "query"}>
                <Query handleSubmit={handleSubmit} selectedForm={selectedForm} handleFormChange={handleFormChange} setShowResult={setShowResult}/>
            </div>
                
            <div hidden={formClass !== "mutate"}>
                <Mutate handleSubmit={handleSubmit} selectedForm={selectedForm} handleFormChange={handleFormChange} setShowResult={setShowResult}/>
            </div>
        </div>
    );
}

export default Action;
