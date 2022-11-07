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
    useLocation
} from "react-router-dom";
import { Outlet } from "react-router-dom";

const PBOTInterface = (props) => {
    console.log("----------PBOTInterface--------------");
    console.log(props);
    const navigate = useNavigate();
    
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [showResult, setShowResult] = useState(false); 
    
    const setSelectedTabDeco = (newTab) => {
        if (newTab === 0) {
            //setRotatePBOT(true);
        } else if (newTab === 1) {
            //setRotatePBOT(false);
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
            //setRotatePBOT(true);
        } else if (newTab === 1) {
            //setRotatePBOT(false);
        }
        setSelectedTabDeco(newTab);
    };

    const handleQueryParamChange = (values) => {
        console.log("handleQueryParamChange");
        console.log(values);
        setQueryParams(values);
        setSelectedTabDeco(1);
    };
        
    //Figure out what we're doing from the path, massage it, and send to Result as queryEntity
    const location = useLocation();
    let form = location.pathname.split("/")[2];
    form = form ? 
        form === "otu" ? 
            form.toUpperCase() : 
            form.charAt(0).toUpperCase() + form.slice(1) :
        form;
    form = "mutate" === location.pathname.split("/")[1] ?
        form + "-mutate" :
        form;
    let result = showResult ? (
                    <Result queryParams={queryParams} queryEntity={form}/>
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
        
            <Outlet context={[queryParams, handleQueryParamChange, props.formClass, handleFormClass, handleFormChange, showResult, setShowResult]} />
            {result}
        </div>
        </ApolloProvider>

    );
};

export default PBOTInterface;
