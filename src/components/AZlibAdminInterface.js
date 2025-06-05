import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import Result from './Result';

import {
    Outlet,
    useLocation,
    useNavigate
} from "react-router-dom";

const AZlibAdminInterface = (props) => {
    console.log("----------AZlibAdminInterface--------------");
    console.log(props);
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState(0);
    const [queryParams, setQueryParams] = useState(0);
    const [showResult, setShowResult] = useState(false); 
    
    //User has used Back button. Reset everything.
    window.onpopstate = () => { console.log("onpopstate"); console.log(window.location);setShowResult(false); setQueryParams(null); setSelectedTab(0);};
    

    const handleFormClass = (event, newFormClass) => {
        setShowResult(false);
         navigate(`/${newFormClass}`);
    };

   const handleFormChange = (event) => {
        console.log(event.target.value);
        setShowResult(false);
        navigate(`/${props.formClass}/${event.target.value.replace("-mutate", "").toLowerCase()}`);
        //navigate(`/${event.target.value.replace("-mutate", "").toLowerCase()}`);
    };

    const handleTabChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    const handleSubmit = (values) => {
        console.log("handleSubmit");
        console.log(JSON.parse(JSON.stringify(values)));
        //TODO: Must set showResult to false here to trigger rerender of Result. I used to do this in
        //the validate routine of formik whenever a form field changed, but this caused a strange bug
        //wherein the top select box would not take the first selection after a submit. No idea what 
        //the connection was, but removing that setShowResult from the validate routine fixed it.
        //Unfortunately, it also meant we never set it to false so setting it to true below did not
        //trigger a re-render. Toggling it here is lame, but it works for now.
        setShowResult(false); 
        setQueryParams(values);
        setShowResult(true);
        setSelectedTab(1);

        //push another frame on history in case user uses Back button to get back to Actions tab
        navigate(`${window.location.pathname}`); 
    };
        
    //Figure out what we're doing from the path, massage it, and send to Result as queryEntity
    const location = useLocation();
    let form = location.pathname.split("/")[2];
    let result = showResult ? (
                    <Result queryParams={queryParams} type={props.formClass} queryEntity={form}/>
                 ) :
                 'Loading...';
  
    const style = {textAlign: "left"}
    //Note: The use of hidden for display of result is critical for avoiding repeat executions of that code.
    return (
        <div style={style}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
                <Tab label="Action"  />
                <Tab label="Results"  disabled={!showResult}/>
            </Tabs>
            </Box>

            <div style={{margin: "10px"}}>
                <div hidden={selectedTab !== 0}>
                    <Outlet context={[handleSubmit, props.formClass, handleFormChange, setShowResult, setSelectedTab]} />
                </div>
                <div hidden={selectedTab !== 1}>
                    {result}
                </div>
            </div>
        </div>

    );
};

export default AZlibAdminInterface;
