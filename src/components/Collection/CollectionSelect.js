import React, { useContext, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, Tooltip } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";
import { GlobalContext } from '../GlobalContext.js';
import SearchIcon from '@mui/icons-material/Search';
import CollectionQueryForm from './CollectionQueryForm.js';
import CollectionQueryResults from './CollectionQueryResults.js';

export const InnerCollectionSelect = (props) => {
    console.log("InnerCollectionSelect");
    console.log(props);
    
    const gQL = "full" === props.populateMode ? 
        gql`
            query {
                Collection {
                pbotID
                name
                collectionType
                sizeClasses
                lat
                lon
                gpsCoordinateUncertainty
                geographicResolution
                geographicComments
                protectedSite
                country
                state
                timescale
                maxinterval
                mininterval
                lithology
                additionalLithology
                stratigraphicGroup
                stratigraphicFormation
                stratigraphicMember
                stratigraphicBed
                stratigraphicComments
                environment
                environmentComments
                collectors
                collectionMethods
                collectingComments
                pbdbid
                directDate
                directDateError
                directDateType
                numericAgeMin
                numericAgeMinError
                numericAgeMinType
                numericAgeMax
                numericAgeMaxError
                numericAgeMaxType
                ageComments
                elementOf {
                    name
                    pbotID
                }
                references (orderBy: order_asc) {
                    Reference {
                        pbotID
                    }
                    order
                }
                specimens {
                    pbotID
                }
                preservationModes {
                    pbotID
                }
            }            
            }
        ` : 
        gql`
            query  {
                Collection {
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
                                    
        console.log(data.Collection);
        
        const collections = alphabetize(
            data.Collection.map((collection, x) => {
                return {
                    ...collection,
                    index: x
                }
            }),  
            "name"
        );
        console.log(collections)
        
        const style = {minWidth: "12ch"}
        return ["full", "simple"].includes(props.populateMode) ? 
            (
                <Field
                    style={style}
                    component={TextField}
                    type="text"
                    name="collection"
                    label="Collection"
                    fullWidth 
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    disabled={false}
                    onChange={(event,child) => {
                        props.handleSelect(JSON.parse(child.props.dcollection), props.populateMode)
                    }}
                >
                    {collections.map((collection) => (
                        <MenuItem 
                            key={collection.pbotID} 
                            value={collection.pbotID}
                            dcollection={JSON.stringify(collection)}
                        >{collection.name}</MenuItem>
                    ))}
                </Field>
            )            
        : 
            (
                <Field
                    component={TextField}
                    type="text"
                    name={props.name || "collection"}
                    label={props.label}
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    onChange={(event, child) => {
                        props.handleSelect(JSON.parse(child.props.dcollection), props.populateMode)
                    }}
                    disabled={false}
                >
                    {collections.map((collection) => (
                        <MenuItem 
                            key={collection.pbotID} 
                            value={collection.pbotID}
                            dcollection={JSON.stringify(collection)}
                        >{collection.name}</MenuItem>
                    ))}
                </Field>
            )
}


const CollectionDialog = (props) => {
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
            Search for Collection             
        </DialogTitle>
        <DialogContent>
            {!showResult &&
            <CollectionQueryForm select={true} handleSubmit={handleSubmit}/>
            }
            {showResult &&
            <CollectionQueryResults queryParams={queryParams} exclude={props.exclude} select={true} handleSelect={props.handleSelect} populateMode={props.populateMode} />
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export const CollectionSelect = (props) => {
    console.log("CollectionSelect");
    console.log(props.name)
    console.log(props.values)

    const global = useContext(GlobalContext);
    const formikProps = useFormikContext()

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (collection, populateMode) => {
        console.log("handleSelect")

        formikProps.setFieldValue(props.name, collection.pbotID);

        if ("full" === populateMode) { 
            const groups = collection.elementOf ? collection.elementOf.map(group => {return group.pbotID}) : [];
            console.log(groups)

            formikProps.setFieldValue("name", collection.name || '');

            formikProps.setFieldValue("collectiontype", collection.collectionType || '');
            formikProps.setFieldValue("sizeclasses", collection.sizeClasses || []);
            formikProps.setFieldValue("lat", collection.lat || '');
            formikProps.setFieldValue("lon", collection.lon || '');
            formikProps.setFieldValue("gpsuncertainty", collection.gpsCoordinateUncertainty || '');
            formikProps.setFieldValue("geographicresolution", collection.geographicResolution || '');
            formikProps.setFieldValue("geographiccomments", collection.geographicComments || '');
            formikProps.setFieldValue("protectedSite", collection.protectedSite === "true");
            formikProps.setFieldValue("country", collection.country || '');
            formikProps.setFieldValue("state", collection.state || '');
            formikProps.setFieldValue("timescale", collection.timescale || '');
            formikProps.setFieldValue("maxinterval", collection.maxinterval || '');
            formikProps.setFieldValue("mininterval", collection.mininterval || '');
            formikProps.setFieldValue("lithology", collection.lithology || '');
            formikProps.setFieldValue("additionallithology", collection.additionalLithology || '');
            formikProps.setFieldValue("stratigraphicgroup", collection.stratigraphicGroup || '');
            formikProps.setFieldValue("stratigraphicformation", collection.stratigraphicFormation || '');
            formikProps.setFieldValue("stratigraphicmember", collection.stratigraphicMember || '');
            formikProps.setFieldValue("stratigraphicbed", collection.stratigraphicBed || '');
            formikProps.setFieldValue("stratigraphiccomments", collection.stratigraphicComments || '');
            formikProps.setFieldValue("environment", collection.environment || '');
            formikProps.setFieldValue("environmentcomments", collection.environmentComments || '');
            formikProps.setFieldValue("collectors", collection.collectors || '');
            formikProps.setFieldValue("collectionmethods", collection.collectionMethods || []);
            formikProps.setFieldValue("collectingcomments", collection.collectingComments || '');
            formikProps.setFieldValue("pbdbid", collection.pbdbid || '');
            formikProps.setFieldValue("directdate", collection.directDate || '');
            formikProps.setFieldValue("directdateerror", collection.directDateError || '');
            formikProps.setFieldValue("directdatetype", collection.directDateType || '');
            formikProps.setFieldValue("numericagemin", collection.numericAgeMin || '');
            formikProps.setFieldValue("numericageminerror", collection.numericAgeMinError || '');
            formikProps.setFieldValue("numericagemintype", collection.numericAgeMinType || '');
            formikProps.setFieldValue("numericagemax", collection.numericAgeMax || '');
            formikProps.setFieldValue("numericagemaxerror", collection.numericAgeMaxError || '');
            formikProps.setFieldValue("numericagemaxtype", collection.numericAgeMaxType || '');
            formikProps.setFieldValue("agecomments", collection.ageComments || '');
            formikProps.setFieldValue("preservationmodes", collection.preservationModes ? collection.preservationModes.map(preservationMode => preservationMode.pbotID) : []);
            formikProps.setFieldValue("public", collection.elementOf && collection.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false));
            formikProps.setFieldValue("origPublic", formikProps.values.public);
            formikProps.setFieldValue("groups", groups || []);
            formikProps.setFieldValue("specimens", collection.specimens ? collection.specimens.map(specimen => specimen.pbotID) : []);
            formikProps.setFieldValue("references", collection.references ? collection.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}}) : []);

        }

        setOpen(false);
    };

    return (
        <Stack direction="row" key={props.name}>
            <InnerCollectionSelect name={props.name}  label={props.label} handleSelect={handleSelect} populateMode={props.populateMode}/>
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
                <CollectionDialog open={open} handleClose={handleClose} handleSelect={handleSelect} populateMode={props.populateMode} />
            }
        </Stack>
    );
}
