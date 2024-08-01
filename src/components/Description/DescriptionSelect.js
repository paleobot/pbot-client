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
import DescriptionQueryForm from './DescriptionQueryForm.js';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';
import DescriptionQueryResults from './DescriptionQueryResults.js';

export const InnerDescriptionSelect = (props) => {
    console.log("InnerDescriptionSelect");
    console.log(props);
    
    const gQL = "full" === props.populateMode ? 
        gql`
            query {
                Description {
                    pbotID
                    name
                    writtenDescription
                    notes
                  	schema {
                      pbotID
                    }
                  	specimens {
                      Specimen {
                        name
                        pbotID
                      }
                    }
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
                }            
            }
        ` : //This is one of possibly several DescriptionSelects in SpecimenManager
        gql`
            query  {
                Description {
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
                                    
        console.log(data.Specimen);
        
        const descriptions = alphabetize(
            data.Description.map((description, x) => {
                return {
                    ...description,
                    index: x
                }
            }),  
            "name"
        );
        console.log(descriptions)
        
        const style = {minWidth: "12ch"}
        //return "specimen" === props.name ? //This is a standalone SpecimenSelect for Specimen edit/delete
        return ["full", "simple"].includes(props.populateMode) ? 
            (
                <Field
                    style={style}
                    component={TextField}
                    type="text"
                    name="description"
                    label="Description"
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    disabled={false}
                    onChange={(event,child) => {
                        props.handleSelect(JSON.parse(child.props.ddescription), props.populateMode)
                    }}
                >
                    {descriptions.map((description) => (
                        <MenuItem 
                            key={description.pbotID} 
                            value={description.pbotID}
                            ddescription={JSON.stringify(description)}
                        >{description.name}</MenuItem>
                    ))}
                </Field>
            )            
        : 
            (
                <Field
                    component={TextField}
                    type="text"
                    name={props.name || "descriptions"}
                    label={props.label}
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    onChange={(event, child) => {
                        props.handleSelect(JSON.parse(child.props.ddescription), props.populateMode)
                    }}
                    disabled={false}
                >
                    {descriptions.map((description) => (
                        <MenuItem 
                            key={description.pbotID} 
                            value={description.pbotID}
                            ddescription={JSON.stringify(description)}
                        >{description.name}</MenuItem>
                    ))}
                </Field>
            )
}


const DescriptionDialog = (props) => {
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
            Search for Description             
        </DialogTitle>
        <DialogContent>
            {!showResult &&
            <DescriptionQueryForm handleSubmit={handleSubmit}/>
            }
            {showResult &&
            <DescriptionQueryResults queryParams={queryParams} exclude={props.exclude} select={true} handleSelect={props.handleSelect}/>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props.name)
    console.log(props.values)

    const global = useContext(GlobalContext);
    const formikProps = useFormikContext()

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (description, populateMode) => {
        console.log("Description handleSelect")

        formikProps.setFieldValue(props.name, description.pbotID);

        if ("full" === populateMode) { 
            const groups = description.elementOf ? description.elementOf.map(group => {return group.pbotID}) : [];
            console.log(groups)


            formikProps.setFieldValue("schema", description.schema.pbotID);
            formikProps.setFieldValue("name", description.name || '');
            formikProps.setFieldValue("writtenDescription", description.writtenDescription);
            formikProps.setFieldValue("notes", description.notes);
            //filter out null specimens (possible if no group access)
            formikProps.setFieldValue("specimens", description.specimens.filter(s => s.Specimen !== null).map(specimen => {return{pbotID: specimen.Specimen.pbotID}}) || []);
            formikProps.setFieldValue("public", description.elementOf && description.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false));
            formikProps.setFieldValue("origPublic", formikProps.values.public);
            formikProps.setFieldValue("groups", groups || []);
            formikProps.setFieldValue("references", description.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}}) || null);
    }

        setOpen(false);
    };

    return (
        <Stack direction="row" key={props.name}>
            <InnerDescriptionSelect name={props.name} exclude={props.exclude} handleSelect={handleSelect} populateMode={props.populateMode}/>
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
                <DescriptionDialog open={open} handleClose={handleClose} handleSelect={handleSelect} exclude={props.exclude} />
            }
        </Stack>
    );
}