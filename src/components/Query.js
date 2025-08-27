import React, { useState } from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid, Divider, Typography } from '@mui/material';
//import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import OTUQueryForm from './OTU/OTUQueryForm';
import SpecimenQueryForm from './Specimen/SpecimenQueryForm';
import ReferenceQueryForm from './Reference/ReferenceQueryForm';
import SchemaQueryForm from './Schema/SchemaQueryForm';
import PersonQueryForm from './Person/PersonQueryForm';
import CollectionQueryForm from './Collection/CollectionQueryForm';

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
                <FormControlLabel value="otu" control={<Radio />} label="Taxon (OTU)" labelPlacement="end"/>
                <FormControlLabel value="collection" control={<Radio />} label="Collection" labelPlacement="end"/>
                <FormControlLabel value="specimen" control={<Radio />} label="Specimen" labelPlacement="end"/>
                <Divider />
                <FormControlLabel value="reference" control={<Radio />} label="Reference" labelPlacement="end"/>
                <FormControlLabel value="schema" control={<Radio />} label="Schema" labelPlacement="end" />
                <Divider />
                <FormControlLabel value="person" control={<Radio />} label="Person" labelPlacement="end"/>
                </RadioGroup>
            </FormControl>  
        );    
    }
    
    return (
        <Grid container spacing={3} style={{marginLeft:"10px", marginTop: "5px"}}>
            <Grid item>
                <FormSelector form={selectedForm} reset={forceUpdate} />
            </Grid>
            
            <Grid item xs>
                {selectedForm && <Typography variant="h5">Search parameters</Typography>}

                {selectedForm === "otu" &&
                    <OTUQueryForm handleSubmit={handleSubmit} />
                }
                    
                {selectedForm === "collection" &&
                    <CollectionQueryForm handleSubmit={handleSubmit} />
                }

                {selectedForm === "specimen" &&
                    <SpecimenQueryForm handleSubmit={handleSubmit} />
                }

                {selectedForm === "reference" &&
                    <ReferenceQueryForm handleSubmit={handleSubmit} />
                }

                {selectedForm === "schema" &&
                    <SchemaQueryForm handleSubmit={handleSubmit} />
                }

                {selectedForm === "person" &&
                    <PersonQueryForm handleSubmit={handleSubmit} />
                }
                
            </Grid>
        </Grid>
  );
};

export default Query;
