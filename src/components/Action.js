import React, { useEffect } from 'react';
import { useLocation, useOutletContext } from "react-router-dom";
import Mutate from './Mutate';
import Query from './Query';

const Action = ({selectedForm}/*{queryParams, handleSubmit, formClass, handleFormClass, selectedForm, handleFormChange, showResult, setShowResult}*/) => {

    const [handleSubmit, formClass, handleFormChange, setShowResult, setSelectedTab] = useOutletContext();

    //Always go to Action tab if there is no form selected. I had thought to do this in PBOTInterface.js,
    //but doing so caused a render loop. So, I pass setSelectedTab through the context and do it here.
    const location = useLocation();
    let form = location.pathname.split("/")[2];
    //Using useEffect prevents "Cannot update a component while rendering a different component"
    useEffect(() => {
        if (!form) {
            setSelectedTab(0);
            setShowResult(false)
        }
    });

    return (
        <div>
            <div hidden={formClass !== "query"}>
                <Query handleSubmit={handleSubmit} selectedForm={selectedForm} handleFormChange={handleFormChange} setShowResult={setShowResult}/>
            </div>
                
            <div hidden={formClass !== "mutate"}>
                <Mutate handleSubmit={handleSubmit} selectedForm={selectedForm} handleFormChange={handleFormChange} setShowResult={setShowResult}/>
            </div>
        </div>
    );
}

export default Action;
