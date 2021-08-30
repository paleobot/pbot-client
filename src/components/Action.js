import React, { useState }from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid } from '@material-ui/core';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import OTUQueryForm from './OTUQueryForm';
import SpecimenQueryForm from './SpecimenQueryForm';
import SchemaQueryForm from './SchemaQueryForm';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Query from './Query';
import Mutate from './Mutate';

const Action = ({queryParams, handleQueryParamChange, selectedForm, handleFormChange, showResult, setShowResult}) => {
    /*
    const [selectedForm, setSelectedForm] = useState('OTU');

    const handleChange = (event) => {
        handleFormChange(event);
       //console.log(selectedForm);
    };
    */
    const [formClass, setFormClass] = React.useState('query');

    const handleFormClass = (event, newFormClass) => {
        setFormClass(newFormClass);
    };

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
                    Mutate
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
