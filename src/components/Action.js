import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Query from './Query';
import Mutate from './Mutate';
import { useOutletContext, useLocation } from "react-router-dom";

const Action = ({selectedForm}/*{queryParams, handleSubmit, formClass, handleFormClass, selectedForm, handleFormChange, showResult, setShowResult}*/) => {

    const [handleSubmit, formClass, handleFormChange, setShowResult, setSelectedTab] = useOutletContext();

    //Always go to Action tab if there is no form selected. I had thought to do this in PBOTInterface.js,
    //but doing so caused a render loop. So, I pass setSelectedTab through the context and do it here.
    const location = useLocation();
    let form = location.pathname.split("/")[2];
    if (!form) {
        setSelectedTab(0);
        setShowResult(false)
    }

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
