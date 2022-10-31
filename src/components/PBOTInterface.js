import React, { useState }from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';
import Result from './Result';
import Action from './Action';
import {publicGroupID, GroupSelect} from './Group/GroupSelect.js';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';

import {ApolloProvider} from "@apollo/client";
import {client} from '../ApolloClientSetup.js';
import {
    useNavigate,
} from "react-router-dom";

const PBOTInterface = ({setRotatePBOT}) => {
    const navigate = useNavigate();

    //TODO: The way we are using react-router is dumb. I know that. Working on it. For now, we need to use the path here to set the form states
    const pathParts = window.location.pathname.split("/");
    
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [selectedForm, setSelectedForm] = useState(pathParts[2] || 0);
    const [showResult, setShowResult] = useState(false); 
    const [formClass, setFormClass] = React.useState(pathParts[1] || 'query');
   
    const setSelectedTabDeco = (newTab) => {
        if (newTab === 0) {
            setRotatePBOT(true);
        } else if (newTab === 1) {
            setRotatePBOT(false);
        }
        setSelectedTab(newTab);
    };
 
    const handleFormClass = (event, newFormClass) => {
        setFormClass(newFormClass);
        navigate(`/${newFormClass}`);
    };

   const handleFormChange = (event) => {
        console.log(event.target.value);
        setShowResult(false);
        setSelectedForm(event.target.value);
        navigate(`/${formClass}/${event.target.value}`);
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
            
                <Action queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} formClass={formClass} handleFormClass={handleFormClass} selectedForm={selectedForm} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
                {result}
        </div>
        </ApolloProvider>

    );
};

export default PBOTInterface;
