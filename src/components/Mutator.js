import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const Mutator = (props) => {
    console.log("Mutator");
    console.log(props);
    
    const entityID="pbotID";

    let [loading, setLoading] = useState(false)
    let [data, setData] = useState(null)
    let [error, setError] = useState(null)

    const [token, setToken] = useAuth();

    useEffect(() => {

        async function fetchData () {
            setLoading(true)
            try {
                let response
                if (props.mode === "replace") {
                    console.log("PUTing");
                    response = await fetch(
                        `${process.env.REACT_APP_AZLIB_API_URL}/api/v1/${props.entity}/${props.id}`,
                        {
                            method: 'PUT',
                            headers: {
                                //'Content-Type': 'multipart/form-data',
                                'Accept': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                            body: props.data,
                        }
                    );                
                } else if (props.mode === "edit") {
                    console.log("PATCHing");
                    response = await fetch(
                        `${process.env.REACT_APP_AZLIB_API_URL}/api/v1/${props.entity}/${props.id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                //'Content-Type': 'multipart/form-data', let the browser set this
                                'Accept': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                            body: props.data,
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
                }
                console.log("response");
                
                //TODO: I'm thinking now that we don't need to check for ok. Just pass the error on through and let it display.
                /*
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                */

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
    }, [props.random]);

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
        return (
            <div>
                <pre>{JSON.stringify(data, null, 4)}</pre>
            </div>
        )

        /*
        return props.mode === "edit" ?
        (
            <div>
                <pre>{JSON.stringify(data, null, 4)}</pre>
            </div>
            //<div key={data[`Update${props.entity}`][`${entityID}`]} style={style}>
            //    {data[`Update${props.entity}`][`${entityID}`]} updated<br />
            //    <br />
            //</div>
        ) :
        props.mode === "create" ?
        (
            <div>
                <pre>{JSON.stringify(data, null, 4)}</pre>
            </div>
            //<div key={data[`Create${props.entity}`][`${entityID}`]} style={style}>
            //    {data[`Create${props.entity}`][`${entityID}`]} created<br />
            //    <br />
            //</div>
        ) :
        props.mode === "delete" ?
        (
            <div>
                <pre>{JSON.stringify(data, null, 4)}</pre>
            </div>
            //<div key={data[`Delete${props.entity}`][`${entityID}`]} style={style}>
            //    {data[`Delete${props.entity}`][`${entityID}`]} deleted<br />
            //    <br />
            //</div>
        ) :
        '';
        */

    } else {
        return (<div></div>); //gotta return something until addDescription runs
    }

}

export default Mutator;
