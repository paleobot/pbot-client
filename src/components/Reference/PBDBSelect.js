import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControlLabel, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Tooltip, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { sort } from '../../util';


const PBDBDialog = (props) => {
    const [references, setReferences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [populateAll, setPopulateAll] = useState(false);

    useEffect(() => {
        setLoading(true);
        let url = props.values.pbdbid ?
            `https://paleobiodb.org/data1.2/refs/single.json?id=${props.values.pbdbid}&show=both&vocab=bibjson` :
            "https://paleobiodb.org/data1.2/refs/list.json?show=both&vocab=bibjson&limit=100" 
        if (!props.values.pbdbid) {
            url = props.values.publicationType === "journal article" ? `${url}&pub_type=journal article` : url;
            url = props.values.publicationType === "standalone book" ? `${url}&pub_type=book, serial monograph, compendium, Ph.D. thesis, M.S. thesis, guidebook` : url;
            url = props.values.publicationType === "edited book of contributed articles" ? `${url}&pub_type=book` : url;
            url = props.values.publicationType === "contributed article in edited book" ? `${url}&pub_type=book/book chapter` : url;
            url = props.values.publicationType === "unpublished" ? `${url}&pub_type=unpublished` : url;
            url = props.values.title ? `${url}&ref_title=%${props.values.title}%` : url;
            url = props.values.year ? `${url}&ref_pubyr=${props.values.year}` : url;
            url = props.values.doi ? `${url}&ref_doi=${props.values.doi}` : url;
            url = props.values.journal || props.values.bookTitle ? `${url}&pub_title=${props.values.journal ? props.values.journal : props.values.bookTitle}` : url;
            const authors = sort(props.values.authors, "#order").reduce((str, author, idx) => {
                return idx === 0 ? 
                    author.searchName : 
                    idx === 1 ?
                        `${str} and ${author.searchName}` :
                    str;
            }, '');
            url = props.values.authors.length > 0 ? `${url}&ref_author=${authors}` : url;
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
        <DialogTitle>
            Select PBDB Reference             
        </DialogTitle>
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
            {!loading && !error && (
                <Typography variant="h6" align="center">
                    <br />
                    Don't see what you're looking for? <br />
                    <Tooltip title="Search on PBDB site">
                        <Link 
                            sx={{width:"50px"}} 
                            color="secondary" 
                            underline="hover" 
                            href="https://paleobiodb.org/classic/displaySearchRefs?type=view"  
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
                    <Checkbox disabled={references.length === 0} onChange={(event) => {setPopulateAll(event.target.checked)}}/>
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

    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => {
        formikProps.setFieldValue("pbdbCheck", true);
        setOpen(false);
    };

    const handleSelect = (reference, populateAll) => {
        console.log("click")
        console.log(reference);
        console.log(reference.id)
        console.log(formikProps)
        formikProps.setFieldValue("pbdbid", reference.id);
        if (populateAll) {
            formikProps.setFieldValue("year", reference.year);
            formikProps.setFieldValue("title", reference.title);
            formikProps.setFieldValue("journal", reference.journal)
            formikProps.setFieldValue("bookTitle", reference.booktitle);
            formikProps.setFieldValue("publicationVolume", reference.volume);
            formikProps.setFieldValue("publicationNumber", reference.number);
            //formikProps.setFieldValue("editors", reference.editor);
            formikProps.setFieldValue("notes", reference._comments);
            if (reference.pages) {
                const pages = reference.pages.split("--");
                if (pages.length === 2)
                formikProps.setFieldValue("firstPage", pages[0]);
                formikProps.setFieldValue("lastPage", pages[1]);
            }
            formikProps.setFieldValue("doi", (reference.identifier && reference.identifier.type === "doi") ? reference.identifier.id : null);
        }
        handleClose();
    };


    return (
        <>
            <Tooltip title="Search PBDB using data from this form (only enabled when a searchable field is populated)."><span>
                <IconButton
                    color="secondary" 
                    size="large"
                    onClick={()=>{setOpen(true)}}
                    sx={{width:"50px"}}
                    disabled={!(formikProps.values.publicationType || formikProps.values.title || formikProps.values.journal || formikProps.values.bookTitle ||formikProps.values.year || formikProps.values.doi || formikProps.values.pbdbid || formikProps.values.authors[0].searchName)}

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