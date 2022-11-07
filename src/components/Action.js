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
            <ToggleButtonGroup
                value={formClass}
                exclusive
                onChange={handleFormClass}
                aria-label="form class"
            >
                <ToggleButton value="query" aria-label="query">
                    Query
                </ToggleButton>
                <ToggleButton value="mutate" aria-label="mutate">
                    Workbench
                </ToggleButton>
            </ToggleButtonGroup>
            <Grid container spacing={3}>
                <Grid item>
                    <div hidden={formClass !== "query"}>
                        <Query queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
                    </div>
                        
                    <div hidden={formClass !== "mutate"}>
                        <Mutate queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Action;
