import React, { useState }from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import Query from './Query';
import Result from './Result';

const QueryInterface = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [selectedForm, setSelectedForm] = useState('OTU');
    const [showResult, setShowResult] = useState(false);

    const handleFormChange = (event) => {
        setSelectedForm(event.target.value);
       //console.log(selectedForm);
    };

    const handleTabChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    const handleQueryParamChange = (values) => {
        console.log(values);
        setQueryParams(values);
        setSelectedTab(1);
    };
    
    let result = showResult ? (
                <Result queryParams={queryParams} queryEntity={selectedForm}/>
             ) :
             '';

    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
        <div style={style}>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Query"  />
                    <Tab label="Results"  />
                </Tabs>
            </AppBar>
            <div hidden={selectedTab === 1}>
                <Query queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
            </div>
            
            <div hidden={selectedTab === 0}>
                {result}
            </div>
        </div>
    );
};

export default QueryInterface;
