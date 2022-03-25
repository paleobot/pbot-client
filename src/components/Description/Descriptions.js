import React from 'react';
import CharacterInstances from "../CharacterInstance/CharacterInstances";

function Descriptions(props) {
    console.log("Descriptions");
    let descriptions = [...props.descriptions];
    descriptions.sort((a,b) => {
        const nameA = a.name ? a.name.toUpperCase() : "z"; //"z" forces null names to end of list
        const nameB = b.name ? b.name.toUpperCase() : "z"; 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    return (descriptions.length === 0) ? (
        <div style={style}>
            No public results were found.
        </div>
    ) : descriptions.map(({ pbotID, name, type, family, genus, species, characterInstances }) => (
        <div key={pbotID} style={style}>
            <b>{name || "(name missing)"}</b>
            <div style={indent}><b>pbotID:</b>{pbotID}</div>
            {type === "OTU" &&
            <div>
                <div style={indent}><b>family:</b>{family}</div>
                <div style={indent}><b>genus:</b>{genus}</div>
                <div style={indent}><b>species:</b>{species}</div>
            </div>
            }
            {characterInstances && characterInstances.length > 0 &&
            <div>
                <div style={indent}><b>character instances:</b></div>
                <CharacterInstances characterInstances={characterInstances} />
            </div>
            }
            <br />
        </div>
    ));
}

export default Descriptions;
