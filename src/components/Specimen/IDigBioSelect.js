import React, { useState, useEffect }from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox, FormControlLabel, Grid, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Tooltip, Typography } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import SearchIcon from '@mui/icons-material/Search';
import { responsePathAsArray } from 'graphql';
import { alphabetize } from '../../util';
import buffer from '@turf/buffer'; 
import { point } from '@turf/helpers';
import wkx from 'wkx'

const IDigBioDialog = (props) => {
    console.log("IDigBioDialog")
    const [specimens, setSpecimens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [populateAll, setPopulateAll] = useState(true);

    console.log(props.values)

    useEffect(() => {
        setLoading(true);
        let url = props.values.idigbiouuid ?
            `https://search.idigbio.org/v2/search/records?rq={"uuid":"${props.values.idigbiouuid}"}` :
            `https://search.idigbio.org/v2/search/records/?rq={"data.dwc:catalogNumber":"${props.values.idigbioCatalogNumber}","data.dwc:institutionCode":"${props.values.idigbioInstitutionCode}"}` 
        /*
        if (!props.values.pbdbid) {
            url = props.values.name ? `${url}&coll_match=%${props.values.name}%` : url;
            url = props.values.lat && props.values.lon ? `${url}&loc=${WKTBuffer(props.values.lat, props.values.lon)}` : url;
            console.log(props.values)
            console.log(props.values.authors)
        }
        */
        console.log(url);
        
        //fetch("https://paleobiodb.org/data1.2/refs/single.json?id=6930&show=both&vocab=bibjson")
        fetch(url)
        .then(res => res.json())
        .then(
            (response) => {
                console.log(response);
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                setSpecimens(response.items.map(specimen => { 
                    return {
                        ...specimen,
                    }
                }))
            }
        ).catch (
            (error) => {
                console.log("error!")
                console.log(error)
                setError(error)
            }
        )

    }, [])

    return (
        <Dialog fullWidth={true} open={props.open}>
        <DialogTitle>
            Select iDigBio Specimen            
        </DialogTitle>
        <DialogContent>
            {loading && (
                "Loading..."
            )}
            {error && (
                `Error from iDigBio: ${error}`
            )}
            {!loading && !error && specimens.length === 0 && (
                "No specimens found"
            )}
            {!loading && !error && specimens.length > 0 && (
                <List sx={{ pt: 0 }}>
                    {specimens.map((specimen) => (
                        <ListItem disableGutters key={specimen.uuid}>
                            <ListItemButton onClick={() => props.handleSelect(specimen, populateAll)} >
                                <ListItemText 
                                primary={`${specimen.indexTerms.scientificname}, ${specimen.indexTerms.commonname}, ${specimen.indexTerms.stateprovince}, ${specimen.indexTerms.country}, ${specimen.indexTerms.datecollected}`} secondary={`uuid: ${specimen.uuid}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
            {!loading && !error && (
                <Typography variant="h6" align="center">
                    <br />
                    Don't see what you're looking for? <br />
                    <Tooltip title="Search on iDigBio site">
                        <Link 
                            sx={{width:"50px"}} 
                            color="secondary" 
                            underline="hover" 
                            href="https://www.idigbio.org/portal/search"  
                            target="_blank"
                        >
                            Search directly on the iDigBio site.
                        </Link>
                    </Tooltip>
                </Typography>
            )}
        </DialogContent>
        <DialogActions>
            {/*
            <Tooltip title="Populate other fields in the form as well as the PBDB ID field (Note: Authors requires manual entry).">
            <FormControlLabel 
                control={
                    <Checkbox disabled={specimens.length === 0} onChange={(event) => {setPopulateAll(event.target.checked)}}/>
                } 
                label="Populate all fields" />
            </Tooltip>
            */}
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export default function IDigBioSelect(props) {
    console.log("IDigBioSelect");
    console.log(props.values)

    const formikProps = useFormikContext()
    console.log(formikProps.values);

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (specimen, populateAll) => {
        console.log("click")
        console.log(populateAll)
        console.log(specimen);
        console.log(formikProps)
        
        formikProps.setFieldValue("idigbiouuid", specimen.uuid);
        if (populateAll) {
            //formikProps.setFieldValue("year", reference.year);
            formikProps.setFieldValue("idigbioInstitutionCode", specimen.indexTerms.institutioncode);
            formikProps.setFieldValue("idigbioCatalogNumber", specimen.indexTerms.catalognumber);
        }
        
        setOpen(false);
    };


    return (
        <>
            <Tooltip title="Search iDigBio using data from this form (only enabled when a searchable field is populated)."><span>
                <IconButton
                    color="secondary" 
                    size="large"
                    onClick={()=>{setOpen(true)}}
                    sx={{width:"50px"}}
                    disabled={!(formikProps.values.idigbiouuid || (formikProps.values.idigbioInstitutionCode && formikProps.values.idigbioCatalogNumber))}

                >
                    <SearchIcon/>
                </IconButton>
            </span></Tooltip>
            {open &&
                <IDigBioDialog open={open} handleClose={handleClose} handleSelect={handleSelect} values={formikProps.values}/>
            }
        </>
    );
}