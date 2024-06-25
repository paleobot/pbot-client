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
import OTUQueryForm from './OTUQueryForm.js';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import OTUQueryResults from './OTUQueryResults.js';

export const InnerOTUSelect = (props) => {
    console.log("InnerOTUSelect");
    console.log(props);
    
    const gQL = "full" === props.populateMode ? 
        gql`
            query {
                OTU {
                    pbotID
                    name
                    authority
                    diagnosis
                    qualityIndex
                    majorTaxonGroup
                    pbdbParentTaxon
                    family
                    genus
                    pfnGenusLink
                    species
                    pfnSpeciesLink
                    additionalClades
                    notes
                    identifiedSpecimens {
                      Specimen {
                        name
                        pbotID
                      }
                    }
                  	typeSpecimens {
                      Specimen {
                        name
                        pbotID
                      }
                    }
                    holotypeSpecimen {
                        Specimen {
                            name
                            pbotID
                        }
                    }
                    partsPreserved {
                        pbotID
                    }
                    notableFeatures {
                        pbotID
                    }
                    references (orderBy: order_asc) {
                        Reference {
                            pbotID
                        }
                        order
                    }
                    elementOf {
                        name
                        pbotID
                    }
                }            
            }
        ` : 
        gql`
            query  {
                OTU {
                    pbotID
                    name
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {        
        variables: {
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                        
    const otus = alphabetize(
        data.OTU.map((otu, x) => {
            return {
                ...otu,
                index: x
            }
        }),  
        "name"
    );
    console.log(otus)
    
    const style = {minWidth: "12ch"}
    //return "specimen" === props.name ? //This is a standalone SpecimenSelect for Specimen edit/delete
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name={props.name || "otu"}
            label={props.label || "Taxa (OTU)"}
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                props.handleSelect(JSON.parse(child.props.dotu), props.populateMode)
            }}
        >
            {otus.map((otu) => (
                <MenuItem 
                    key={otu.pbotID} 
                    value={otu.pbotID}
                    dotu={JSON.stringify(otu)}
                >{otu.name}</MenuItem>
            ))}
        </Field>
    )            
}


const OTUDialog = (props) => {
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
            Search for OTU             
        </DialogTitle>
        <DialogContent>
            {!showResult &&
            <OTUQueryForm handleSubmit={handleSubmit} select/>
            }
            {showResult &&
            <OTUQueryResults queryParams={queryParams} exclude={props.exclude} select={true} handleSelect={props.handleSelect}/>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export const OTUSelect = (props) => {
    console.log("OTUSelect");
    console.log(props.name)
    console.log(props.values)

    const global = useContext(GlobalContext);
    const formikProps = useFormikContext()

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (otu, populateMode) => {
        console.log("OTU handleSelect")
        console.log(otu)

        populateMode = populateMode ?? props.populateMode;

        formikProps.setFieldValue(props.name, otu.pbotID);

        if ("full" === populateMode) { 
            const groups = otu.elementOf ? otu.elementOf.map(group => {return group.pbotID}) : [];
            //console.log(groups)

            formikProps.setFieldValue("name", otu.name || '');
            formikProps.setFieldValue("authority", otu.authority || '');
            formikProps.setFieldValue("diagnosis", otu.diagnosis || '');
            formikProps.setFieldValue("qualityIndex", otu.qualityIndex || '');
            formikProps.setFieldValue("majorTaxonGroup", otu.majorTaxonGroup || '');
            formikProps.setFieldValue("pbdbParentTaxon", otu.pbdbParentTaxon || '');
            formikProps.setFieldValue("family", otu.family || '');
            formikProps.setFieldValue("genus", otu.genus || '');
            formikProps.setFieldValue("pfnGenusLink", otu.pfnGenusLink || '');
            formikProps.setFieldValue("species", otu.species || '');
            formikProps.setFieldValue("pfnSpeciesLink", otu.pfnSpeciesLink || '');
            formikProps.setFieldValue("additionalClades", otu.additionalClades || '');
            formikProps.setFieldValue("notes", otu.notes || '');
            formikProps.setFieldValue("partsPreserved", 
                otu.partsPreserved && otu.partsPreserved.length > 0 ?
                otu.partsPreserved.map(p => p.pbotID) :
                []
            );
            formikProps.setFieldValue("notableFeatures", 
                otu.notableFeatures && otu.notableFeatures.length > 0 ?
                otu.notableFeatures.map(n => n.pbotID) :
                []
            );
            
            formikProps.setFieldValue("identifiedSpecimens", 
                otu.identifiedSpecimens && otu.identifiedSpecimens.length > 0 ?
                    otu.identifiedSpecimens.map(s => {return {pbotID: s.Specimen.pbotID}}) :
                    []
            );             
            //formikProps.setFieldValue("identifiedSpecimens", otu.identifiedSpecimens || []);
            
            formikProps.setFieldValue("typeSpecimens", 
                otu.typeSpecimens && otu.typeSpecimens.length > 0 ?
                    otu.typeSpecimens.map(s => s.Specimen.pbotID) :
                    []
            ); 

            formikProps.setFieldValue("holotypeSpecimen", otu.holotypeSpecimen ? otu.holotypeSpecimen.Specimen.pbotID : '');

            formikProps.setFieldValue("references", otu.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}}) || null);
            formikProps.setFieldValue("public", otu.elementOf && otu.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false));
            formikProps.setFieldValue("origPublic", formikProps.values.public);
            formikProps.setFieldValue("groups", groups || []);

            console.log(formikProps.values)
        }

        setOpen(false);
    };

    return (
        <Stack direction="row" key={props.name}>
            <InnerOTUSelect name={props.name} label={props.label} exclude={props.exclude} handleSelect={handleSelect} populateMode={props.populateMode}/>
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
                <OTUDialog open={open} handleClose={handleClose} handleSelect={handleSelect} exclude={props.exclude} />
            }
        </Stack>
    );
}