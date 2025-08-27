import React, { useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Stack, Tooltip } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";
import SearchIcon from '@mui/icons-material/Search';
import SpecimenQueryForm from './SpecimenQueryForm.js';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import SpecimenQueryResults from './SpecimenQueryResults.js';

export const InnerSpecimenSelect = (props) => {
    console.log("InnerSpecimenSelect");
    console.log(props);
    
    //const gQL = "specimen" === props.name ? //This is a standalone SpecimenSelect for Specimen edit/delete
    const gQL = "full" === props.populateMode ? 
        gql`
            query {
                Specimen {
                    pbotID
                    name
                    preservationModes {
                        pbotID
                    }
                    repository
                    otherRepositoryLink
                    notes
                    gbifID
                    idigbiouuid
                    idigbioInstitutionCode
                    idigbioCatalogNumber
                    pbdbcid
                    pbdboccid
                    partsPreserved {
                        pbotID
                    }
                    notableFeatures {
                        pbotID
                    }
                    describedBy {
                      	Description {
                        	pbotID
                      	}
                    }
                    elementOf {
                        name
                        pbotID
                    }
                    collection {
                        pbotID
                    }
                    references (orderBy: order_asc) {
                        Reference {
                            pbotID
                        }
                        order
                    }
                    identifiers {
                        pbotID
                    }
                }            
            }
        ` : //This is one of possibly several SpecimenSelects in SpecimenManager
        gql`
            query  ($excludeList: [ID!]){
                Specimen (filter: {pbotID_not_in: $excludeList}){
                    pbotID
                    name
                }            
            }
        `;

       //For SpecimenManager applications, omit Specimens that are already in the list
        const excludeIDs = props.exclude ? props.exclude.map(specimen => specimen.pbotID) : [];

        const { loading: loading, error: error, data: data } = useQuery(gQL, {        
            variables: {
                excludeList: excludeIDs
            },
            fetchPolicy: "cache-and-network"
        });

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
                                    
        console.log(data.Specimen);
        
        const specimens = alphabetize(
            data.Specimen.map((specimen, x) => {
                return {
                    ...specimen,
                    index: x
                }
            }),  
            "name"
        );
        console.log(specimens)
        
        const style = {minWidth: "12ch"}
        //return "specimen" === props.name ? //This is a standalone SpecimenSelect for Specimen edit/delete
        return ["full", "simple"].includes(props.populateMode) ? 
            (
                <Field
                    style={style}
                    component={TextField}
                    type="text"
                    name="specimen"
                    label="Specimen"
                    fullWidth 
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    disabled={false}
                    onChange={(event,child) => {
                        props.handleSelect(JSON.parse(child.props.dspecimen), props.populateMode)
                    }}
                >
                    {specimens.map((specimen) => (
                        <MenuItem 
                            key={specimen.pbotID} 
                            value={specimen.pbotID}
                            dspecimen={JSON.stringify(specimen)}
                        >{specimen.name}</MenuItem>
                    ))}
                </Field>
            )            
        : //This is one of possibly several SpecimenSelects in SpecimenManager
            (
                <Field
                    component={TextField}
                    type="text"
                    name={props.name || "specimens"}
                    label={props.label}
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    onChange={(event, child) => {
                        props.handleSelect(JSON.parse(child.props.dspecimen), props.populateMode)
                    }}
                    disabled={false}
                >
                    {specimens.map((specimen) => (
                        <MenuItem 
                            key={specimen.pbotID} 
                            value={specimen.pbotID}
                            dspecimen={JSON.stringify(specimen)}
                        >{specimen.name}</MenuItem>
                    ))}
                </Field>
            )
}


const SpecimenDialog = (props) => {
    const [showResult, setShowResult] = useState(false);
    const [queryParams, setQueryParams] = useState([]);

    const handleSubmit = (values) => {
        console.log("handling submit")
        setQueryParams(values);
        setShowResult(true);
    }

    return (
        <Dialog fullWidth={true} open={props.open}>
        <DialogTitle>
            Search for Specimen             
        </DialogTitle>
        <DialogContent>
            {!showResult &&
            <SpecimenQueryForm select={true} handleSubmit={handleSubmit}/>
            }
            {showResult &&
            <SpecimenQueryResults queryParams={queryParams} exclude={props.exclude} handleSelect={props.handleSelect} />
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    console.log(props.name)
    console.log(props.values)

    const global = useContext(GlobalContext);
    const formikProps = useFormikContext()

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (specimen) => {
        console.log("handleSelect specimen")

        formikProps.setFieldValue(props.name, specimen.pbotID);

       //if ("specimen" === props.name) { //Standalone SpecimenSelect
        if ("full" === props.populateMode) { 
            const groups = specimen.elementOf ? specimen.elementOf.map(group => {return group.pbotID}) : [];
            console.log(groups)


            formikProps.setFieldValue("name", specimen.name || '');
            formikProps.setFieldValue("partsPreserved", specimen.partsPreserved ? specimen.partsPreserved.map(organ => organ.pbotID) : '');
            formikProps.setFieldValue("notableFeatures", specimen.notableFeatures ? specimen.notableFeatures.map(feature => feature.pbotID) : '');
            formikProps.setFieldValue("preservationModes", specimen.preservationModes ? specimen.preservationModes.map(p => p.pbotID) : '');
            formikProps.setFieldValue("describedBy", specimen.describedBy ? specimen.describedBy.map(d => d.Description.pbotID) : '');
            formikProps.setFieldValue("repository", specimen.repository || '');
            formikProps.setFieldValue("otherRepositoryLink", specimen.otherRepositoryLink || '');
            formikProps.setFieldValue("notes", specimen.notes || '');
            formikProps.setFieldValue("idigbiouuid", specimen.idigbiouuid || '');
            formikProps.setFieldValue("idigbioInstitutionCode", specimen.idigbioInstitutionCode || '');
            formikProps.setFieldValue("idigbioCatalogNumber", specimen.idigbioCatalogNumber || '');
            formikProps.setFieldValue("pbdbcid", specimen.pbdbcid || '');
            formikProps.setFieldValue("pbdboccid", specimen.pbdboccid || '');
            formikProps.setFieldValue("public", specimen.elementOf && specimen.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false));
            formikProps.setFieldValue("origPublic", formikProps.values.public);
            formikProps.setFieldValue("groups", groups || []);
            formikProps.setFieldValue("references", specimen.references ? specimen.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}}) : null);
            formikProps.setFieldValue("collection", specimen.collection.pbotID || '');
            formikProps.setFieldValue("identifiers", specimen.identifiers || '');
        }

        setOpen(false);
    };

    return (
        <Stack direction="row" key={props.name}>
            <InnerSpecimenSelect name={props.name} label={props.label} exclude={props.exclude} handleSelect={handleSelect} populateMode={props.populateMode}/>
            <Tooltip title="Search using a query form"><span>
                <IconButton
                    color="secondary" 
                    size="large"
                    onClick={()=>{setOpen(true)}}
                    disabled={false}
                >
                    <SearchIcon/>
                </IconButton>
            </span></Tooltip>
            {open &&
                <SpecimenDialog open={open} handleClose={handleClose} handleSelect={handleSelect} exclude={props.exclude} />
            }
        </Stack>
    );
}