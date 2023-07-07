import React from 'react';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';
import { Link, Grid, Typography } from '@mui/material';
import logo from '../../PBOT-logo-transparent.png';

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
    const indent6 = {marginLeft:"12em"}
    const indent7 = {marginLeft:"14em"}
    
    //TODO:Figure out a more modular way to handle nested comments query and presentation    
    return (otus.length === 0) ? (
        <div style={style}>
            No {(props.public) ? "public" : ""} results were found.
        </div>
    ) : otus.map(({ pbotID, name, family, genus, species, holotypeSpecimen, mergedDescription, synonyms, elementOf}) => {
        const directURL = new URL(window.location.origin + "/query/otu/" + pbotID);
        if (props.includeSynonyms) {
            directURL.searchParams.append("includeSynonyms", "true");
        }
        if (props.includeComments) {
            directURL.searchParams.append("includeComments", "true");
        }
        if (props.includeHolotypeDescription) {
            directURL.searchParams.append("includeHolotypeDescription", "true");
        }
        if (props.includeMergedDescription) {
            directURL.searchParams.append("includeMergedDescription", "true");
        }
            
        const header1 = {marginLeft:"2em", marginTop:"10px"}
        return (
            <div key={pbotID} style={style}>
                { props.standalone &&     
                    <>
                    <Grid container sx={{
                        width: "100%",
                        minHeight: "50px",
                        backgroundColor: 'primary.main',
                    }}>
                        <Grid container item xs={4} sx={{ display: "flex", alignItems: "center" }}>
                            <Grid item sx={{ display: "flex", alignItems: "center" }}>
                                <img src={logo} style={{ height: "45px" }} />
                            </Grid>
                            <Grid item sx={{ display: "flex", alignItems: "center" }} >                  
                                <Typography variant="h5">
                                    Pbot
                                </Typography>
                            </Grid>                 
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                            <Typography variant="h5">
                                OTU: {name || "(name missing)"}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent:"flex-end"}}  >
                            <Typography variant="h5" sx={{marginRight: "10px"}}>
                                Workspace: {elementOf[0].name}
                            </Typography>
                        </Grid>
                    </Grid>

                    <div style={indent}><b>direct link:</b> <Link color="success.main" underline="hover" href={directURL}  target="_blank">{directURL.toString()}</Link></div>

                    <div style={header1}><Typography variant="h6">Identity</Typography></div>
                    <div style={indent}><b>pbotID:</b> {pbotID}</div>


                    <div style={header1}><Typography variant="h6">Taxonomy</Typography></div>
                    <div style={indent}><b>family:</b> {family}</div>
                    <div style={indent}><b>genus:</b> {genus}</div>
                    <div style={indent}><b>species:</b> {species}</div>
                    
                    {synonyms && synonyms.length > 0 &&
                    <div>
                        <div style={indent}><b>synonyms:</b></div>
                        {synonyms.map((synonym, i) => {
                            const synOTU=synonym.otus.filter(synOtu => synOtu.pbotID !== pbotID)[0];
                            return (
                                <div key={i}>
                                    <div style={indent2}> {synOTU.name}</div>
                                    <div style={indent3}><b>family:</b> {synOTU.family}</div>
                                    <div style={indent3}><b>genus:</b> {synOTU.genus}</div>
                                    <div style={indent3}><b>species:</b> {synOTU.species}</div>
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
                                                            {comment.comments && comment.comments.length > 0 &&
                                                            <div>
                                                                {comment.comments.map((comment, i) => (
                                                                    <div key={i}>
                                                                        <div style={indent5}><b>{comment.enteredBy[0].Person.given + " " + comment.enteredBy[0].Person.surname}</b></div>
                                                                        <div style={indent5}>{comment.content}</div>
                                                                        {comment.comments && comment.comments.length > 0 &&
                                                                        <div>
                                                                            {comment.comments.map((comment, i) => (
                                                                                <div key={i}>
                                                                                    <div style={indent6}><b>{comment.enteredBy[0].Person.given + " " + comment.enteredBy[0].Person.surname}</b></div>
                                                                                    <div style={indent6}>{comment.content}</div>
                                                                                    {comment.comments && comment.comments.length > 0 &&
                                                                                    <div>
                                                                                        {comment.comments.map((comment, i) => (
                                                                                            <div key={i}>
                                                                                                <div style={indent7}><b>{comment.enteredBy[0].Person.given + " " + comment.enteredBy[0].Person.surname}</b></div>
                                                                                                <div style={indent7}>{comment.content}</div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                    }
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        }
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            }
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
                    
                    {holotypeSpecimen && holotypeSpecimen.Specimen.describedBy && 
                    holotypeSpecimen.Specimen.describedBy[0] &&
                    holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances && holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances.length > 0 &&
                    <div>
                        <div style={header1}><Typography variant="h6">Holotype description</Typography></div>
                        {alphabetize([...holotypeSpecimen.Specimen.describedBy], "Description.schema.title").map((d, i) => (
                            <div key={d.Description.schema.pbotID}>
                                <div style={indent2}><b>from schema "{d.Description.schema.title}":</b></div>
                                <div style={indent3}><b>notes:</b> {d.Description.notes}</div>
                                <CharacterInstances style={indent3} characterInstances={d.Description.characterInstances} />
                            </div>
                        ))}
                    </div>
                    }
                    
                    {mergedDescription && mergedDescription.length > 0 &&
                    <div>
                        <div style={header1}><Typography variant="h6">Merged description</Typography></div>
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
                    </>
                }


                {!props.standalone &&
                <Link style={indent} color="success.main" underline="hover" href={directURL}  target="_blank"><b>{name || "(title missing)"}</b></Link>
                }
            </div>
        )
    });
}

export default OTUs;
