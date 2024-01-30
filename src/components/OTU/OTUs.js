import React from 'react';
import CharacterInstances from "../CharacterInstance/CharacterInstances";
import { alphabetize } from '../../util.js';
import { Link, Grid, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import logo from '../../PBOT-logo-transparent.png';

//TODO: Might be worth moving this to its own file and using elsewhere
const DirectQueryLink = (props) => {
    console.log("DirectQueryLink")
    const url = new URL(`${window.location.origin}/query/${props.type}/${props.pbotID}`);
    console.log(props.params)
    //props.params.forEach(p => console.log(p))
    if (props.params) props.params.forEach(p => {
        console.log(p)
        url.searchParams.append(p, "true");
    })
    return (
        <Link style={props.style} color="success.main" underline="hover" href={url}  target="_blank"><b>{props.text || url.toString()}</b></Link>
    )
}

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
    
    if (otus.length === 0) {
        return (
            <div style={style}>
                No {(props.public) ? "public" : ""} results were found.
            </div>
        )
    }
    if (props.select) {
        return (
            <List sx={{ pt: 0 }}>
            {otus.map((otu) => (
                <ListItem disableGutters key={otu.pbotID}>
                    <ListItemButton onClick={() => props.handleSelect(otu)} >
                        <ListItemText 
                        primary={otu.name} secondary={`pbot id: ${otu.pbotID}`} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        )
    }
    //TODO:Figure out a more modular way to handle nested comments query and presentation    
    return (
        otus.map(({ pbotID, name, diagnosis, qualityIndex, majorTaxonGroup, pbdbParentTaxon, family, genus, pfnGenusLink, species, pfnSpeciesLink, additionalClades, holotypeSpecimen, mergedDescription, synonyms, elementOf, notes, partsPreserved, notableFeatures}) => {
            const directQParams = [];
            if (props.includeSynonyms) {
                directQParams.push("includeSynonyms");
            }
            if (props.includeComments) {
                directQParams.push("includeComments");
            }
            if (props.includeHolotypeDescription) {
                directQParams.push("includeHolotypeDescription");
            }
            if (props.includeMergedDescription) {
                directQParams.push("includeMergedDescription");
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

                        <div style={indent}><b>direct link:</b> <DirectQueryLink type="otu" pbotID={pbotID} params={directQParams} /></div>

                        <div style={header1}><Typography variant="h6">Identity</Typography></div>
                        <div style={indent}><b>pbotID:</b> {pbotID}</div>


                        <div style={header1}><Typography variant="h6">Taxonomy</Typography></div>
                        <div style={indent}><b>diagnosis:</b> {diagnosis}</div>
                        <div style={indent}><b>qualityIndex:</b> {qualityIndex}</div>
                        <div style={indent}><b>majorTaxonGroup:</b> {majorTaxonGroup}</div>
                        <div style={indent}><b>pbdbParentTaxon:</b> {pbdbParentTaxon}</div>
                        <div style={indent}><b>family:</b> {family}</div>
                        <div style={indent}><b>genus:</b> {genus}</div>
                        <div style={indent2}><b>PFN genus link:</b> {pfnGenusLink}</div>
                        <div style={indent}><b>species:</b> {species}</div>
                        <div style={indent2}><b>PFN species link:</b> {pfnSpeciesLink}</div>
                        <div style={indent}><b>additional clades:</b> {additionalClades}</div>
                        <div style={indent}><b>notes:</b> {notes}</div>
                        
                        <div style={header1}><Typography variant="h6">Preservation</Typography></div>
                        <div style={indent}><b>parts preserved:</b> {partsPreserved.map((organ, index, arr) => organ.type + (index+1 === arr.length ? '' : ", "))}</div>
                        <div style={indent}><b>notable features:</b> {notableFeatures.map((feature, index, arr) => feature.name + (index+1 === arr.length ? '' : ", "))}</div>

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
                            <div style={indent2}><b>specimen direct link:</b> <DirectQueryLink type="specimen" pbotID={holotypeSpecimen.Specimen.pbotID} params={["includeDescriptions"]} /></div>
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
                    <DirectQueryLink style={indent} type="otu" pbotID={pbotID} params={directQParams} text={name || "(title missing)"} />
                    }
                </div>
            )
        })
    );
}

export default OTUs;
