import React, { useState }from 'react';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails, Typography, Stack } from '@mui/material';
import { alphabetize } from '../../util.js';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { TextFieldController } from '../util/TextFieldController';
import { SelectController } from '../util/SelectController.jsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CollectionGroupMutateForm = ({handleSubmit: hSubmit, mode}) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const fetchData = async (cgID) => {
        console.log("fetchData");
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(new URL(`api/v1/dicts/collection_groups/${cgID}`, process.env.REACT_APP_AZLIB_API_URL));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let json = await response.json();
            console.log(JSON.parse(JSON.stringify(json)));
            
            console.log("massaged data:");
            console.log(json.data.metadata);

            const initValues = {
                cg: cgID,
                name: json.data.name,
                desc: json.data.desc,
                abbrv: json.data.abbrv,
                mode: mode,
            }

            reset(initValues, {keepDefaultValues: true});
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    }

    const FetchStatus = () => {
        if (loading) {
            return <Typography variant="body1">Loading...</Typography>;
        }

        if (error) {
            return <Typography color="error" variant="caption">Error accessing API: {error.message}</Typography>;
        }
    }

    const initValues = {
                cg: '',
                name: '',
                desc: '',
                abbrv: '',
                mode: mode,
    };
    const validationSchema=Yup.object().shape({
        name: Yup.string().required('Name is required'),
        desc: Yup.string().required('Description is required'),
        abbrv: Yup.string().required('Abbreviation is required'),
    });

    const { handleSubmit, reset, control, watch, formState: {errors} } = useForm({
        defaultValues: initValues,
        //resolver: yupResolver(validationSchema),
        resolver: mode === "delete" ? yupResolver(deleteValidationSchema) : yupResolver(validationSchema),
        mode: "onBlur",
        trigger: "onBlur",
      });

    const resetForm = (initialValues = initValues, props) => {
        //Add random value to ensure results are not retained (e.g. useEffect in Mutator is contingent on this value)
        initialValues.random = Math.random();
        reset(initialValues, props);
    }
    
    const doSubmit = async (data) => {
        console.log("doSubmit")
        console.log(JSON.parse(JSON.stringify(data)))
        data.mode = mode;
        await hSubmit(data);
        resetForm();
    }
    
    //To clear form when mode changes 
    React.useEffect(() => {
            resetForm();
    },[mode]);
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "100%"}
    return (
       
        <form onSubmit={handleSubmit(doSubmit)} >
            <input 
                name="mode" 
                type="hidden" 
                disabled={false}
            />
            
            {(mode === "edit" || mode === "delete") &&
                <div>
                    <SelectController 
                        name="cg"
                        label="Existing collection group" 
                        options={{
                            //url: "https://data.azgs.arizona.edu/api/v1/dicts/collection_groups",
                            path: "api/v1/dicts/collection_groups",
                            nameField: "name",
                            valueField: "id"
                        }} 
                        control={control} 
                        errors={errors} 
                        style={{minWidth: "12ch", marginTop: "1em", width:"75%"}} variant="standard"
                        onChange={(e) => {
                            console.log("onChange")
                            console.log(e)
                            fetchData(e.target.value);
                        }}
                    />
                    <br />
                    <FetchStatus/>

                    <br />
                    <br />
                 </div>
            }
                                
            {(mode === "create" || ((mode === "edit" || mode === "replace") /*&& control._formValues.collection !== ''*/)) &&
                <>
                <Accordion style={accstyle} defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Required fields
                    </AccordionSummary>
                    <AccordionDetails>
                    
                        <TextFieldController name={`name`} label="Name" control={control} errors={errors}/>
                        <br />

                        <TextFieldController name={`desc`} label="Description" control={control} errors={errors}/>
                        <br />

                        <TextFieldController name={`abbrv`} label="Abbreviation" control={control} errors={errors} disabled={mode === "edit"}/>
                        <br />
                        <br />

                    </AccordionDetails>
                </Accordion>
                <br />
                <br />
                </>
            }
            <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                    <Button type="reset" variant="outlined" color="secondary" onClick={() => {resetForm()}}>Reset</Button>
            </Stack>
            <br />
            <br />
            
        </form>
    
    );
};

export default CollectionGroupMutateForm;
