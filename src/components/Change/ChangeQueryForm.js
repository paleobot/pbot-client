import React, { useState }from 'react';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, Stack } from '@mui/material';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LabeledCheckboxController } from '../util/LabeledCheckboxController';
import { SelectController } from '../util/SelectController';
import { TextFieldController } from '../util/TextFieldController';

const ChangeQueryForm = ({handleSubmit: hSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
        changeID: '', 
        search: '', 
        status: 'all',
        private: false, 
    };
    const validationSchema=Yup.object().shape({
        search: Yup.string(),
        status: Yup.string(),//.oneOf(['','completed', 'uncompleted', 'failed', 'all']),
        private: Yup.boolean(),
    });

    const { handleSubmit, reset, control, watch, formState: {errors} } = useForm({
        defaultValues: initValues,
        resolver: yupResolver(validationSchema),
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
        await hSubmit(data);
        resetForm();
    }
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <form onSubmit={handleSubmit(doSubmit)} >
            <TextFieldController name={`search`} label="Search processing notes" control={control} merrors={errors}/>
            <br />

            <SelectController 
                name="status"
                label="Status" 
                options={[
                    {name: 'completed', value: 'completed'},
                    {name: 'uncompleted', value: 'uncompleted'},
                    {name: 'failed', value: 'failed'},
                    {name: 'all', value: 'all'},
                ]}
                //includeEmptyOption={true}
                control={control} 
                errors={errors} 
                style={{minWidth: "12ch", marginTop: "1em", width:"75%"}} variant="standard"
            />
            <br />

            <LabeledCheckboxController name={`private`} label="Private" control={control} errors={errors} size="large" />
            <br />

            <br />
            <br />

            <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <Button type="reset" variant="outlined" color="secondary">Reset</Button>
            </Stack>
            <br />
            <br />
        </form>
    
    );
};

export default ChangeQueryForm;
