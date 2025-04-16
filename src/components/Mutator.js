import React, { useEffect, useState } from 'react';

const Mutator = (props) => {
    console.log("Mutator");
    console.log(props);
    
    const entityID="pbotID";

    let [loading, setLoading] = useState(false)
    let [data, setData] = useState(null)
    let [error, setError] = useState(null)

    useEffect(async () => {
        const url = "http://localhost:3000/api/v1/";
        try {
          const response = await fetch(url);
          console.log(response)
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
            <div key={data[`Update${props.entity}`][`${entityID}`]} style={style}>
                {data[`Update${props.entity}`][`${entityID}`]} updated<br />
                <br />
            </div>
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
            <div key={data[`Delete${props.entity}`][`${entityID}`]} style={style}>
                {data[`Delete${props.entity}`][`${entityID}`]} deleted<br />
                <br />
            </div>
        ) :
        '';
                
    } else {
        return (<div></div>); //gotta return something until addDescription runs
    }

}

export default Mutator;
