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

const PBOTInterface = ({props, setRotatePBOT}) => {
    console.log("----------PBOTInterface--------------");
    console.log(props);
    const navigate = useNavigate();
    
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [showResult, setShowResult] = useState(false); 
    
    const setSelectedTabDeco = (newTab) => {
        if (newTab === 0) {
            setRotatePBOT(true);
        } else if (newTab === 1) {
            setRotatePBOT(false);
        }
        setSelectedTab(newTab);
    };

    const handleFormClass = (event, newFormClass) => {
        navigate(`/${newFormClass}`);
    };

   const handleFormChange = (event) => {
        console.log(event.target.value);
        setShowResult(false);
        navigate(`/${props.formClass}/${event.target.value.replace("-mutate", "").toLowerCase()}`);
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
                    <Result queryParams={queryParams} queryEntity={props.form}/>
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
        
            <Action queryParams={queryParams} handleQueryParamChange={handleQueryParamChange} formClass={props.formClass} handleFormClass={handleFormClass} selectedForm={props.form} handleFormChange={handleFormChange} showResult={showResult} setShowResult={setShowResult}/>
            {result}
        </div>
        </ApolloProvider>

    );
};

export default PBOTInterface;
