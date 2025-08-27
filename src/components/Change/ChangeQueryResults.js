import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import { useAuth } from '../AuthContext.js';


function Changes(props) {
    console.log("Changes")
    console.log(props);
    
    const global = useContext(GlobalContext);

    let [loading, setLoading] = useState(false)
    let [data, setData] = useState(null)
    let [error, setError] = useState(null)

    const {token} = useAuth();

    useEffect(() => {

        async function fetchData () {
            setLoading(true)

            /*
            const searchParams = new URLSearchParams(props.data);
            Object.keys(searchParams).forEach(key => {
                if (searchParams[key] === null || searchParams[key] === undefined) {
                    console.log(`Removing key ${key} from searchParams`);
                    searchParams.delete(key);
                }
            });
            console.log("searchParams");
            console.log(searchParams.toString());
            */
            const searchParams = new URLSearchParams();
            if (props.data.search) {
                searchParams.append('search', props.data.search);
            }
            if (props.data.status) {
                searchParams.append('status', props.data.status);
            }
            if (props.data.private) {
                searchParams.append('private', props.data.private);
            }


            try {
                const response = await fetch(
                        `${process.env.REACT_APP_AZLIB_API_URL}/api/v1/changes?${searchParams.toString()}`,
                        {
                            method: 'GET',
                            headers: {
                                //'Content-Type': 'multipart/form-data',
                                'Accept': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                        }
                );                
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
        
        const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"};
        return (
            <div>
                <pre>{JSON.stringify(data, null, 4)}</pre>
            </div>
        )
    }
    return <p>No data</p>;
}           

const ChangeQueryResults = ({queryParams, select, handleSelect, exclude}) => {
    console.log("ChangeQueryResults")
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <>
        <Changes 
            data={{
                search: queryParams.search || null, 
                status: queryParams.status || null,
                private: queryParams.private || null,
            }}
            random={queryParams.random}
        />
        </>
    );
};

export default ChangeQueryResults;
