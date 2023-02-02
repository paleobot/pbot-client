import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export default function PBDBSelectDialog(props) {
    console.log("PBDBSelectDialog");
    const { onClose, references, open } = props;
    console.log(references);

    const handleClose = () => {
      onClose();
    };
  
    
    const handleListItemClick = (value) => {
      onClose(value);
    };


    return (
        <div>
        <Dialog fullWidth={true} open={open} onClose={handleClose}>
            <DialogTitle>Select PBDB Reference</DialogTitle>
            <DialogContent>
            <List sx={{ pt: 0 }}>
                {references.map((reference) => (
                    <ListItem disableGutters>
                        <ListItemButton onClick={() => handleListItemClick(reference)} key={reference.oid}>
                            <ListItemText primary={reference.tit} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}