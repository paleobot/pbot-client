import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Mutator = (props) => {
    console.log("Mutator");
    console.log(props);
    
    const entityID="pbotID";

    let [loading, setLoading] = useState(false)
    let [data, setData] = useState(null)
    let [error, setError] = useState(null)

    //const url = "http://localhost:3000/api/v1/";
    //const url = new URL(`${props.entity}${props.id ? `/${props.id}` : ''}`, process.env.REACT_APP_AZLIB_API_URL)

    //TODO: Get this properly
    //This is for localhost
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOnsidXNlcl9pZCI6NSwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJyb2xlX2lkIjoxLCJmaXJzdF9uYW1lIjoiUGFzcyIsImxhc3RfbmFtZSI6IldvcmQiLCJvcmdhbml6YXRpb24iOiJub25lIiwidG9zX2FjY2VwdGVkIjp0cnVlLCJhcHByb3ZlZCI6dHJ1ZSwiY3JlYXRlZF9kYXRlIjoiMjAyMC0wMi0xNFQyMzo0NjoxMi40NjJaIiwibW9kaWZpZWRfZGF0ZSI6bnVsbCwicHdfcmVzZXRfdG9rZW4iOm51bGwsInB3X3Jlc2V0X3RpbWUiOm51bGx9LCJleHAiOjE2OTkzOTY1NTY0OTZ9.m0SljTDFdW_8fpM2dgdQAEz23h4oOlRrFoyDP1x-6as" 

    useEffect(() => {

        async function fetchData () {
            try {
                let response
                if (props.mode === "replace") {
                    console.log("PUTing");
                    response = await fetch(
                        `${process.env.REACT_APP_AZLIB_API_URL}/api/v1/${props.entity}/${props.id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Accept': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                            body: props.formData,
                        }
                    );                
                } else if (props.mode === "edit") {
                    console.log("PATCHing");
                    response = await fetch(
                        `${process.env.REACT_APP_AZLIB_API_URL}/api/v1/${props.entity}/${props.id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Accept': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                            body: props.formData,
                        }
                    );                
                } else if (props.mode === "delete") {
                    console.log("DELETing");
                    response = await fetch(
                        `${process.env.REACT_APP_AZLIB_API_URL}/api/v1/${props.entity}/${props.id}`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                        }
                    );                
                } else {
                    console.log("POSTing");
                    
                    response = await fetch(
                        `${process.env.REACT_APP_AZLIB_API_URL}/api/v1/${props.entity}`,
                        {
                            method: 'POST',
                            headers: {
                                //'Content-Type': 'multipart/form-data',
                                'Accept': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                            body: props.data,
                        }
                    );    
                    
                    /*
                    Had this for debugging, but it didn't help. The problem appears to be in FileSelectController. Ghosting for now
                    response = await axios.post(`${process.env.REACT_APP_AZLIB_API_URL}/api/v1/${props.entity}`, props.data, {
                        headers: {
                            'Content-Type':'multipart/form-data',	
                            'Accept': 'application/json',
                            'Authorization': "Bearer " + token
                        }
                    });
                    */

                }
                console.log("response");
                
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
            
                const json = await response.json();
                console.log(json);
                setLoading(false)
                console.log("setting data")
                setData(json)
            } catch (error) {
                console.error(error.message);
            }   
        }
        fetchData()     
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else if (error) {
        console.log("ERROR!");
        console.log(error);
        return <p>Error: {error.message}</p>;
    } else if (data) {
        console.log("have data")
        console.log(data);
        
         //If handleClose is present, caller was a dialog. Just close it and return
        if (props.handleClose) {
            props.handleClose();
            return null;
        }

        const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"};
        return props.mode === "edit" ?
        (
            <div>
                {JSON.stringify(data)}
            </div>
            //<div key={data[`Update${props.entity}`][`${entityID}`]} style={style}>
            //    {data[`Update${props.entity}`][`${entityID}`]} updated<br />
            //    <br />
            //</div>
        ) :
        props.mode === "create" ?
        (
            <div>
                {JSON.stringify(data)}
            </div>
            //<div key={data[`Create${props.entity}`][`${entityID}`]} style={style}>
            //    {data[`Create${props.entity}`][`${entityID}`]} created<br />
            //    <br />
            //</div>
        ) :
        props.mode === "delete" ?
        (
            <div>
                {JSON.stringify(data)}
            </div>
            //<div key={data[`Delete${props.entity}`][`${entityID}`]} style={style}>
            //    {data[`Delete${props.entity}`][`${entityID}`]} deleted<br />
            //    <br />
            //</div>
        ) :
        '';
                
    } else {
        return (<div></div>); //gotta return something until addDescription runs
    }

}

export default Mutator;
