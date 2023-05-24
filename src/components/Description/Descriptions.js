import React from 'react';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';

function Descriptions(props) {
    console.log("Descriptions");
    let descriptions = alphabetize([...props.descriptions], "name");
    
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    return (descriptions.length === 0) ? (
        <div style={style}>
            No {(props.public) ? "public" : ""} results were found.
        </div>
    ) : descriptions.map(({ pbotID, name, type, family, genus, species, characterInstances, references }) => (
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
            {references && references.length > 0 &&
            <div>
                <div>
                    <div style={indent}><b>references:</b></div>
                    {alphabetize([...references], "order").map(reference => (
                        <div key={reference.Reference.pbotID} style={indent2}>{reference.Reference.title}, {reference.Reference.year}</div>
                    ))}
                </div>
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
