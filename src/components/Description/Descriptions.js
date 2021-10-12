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
    return descriptions.map(({ descriptionID, name, family, genus, species, characterInstances }) => (
        <div key={descriptionID} style={style}>
            {descriptionID}: {name}, {family}, {genus}, {species} <br />
            <CharacterInstances characterInstances={characterInstances} />
            <br />
        </div>
    ));
}

export default Descriptions;
