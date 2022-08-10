import React, { useState }from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';
import Result from './Result';
import Action from './Action';
import {publicGroupID, GroupSelect} from './Group/GroupSelect.js';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';

import {ApolloProvider} from "@apollo/client";
import {client} from '../ApolloClientSetup.js';

const PBOTInterface = ({setRotatePBOT}) => {
    
    /*
    //This path business is to handle direct urls to nodes 
    //(e.g. http://localhost:3000/Specimen/7599aa01-c919-4628-a5a8-b513d7a080c1)
    //This code, and related in Result.js, is proof on concept. Will need to 
    //use react-router to make it tight.
    const pathPieces = window.location.pathname.split('/');
    const [selectedTab, setSelectedTab] = useState(pathPieces[1] ? 1 : 0);
    const [queryParams, setQueryParams] = useState(0);
    const [selectedForm, setSelectedForm] = useState(pathPieces[1] ? pathPieces[1] : 0);
    const [showResult, setShowResult] = useState(pathPieces[1]);
    */
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [selectedForm, setSelectedForm] = useState(0);
    const [showResult, setShowResult] = useState(false); 
    
    const setSelectedTabDeco = (newTab) => {
        if (newTab === 0) {
            setRotatePBOT(true);
            //TODO: This hack is for the path business. Need to clean up path when user navigates.
            //This will go away when we use react.router.
            //if ('/' !== window.location.pathname) { 
            //    window.location.pathname = '/';
            //}
        } else if (newTab === 1) {
            setRotatePBOT(false);
        }
        setSelectedTab(newTab);
    };
    
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
        setSelectedTabDeco(newTab);
    };

    const handleQueryParamChange = (values) => {
        console.log("handleQueryParamChange");
        console.log(values);
        setQueryParams(values);
        setSelectedTabDeco(1);
    };
        
    let result = showResult ? (
                    <Result queryParams={queryParams} queryEntity={selectedForm}/>
                 ) :
                 '';
  
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
        <ApolloProvider client={client}>
        <div style={style}>
            <AppBar position="static">
                <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" textColor="inherit" indicatorColor="secondary">
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
        </ApolloProvider>

    );
};

export default PBOTInterface;
