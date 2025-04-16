import * as React from 'react';
import { useState } from 'react';


const GlobalContext = React.createContext()

const GlobalProvider = (props) => {
    console.log("GlobalProvider"); 

    const [publicGroupID, setPublicGroupID] = useState(null)
 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* Note: I'm going at the graphql server via fetch here because I couldn't figure out how to use Apollo client to load a value from the server one time; it kept loading on every render (leaving the Apollo version ghosted above for possible tinkering later). Also, this lets me use this context at the App level, outside of the ApolloProvider (this actually isn't a big deal; I could have put it in PBOTInterface.js; but I prefer it in App.js)
    */
   /*
    const gQL = `
            {
                Group (name: "public") {
                    pbotID
                }
            }            
        `;

    useEffect(() => {
        //if (props.country === '') return
        setLoading(true);
        fetch(`/graphql`, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: gQL }),
        })
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                console.log("public group id response")
                console.log(response)
                setPublicGroupID(response.data.Group[0].pbotID);
            }
        ).catch (
            (error) => {
                console.log("error!")
                console.log(error)
                setError(error)
            }
        )
    }, [])
*/

    return <GlobalContext.Provider value={{publicGroupID: publicGroupID}} {...props}/>
}

export { GlobalContext, GlobalProvider };
