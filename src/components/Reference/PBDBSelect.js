import React, { useState, useEffect }from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import SearchIcon from '@mui/icons-material/Search';
import { responsePathAsArray } from 'graphql';


const PBDBDialog = (props) => {
    const [references, setReferences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [populateAll, setPopulateAll] = useState(false);

    useEffect(() => {
        setLoading(true);
        let url = props.values.pbdbid ?
            `https://paleobiodb.org/data1.2/refs/single.json?id=${props.values.pbdbid}&show=both&vocab=bibjson` :
            "https://paleobiodb.org/data1.2/refs/list.json?show=both&vocab=bibjson" 
        if (!props.values.pbdbid) {
            url = props.values.title ? `${url}&ref_title=${props.values.title}` : url;
            url = props.values.year ? `${url}&ref_pubyr=${props.values.year}` : url;
            url = props.values.doi ? `${url}&ref_doi=${props.values.doi}` : url;
            //url = props.values.authors.length > 0 ? `${url}&ref_author=${props.values.authors[0].surname}` : url;
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
                setReferences(response.records.map(ref => { //strip off annoying "ref:"
                    return {
                        ...ref,
                        id: ref.id.slice(4),
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
        <DialogTitle>Select PBDB Reference</DialogTitle>
        <DialogContent>
            {loading && (
                "Loading..."
            )}
            {error && (
                `Error from PBDB: ${error}`
            )}
            {!loading && !error && references.length === 0 && (
                "No references found"
            )}
            {!loading && !error && references.length > 0 && (
                <List sx={{ pt: 0 }}>
                    {references.map((reference) => (
                        <ListItem disableGutters key={reference.id}>
                            <ListItemButton onClick={() => props.handleSelect(reference, populateAll)} >
                                <ListItemText 
                                primary={reference._formatted} secondary={`pbdb id: ${reference.id}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </DialogContent>
        <DialogActions>
            <FormControlLabel 
                control={
                    <Checkbox onChange={(event) => {setPopulateAll(event.target.checked)}}/>
                } 
                label="Populate all fields" />
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )    
}

export default function PBDBSelect(props) {
    console.log("PBDBSelectDialog");
    console.log(props.values)

    const formikProps = useFormikContext()

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (value, populateAll) => {
        console.log("click")
        console.log(value);
        console.log(value.id)
        console.log(formikProps)
        formikProps.setFieldValue("pbdbid", value.id);
        if (populateAll) {
            formikProps.setFieldValue("year", value.year);
            formikProps.setFieldValue("title", value.title);
        }
        setOpen(false);
    };


    return (
        <div>
            <Grid container spacing={2} direction="row">
                <Grid item xs={5}>
                    <Field
                        component={TextField}
                        type="text"
                        name="pbdbid"
                        label="PBDB ID"
                        fullWidth 
                        disabled={false}
                        value={formikProps.values.pbdbid} 
                        onChange={formikProps.handleChange}
                    />
                </Grid>
                <Grid item xs={1}>
                    
                    <IconButton
                        color="secondary" 
                        size="large"
                        onClick={()=>{setOpen(true)}}
                        sx={{width:"50px"}}
                        disabled={!((formikProps.values.title && formikProps.values.year) || formikProps.values.doi)}

                    >
                        <SearchIcon/>
                    </IconButton>
                    {open &&
                        <PBDBDialog open={open} handleClose={handleClose} handleSelect={handleSelect} values={formikProps.values}/>
                    }
                </Grid>
            </Grid>
        </div>
    );
}