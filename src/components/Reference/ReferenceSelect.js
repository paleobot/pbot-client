import React, { useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Stack } from '@mui/material';
import { TextField } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";
import ReferenceQueryForm from './ReferenceQueryForm.js';
import SearchIcon from '@mui/icons-material/Search';
import ReferenceQueryResults from './ReferenceQueryResults.js';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';

export const InnerReferenceSelect = (props) => {
    console.log("InnerReferenceSelect");
    console.log(props);
    
    const gQL = "reference" === props.name ? //This is a standalone ReferenceSelect for Reference edit/delete
        gql`
            query {
                Reference {
                    pbotID
                    title
                    publicationType
                    firstPage
                    lastPage
                    journal
                    bookTitle
                    publicationVolume
                    publicationNumber
                    publisher
                    description
                    bookType
                    editors
                    notes
                    year
                    doi
                    pbdbid
                    authoredBy (orderBy: order_asc) {
                        Person {
                            pbotID
                            given
                            surname
                        }
                        order
                    }
                    elementOf {
                        name
                        pbotID
                    }
                }            
            }
        ` : //This is one of possibly several ReferenceSelects in ReferenceManager
        gql`
            query  ($excludeList: [ID!]){
                Reference (filter: {pbotID_not_in: $excludeList}){
                    pbotID
                    title
                    year
                }            
            }
        `;

       //For ReferenceManager applications, omit references that are already in the list
        const excludeIDs = props.exclude ? props.exclude.map(reference => reference.pbotID) : [];

        const { loading: loading, error: error, data: data } = useQuery(gQL, {        
            variables: {
                excludeList: excludeIDs
            },
            fetchPolicy: "cache-and-network"
        });

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
                                    
        console.log(data.Reference);
        
        //const references = alphabetize([...data.Reference], "title");
        const references = alphabetize(
            data.Reference.map(reference => {
                const newRef = {...reference};
                console.log(newRef);

                newRef.name = reference.title + ", " + reference.year;
                return newRef;
            }), 
        "name");
        console.log(references)
        
        const style = {minWidth: "12ch"}
        return "reference" === props.name ? //This is a standalone ReferenceSelect for Reference edit/delete
            (
                <Field
                    style={style}
                    component={TextField}
                    type="text"
                    name="reference"
                    label="Reference"
                    fullWidth 
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    disabled={false}
                    onChange={(event,child) => {
                        props.handleSelect(JSON.parse(child.props.dreference))
                    }}
                >
                    {references.map((reference) => (
                        <MenuItem 
                            key={reference.pbotID} 
                            value={reference.pbotID}
                            dreference={JSON.stringify(reference)}
                        >{reference.title + ", " + reference.year}</MenuItem>
                    ))}
                </Field>
            )            
        : //This is one of possibly several ReferenceSelects in ReferenceManager
            (
                <Field
                    component={TextField}
                    type="text"
                    name={props.name || "references"}
                    label="Title"
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    onChange={(event, child) => {
                        props.handleSelect(JSON.parse(child.props.dreference))
                    }}
                    disabled={false}
                >
                    {references.map((reference) => (
                        <MenuItem 
                            key={reference.pbotID} 
                            value={reference.pbotID}
                            dreference={JSON.stringify(reference)}
                        >{reference.name}</MenuItem>
                    ))}
                </Field>
            )
}


const ReferenceDialog = (props) => {
    const [references, setReferences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [populateAll, setPopulateAll] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [queryParams, setQueryParams] = useState([]);

    const handleSubmit = (values) => {
        setQueryParams(values);
        setShowResult(true);
    }

    return (
        <Dialog fullWidth={true} open={props.open}>
        <DialogTitle>
            Search for Reference             
        </DialogTitle>
        <DialogContent>
            {!showResult &&
            <ReferenceQueryForm handleSubmit={handleSubmit}/>
            }
            {showResult &&
            <ReferenceQueryResults queryParams={queryParams} exclude={props.exclude} select={true} handleSelect={props.handleSelect}/>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export const ReferenceSelect = (props) => {
    console.log("ReferenceSelect");
    console.log(props.name)
    console.log(props.values)

    const global = useContext(GlobalContext);
    const formikProps = useFormikContext()

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (reference) => {
        console.log("handleSelect")
        console.log(reference);
        console.log(reference.pbotID)

        formikProps.setFieldValue(props.name, reference.pbotID);
        
        if ("reference" === props.name) { //Standalone ReferenceSelect
            const authors = reference.authoredBy ? reference.authoredBy.map(author => {return {pbotID: author.Person.pbotID, order: author.order, searchName: author.Person.surname || ''}}) : [];
            
            const groups = reference.elementOf ? reference.elementOf.map(group => {return group.pbotID}) : [];
            console.log(groups)

            formikProps.setFieldValue("pbdbid", reference.pbdbid || '');
            formikProps.setFieldValue("year", reference.year || '');
            formikProps.setFieldValue("title", reference.title || '');
            formikProps.setFieldValue("publicationType", reference.publicationType || '');
            formikProps.setFieldValue("firstPage", reference.firstPage || '');
            formikProps.setFieldValue("lastPage", reference.lastPage || '');
            formikProps.setFieldValue("journal", reference.journal || '');
            formikProps.setFieldValue("bookTitle", reference.bookTitle || '');
            formikProps.setFieldValue("publicationVolume", reference.publicationVolume || '');
            formikProps.setFieldValue("publicationNumber", reference.publicationNumber || '');
            formikProps.setFieldValue("publisher", reference.publisher || '');
            formikProps.setFieldValue("description", reference.description || '');
            formikProps.setFieldValue("bookType", reference.bookType || '');
            formikProps.setFieldValue("editors", reference.editors || '');
            formikProps.setFieldValue("notes", reference.notes || '');
            formikProps.setFieldValue("doi", reference.doi || '');
            formikProps.setFieldValue("authors", authors);
            formikProps.setFieldValue("groups", groups);
            formikProps.setFieldValue("public", groups.includes(global.publicGroupID));
        } else {
            formikProps.setFieldValue(props.name.replace(/\.pbotID$/, ".order"), (props.maxOrder+1).toString() )
        }

        setOpen(false);
    };

    return (
        <Stack direction="row" key={props.name}>
            <IconButton
                color="secondary" 
                size="large"
                onClick={()=>{setOpen(true)}}
                disabled={false}
            >
                <SearchIcon/>
            </IconButton>
            {open &&
                <ReferenceDialog open={open} handleClose={handleClose} handleSelect={handleSelect} exclude={props.exclude} />
            }
            <InnerReferenceSelect name={props.name} exclude={props.exclude} handleSelect={handleSelect}/>
        </Stack>
    );
}