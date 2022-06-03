import React from 'react';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';

function OTUs(props) {
    console.log("OTUs");
    let otus = alphabetize([...props.otus], "name");
    console.log(otus);
    
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    return (otus.length === 0) ? (
        <div style={style}>
            No {(props.public) ? "public" : ""} results were found.
        </div>
    ) : otus.map(({ pbotID, name, family, genus, species, holotype, mergedDescription }) => (
        <div key={pbotID} style={style}>
            <b>{name || "(name missing)"}</b>
            <div style={indent}><b>pbotID:</b>{pbotID}</div>
            <div style={indent}><b>family:</b>{family}</div>
            <div style={indent}><b>genus:</b>{genus}</div>
            <div style={indent}><b>species:</b>{species}</div>
            
            {//TODO:Could be multiple Descriptions. Need to iterate describedBy. Also, this is brittle if Specimen or describedBy are missing.
            holotype && holotype.Specimen.describedBy[0].Description.characterInstances && holotype.Specimen.describedBy[0].Description.characterInstances.length > 0 &&
            <div>
                <div style={indent}><b>holotype description:</b></div>
                <CharacterInstances characterInstances={holotype.Specimen.describedBy[0].Description.characterInstances} />
            </div>
            }
            {//TODO:This is all just placeholder until I figure out how to handle it.
            mergedDescription && mergedDescription.length > 0 &&
            <div>
                <div style={indent}><b>merged description:</b></div>
                {alphabetize([...mergedDescription], "characterName").map((d, i) => (
                    <div style={indent2} key={i}>{d.characterName}:{"quantity" === d.stateName ? d.stateValue : d.stateName}{d.stateOrder  ? ', order:' + d.stateOrder : ''}</div>
                ))}
            </div>
            }
            <br />
        </div>
    ));
}

export default OTUs;
