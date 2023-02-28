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

const WKTBuffer = (lat, lon) => {
    console.log("WKTBuffer")
    const lt = parseFloat(lat);
    const ln = parseFloat(lon)
    const buffered = buffer(point([ln, lt]), 0.2, {units: 'degrees'});
    const wkt = wkx.Geometry.parseGeoJSON(buffered.geometry).toWkt();
    return wkt;
}

const PBDBDialog = (props) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [populateAll, setPopulateAll] = useState(false);

    useEffect(() => {
        setLoading(true);
        let url = props.values.pbdbid ?
            `https://paleobiodb.org/data1.2/colls/single.json?id=${props.values.pbdbid}&show=full&vocab=pbdb` :
            "https://paleobiodb.org/data1.2/colls/list.json?show=full&vocab=pbdb" 
        if (!props.values.pbdbid) {
            url = props.values.name ? `${url}&coll_match=%${props.values.name}%` : url;
            url = props.values.lat && props.values.lon ? `${url}&loc=${WKTBuffer(props.values.lat, props.values.lon)}` : url;
            /* for specimens and references?
            const authors = alphabetize(props.values.authors, "order").reduce((str, author, idx) => {
                return idx === 0 ? 
                    author.searchName : 
                    idx === 1 ?
                        `${str} and ${author.searchName}` :
                    str;
            }, '');
            url = props.values.authors.length > 0 ? `${url}&ref_author=${authors}` : url;
            */
            console.log(props.values)
            console.log(props.values.authors)
        }
        console.log(url);
        
        //fetch("https://paleobiodb.org/data1.2/refs/single.json?id=6930&show=both&vocab=bibjson")
        fetch(url)
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                setCollections(response.records.map(coll => { //strip off annoying "ref:"
                    return {
                        ...coll,
                        //id: coll.id.slice(4),
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
            Select PBDB Collection            
        </DialogTitle>
        <DialogContent>
            {loading && (
                "Loading..."
            )}
            {error && (
                `Error from PBDB: ${error}`
            )}
            {!loading && !error && collections.length === 0 && (
                "No collections found"
            )}
            {!loading && !error && collections.length > 0 && (
                <List sx={{ pt: 0 }}>
                    {collections.map((collection) => (
                        <ListItem disableGutters key={collection.collection_no}>
                            <ListItemButton onClick={() => props.handleSelect(collection, populateAll)} >
                                <ListItemText 
                                primary={`${collection.collection_name} (${collection.collection_aka})`} secondary={`pbdb id: ${collection.collection_no}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
            {!loading && !error && (
                <Typography variant="h6" align="center">
                    <br />
                    Don't see what you're looking for? <br />
                    <Tooltip title="Search on PBDB site">
                        <Link 
                            sx={{width:"50px"}} 
                            color="secondary" 
                            underline="hover" 
                            href="https://paleobiodb.org/classic/displaySearchColls?type=view"  
                            target="_blank"
                        >
                            Search directly on the PBDB site.
                        </Link>
                    </Tooltip>
                </Typography>
            )}
        </DialogContent>
        <DialogActions>
            <Tooltip title="Populate other fields in the form as well as the PBDB ID field (Note: Authors requires manual entry).">
            <FormControlLabel 
                control={
                    <Checkbox disabled={collections.length === 0} onChange={(event) => {setPopulateAll(event.target.checked)}}/>
                } 
                label="Populate all fields" />
            </Tooltip>
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export default function PBDBSelect(props) {
    console.log("PBDBSelect");
    console.log(props.values)

    const formikProps = useFormikContext()

    if (formikProps.values.lat && formikProps.values.lon) {
        WKTBuffer(formikProps.values.lat, formikProps.values.lon)
    }

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (collection, populateAll) => {
        console.log("click")
        console.log(collection);
        console.log(collection.collection_no)
        console.log(formikProps)
        formikProps.setFieldValue("pbdbid", collection.collection_no);
        if (populateAll) {
            //formikProps.setFieldValue("year", reference.year);
            formikProps.setFieldValue("name", collection.collection_name);
            formikProps.setFieldValue("lat", collection.lat);
            formikProps.setFieldValue("lon", collection.lng);
            //formikProps.setFieldValue("publisher", reference.journal || reference.booktitle);
            //formikProps.setFieldValue("doi", (reference.identifier && reference.identifier.type === "doi") ? reference.identifier.id : null);
        }
        setOpen(false);
    };


    return (
        <>
            <Tooltip title="Search PBDB using data from this form (only enabled when a searchable field is populated)."><span>
                <IconButton
                    color="secondary" 
                    size="large"
                    onClick={()=>{setOpen(true)}}
                    sx={{width:"50px"}}
                    disabled={!(formikProps.values.name || formikProps.values.pbdbid || (formikProps.values.lat && formikProps.values.lon))}

                >
                    <SearchIcon/>
                </IconButton>
            </span></Tooltip>
            {open &&
                <PBDBDialog open={open} handleClose={handleClose} handleSelect={handleSelect} values={formikProps.values}/>
            }
        </>
    );
}