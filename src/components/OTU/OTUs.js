import React from 'react';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';

function OTUs(props) {
    console.log("OTUs");
    console.log(props.otus);
    let otus = alphabetize([...props.otus], "name");
    console.log(otus);
    
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const indent3 = {marginLeft:"6em"}
    const indent4 = {marginLeft:"8em"}
    const indent5 = {marginLeft:"10em"}
    return (otus.length === 0) ? (
        <div style={style}>
            No {(props.public) ? "public" : ""} results were found.
        </div>
    ) : otus.map(({ pbotID, name, family, genus, species, holotype, mergedDescription, synonyms }) => (
        <div key={pbotID} style={style}>
            <b>{name || "(name missing)"}</b>
            <div style={indent}><b>pbotID:</b>{pbotID}</div>
            <div style={indent}><b>family:</b>{family}</div>
            <div style={indent}><b>genus:</b>{genus}</div>
            <div style={indent}><b>species:</b>{species}</div>
            
            {synonyms && synonyms.length > 0 &&
            <div>
                <div style={indent}><b>synonyms:</b></div>
                {synonyms.map((synonym, i) => {
                    const synOTU=synonym.otus.filter(synOtu => synOtu.pbotID !== pbotID)[0];
                    return (
                        <div key={i}>
                            <div style={indent2}>{synOTU.name}</div>
                            <div style={indent3}><b>family:</b>{synOTU.family}</div>
                            <div style={indent3}><b>genus:</b>{synOTU.genus}</div>
                            <div style={indent3}><b>species:</b>{synOTU.species}</div>
                            {synonym.comments && synonym.comments.length > 0 &&
                            <div>
                                <div style={indent2}><b>comments:</b></div>
                                {synonym.comments.map((comment, i) => (
                                    <div key={i}>
                                        <div style={indent3}><b>{comment.enteredBy[0].Person.given + " " + comment.enteredBy[0].Person.surname}</b></div>
                                        <div style={indent3}>{comment.content}</div>
                                        {comment.comments && comment.comments.length > 0 &&
                                        <div>
                                            {comment.comments.map((comment, i) => (
                                                <div key={i}>
                                                    <div style={indent4}><b>{comment.enteredBy[0].Person.given + " " + comment.enteredBy[0].Person.surname}</b></div>
                                                    <div style={indent4}>{comment.content}</div>
                                                </div>
                                            ))}
                                        </div>
                                        }
                                    </div>
                                ))}
                            </div>
                            }
                        </div>
                    )
                })}
            </div>
            }
            
            {holotype && holotype.Specimen.describedBy && holotype.Specimen.describedBy[0].Description.characterInstances && holotype.Specimen.describedBy[0].Description.characterInstances.length > 0 &&
            <div>
                <div style={indent}><b>holotype description:</b></div>
                {alphabetize([...holotype.Specimen.describedBy], "Description.schema.title").map((d, i) => (
                    <div key={d.Description.schema.pbotID}>
                        <div style={indent2}><b>from schema "{d.Description.schema.title}":</b></div>
                        <CharacterInstances characterInstances={d.Description.characterInstances} />
                    </div>
                ))}
            </div>
            }
            
            {mergedDescription && mergedDescription.length > 0 &&
            <div>
                <div style={indent}><b>merged description:</b></div>
                {alphabetize([...mergedDescription], "schema").reduce((acc, ci) => acc.includes(ci.schema) ? acc : acc.concat(ci.schema),[]).map((s,i) => (
                    <div key={i}>
                        <div style={indent2}><b>from schema "{s}":</b></div>
                        {alphabetize(mergedDescription.filter(ci => ci.schema === s), "characterName").map ((ci, i) =>  (
                            <div style={indent2} key={i}>{ci.characterName}:{"quantity" === ci.stateName ? ci.stateValue : ci.stateName}{ci.stateOrder  ? ', order:' + ci.stateOrder : ''}</div>
                        ))}
                    </div>
                ))}
            </div>
            }
            <br />
        </div>
    ));
}

export default OTUs;
