import * as React from 'react';
import { useFormikContext } from 'formik';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const LinkDialog = (props) => {
    const [open, setOpen] = React.useState(false);
    const [link, setLink] = React.useState('');
    const {setFieldValue} = useFormikContext();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setFieldValue("link", link);
        setOpen(false);
    };

    return (
        <div>
        <Button color="secondary" onClick={handleClickOpen}>
            Link
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Enter link</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Enter a URL to an image.
            </DialogContentText>
            <TextField
                id="link"
                name="link"
                fullWidth
                value={link}
                onChange={(e) => {setLink(e.target.value)}}
            />
            </DialogContent>
            <DialogActions>
            <Button color="secondary" onClick={handleClose}>Cancel</Button>
            <Button color="secondary" onClick={handleClose}>Enter</Button>
            </DialogActions>
        </Dialog>
        </div>
    );  
};

export default LinkDialog;
