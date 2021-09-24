import React, { useState }from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import Query from './Query';
import Mutate from './Mutate';
import Result from './Result';
import Action from './Action';

const QueryInterface = ({setRotatePBOT}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [selectedForm, setSelectedForm] = useState(0);
    const [showResult, setShowResult] = useState(false);
    
    const handleFormChange = (event) => {
        console.log(event.target.value);
        setShowResult(false);
        setSelectedForm(event.target.value);
        console.log("selected form: ");
        console.log(selectedForm);
    };

    const handleTabChange = (event, newTab) => {
        if (newTab === 0) {
            setRotatePBOT(true);
        } else if (newTab === 1) {
            setRotatePBOT(false);
        }
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
    /*
    return (
        <div style={style}>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Query"  />
                    <Tab label="Results"  />
                </Tabs>
            </AppBar>
            
            <div hidden={selectedTab !== 0}>
                <Query queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
            </div>

            <div hidden={selectedTab !== 1}>
                {result}
            </div>
        </div>
    );
    */
    return (
        <div style={style}>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Action"  />
                    <Tab label="Results"  />
                </Tabs>
            </AppBar>
            
            <div hidden={selectedTab !== 0}>
                <Action queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
            </div>

            <div hidden={selectedTab !== 1}>
                {result}
            </div>
        </div>
    );



    /*
    return (
        <div style={style}>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Query"  />
                    <Tab label="Mutate" />
                    <Tab label="Results"  />
                </Tabs>
            </AppBar>
            <div hidden={selectedTab !== 0}>
                <Query queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
            </div>

            <div hidden={selectedTab !== 1}>
                <Mutate queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
            </div>

            <div hidden={selectedTab !== 2}>
                {result}
            </div>
        </div>
    );
    */
};

export default QueryInterface;
