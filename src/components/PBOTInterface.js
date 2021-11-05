import React, { useState }from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import Result from './Result';
import Action from './Action';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

const PBOTInterface = ({setRotatePBOT}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [selectedForm, setSelectedForm] = useState(0);
    const [showResult, setShowResult] = useState(false);
    
    const setSelectedTabDeco = (newTab) => {
        if (newTab === 0) {
            setRotatePBOT(true);
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
        </ApolloProvider>

    );
};

export default PBOTInterface;
