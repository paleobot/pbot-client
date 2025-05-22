import { Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import React from 'react';
import About from './About/About';
import { useAuth } from './AuthContext';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';

const Query = ({handleSubmit, selectedForm, handleFormChange, setShowResult}) => {

    //This annoying bit of razzle-dazzle is to force MUI RadioGroup to reset when the path is just "/query".
    //Without this, if we had selected a form then navigated somewhere else then navigated back via an
    //Explore button, the radio button was still set. I could find no graceful way to fix this, so...
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const FormSelector = (form, reset) => {
        if (!form) {
            reset();
        };
        return (
            <FormControl component="fieldset">
                <RadioGroup aria-label="form" name="form1" value={selectedForm} onChange={handleFormChange}>
                <FormControlLabel value="changes" control={<Radio />} label="Changes" labelPlacement="end"/>
                </RadioGroup>
            </FormControl>  
        );    
    }

    const [token, setToken] = useAuth();

    if(!token) {
        return (<p>Explore access requires authentication</p>)
    }

    return (
        <Grid container spacing={3} style={{marginLeft:"10px", marginTop: "5px"}}>
            <Grid item>
                <FormSelector form={selectedForm} reset={forceUpdate} />
            </Grid>
            
            <Grid item xs>
                {selectedForm && <Typography variant="h5">Search parameters</Typography>}

                {selectedForm === "changes" &&
                <>
                    <About />
                    {/*<ChangeQueryForm handleSubmit={handleSubmit} />*/}
                </>
                }

               
            </Grid>
        </Grid>
  );
};

export default Query;
