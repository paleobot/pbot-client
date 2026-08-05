import React, { useState, useEffect }from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Link, List, ListItem, ListItemButton, ListItemText, Tooltip, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

const GBIFDialog = (props) => {
    console.log("GBIFDialog")
    const [occurrences, setOccurrences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log(props.values)

    useEffect(() => {
        setLoading(true);

        //Convenient test url: https://api.gbif.org/v1/occurrence/search?catalogNumber=100
        let url = `https://api.gbif.org/v1/occurrence/search?catalogNumber=${encodeURIComponent(props.values.name)}`;
        console.log(url);

        fetch(url)
        .then(res => res.json())
        .then(
            (response) => {
                console.log(response);
                setLoading(false);
                if (response.results) {
                    setOccurrences(response.results.map(occurrence => {
                        return {
                            ...occurrence,
                        }
                    }))
                } else {
                    throw new Error(response.message ? response.message : "Unexpected response from GBIF");
                }
            }
        ).catch (
            (error) => {
                console.log("error!")
                console.log(error)
                setLoading(false);
                setError(error)
            }
        )

    }, [])

    return (
        <Dialog fullWidth={true} open={props.open}>
        <DialogTitle>
            Select GBIF Occurrence
        </DialogTitle>
        <DialogContent>
            {loading && (
                "Loading..."
            )}
            {error && (
                `Error from GBIF: ${error}`
            )}
            {!loading && !error && occurrences.length === 0 && (
                "No occurrences found"
            )}
            {!loading && !error && occurrences.length > 0 && (
                <List sx={{ pt: 0 }}>
                    {occurrences.map((occurrence) => (
                        <ListItem disableGutters key={occurrence.key}>
                            <ListItemButton onClick={() => props.handleSelect(occurrence)} >
                                <ListItemText
                                primary={`${occurrence.scientificName}, ${occurrence.institutionCode}, ${occurrence.catalogNumber}, ${occurrence.country}, ${occurrence.year}`} secondary={`key: ${occurrence.key}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
            {!loading && !error && (
                <Typography variant="h6" align="center">
                    <br />
                    Don't see what you're looking for? <br />
                    <Tooltip title="Search on GBIF site">
                        <Link
                            sx={{width:"50px"}}
                            color="secondary"
                            underline="hover"
                            href="https://www.gbif.org/occurrence/search"
                            target="_blank"
                        >
                            Search directly on the GBIF site.
                        </Link>
                    </Tooltip>
                </Typography>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
    )
}

export default function GBIFSelect(props) {
    console.log("GBIFSelect");

    const formikProps = useFormikContext()
    console.log(formikProps.values);

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (occurrence) => {
        console.log("click")
        console.log(occurrence);
        console.log(formikProps)

        formikProps.setFieldValue("gbifID", occurrence.key ? occurrence.key.toString() : '');

        setOpen(false);
    };


    return (
        <>
            <Tooltip title="Search GBIF using the specimen number from this form (only enabled when the specimen number is populated)."><span>
                <IconButton
                    color="secondary"
                    size="large"
                    onClick={()=>{setOpen(true)}}
                    sx={{width:"50px"}}
                    disabled={!formikProps.values.name}
                >
                    <ManageSearchIcon/>
                </IconButton>
            </span></Tooltip>
            {open &&
                <GBIFDialog open={open} handleClose={handleClose} handleSelect={handleSelect} values={formikProps.values}/>
            }
        </>
    );
}
