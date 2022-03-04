import React, { useState }from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import Result from './Result';
import Action from './Action';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
  useMutation,
  gql,
  useApolloClient
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('PBOTMutationToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});
//TODO: Look into loading the ApolloProvider client on the fly using something like the 
//method described in https://github.com/apollographql/apollo-client/issues/2897.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
