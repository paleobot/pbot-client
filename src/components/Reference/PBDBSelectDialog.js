import React, { useState }from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import SearchIcon from '@mui/icons-material/Search';

const queryPBDB = (setPBDBResult, props) => {
    console.log("queryPBDB")
    //setPBDBResult(["Hi there"]);
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
        (result) => {
            console.log(result.records);
            setPBDBResult(result.records)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            alert(error)
        }
      )
}

export default function PBDBSelectDialog(props) {
    console.log("PBDBSelectDialog");
    console.log(props.values)

    const formikProps = useFormikContext()

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const [references, setReferences] = useState([]);
    const setPBDBResult = (references) => {
        setReferences(references.map(ref => {
            return {
                ...ref,
                id: ref.id.slice(4),
            }
        }));
        setOpen(true);
    }
      
    
    const handleListItemClick = (value) => {
        console.log("click")
        console.log(value);
        console.log(value.id)
        console.log(formikProps)
        formikProps.setFieldValue("pbdbid", value.id);
        formikProps.setFieldValue("year", value.year);
        formikProps.setFieldValue("title", value.title);
        //props.values.pbdbid = value.id;
        //props.values.year = value.year;
        //props.values.title = value.title;
        handleClose(value);
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
                        value={formikProps.values.pbdbid} // or whatever the value is
                        onChange={formikProps.handleChange}
                    />
                </Grid>
                <Grid item xs={1}>
                    
                    <IconButton
                        color="secondary" 
                        size="large"
                        onClick={()=>{queryPBDB(setPBDBResult, formikProps)}}
                        sx={{width:"50px"}}
                        disabled={!((formikProps.values.title && formikProps.values.year) || formikProps.values.doi)}

                    >
                        <SearchIcon/>
                    </IconButton>
                    <Dialog fullWidth={true} open={open} onClose={handleClose}>
                        <DialogTitle>Select PBDB Reference</DialogTitle>
                        <DialogContent>
                        <List sx={{ pt: 0 }}>
                            {references.map((reference) => (
                                <ListItem disableGutters key={reference.id}>
                                    <ListItemButton onClick={() => handleListItemClick(reference)} >
                                        <ListItemText 
                                         primary={reference._formatted} secondary={`pbdb id: ${reference.id}`} />
                                    </ListItemButton>
                                </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </div>
    );
}