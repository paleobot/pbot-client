import * as React from 'react';
import { useState } from 'react';


const GlobalContext = React.createContext()

const GlobalProvider = (props) => {
    console.log("GlobalProvider"); 

    const publicGroupID = null; //TODO: Remove when codebase is cleaned of PBOT
    
    const superuserID = 73
 
    //TODO: Might be nice to get superuserID from the API. Unfortunately, the code below does not work because token is not yet defined. Figure out later. Maybe.
    /*
    const [superuserID, setSuperuserID] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    React.useEffect(() => {
        console.log("GlobalProvider useEffect on data");
        console.log(data);
        if (data) {
            setSuperuserID(data.filter((item) => item.name === "superuser")[0]?.value);
        }
    }, [data]);

    React.useEffect(() => {
        console.log("GlobalProvider useEffect to get roles");
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log(`Fetching data from ${process.env.REACT_APP_AZLIB_API_URL}`);
                const response = await fetch(
                    new URL("api/v1/users/roles", process.env.REACT_APP_AZLIB_API_URL),
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let json = await response.json();
                console.log(json)
                setData(json.data);
                setLoading(false);
            } catch (e) {
                console.error(e);
                setError(e);
                setLoading(false);
            }
        }

        fetchData();
    }, [])
    */

    //TODO: Remove publicGroupID when the codebase is cleaned of PBOT
    return <GlobalContext.Provider value={{publicGroupID: publicGroupID, superuserID}} {...props}/>
}

export { GlobalContext, GlobalProvider };
