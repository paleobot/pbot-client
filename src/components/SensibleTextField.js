//Modified version of https://codereacter.medium.com/reducing-the-number-of-renders-when-using-formik-9790bf111ab9

import React, { useState, useEffect }from 'react';
import { TextField } from 'formik-mui';
import { useFormikContext } from 'formik';

export const SensibleTextField = (props) => {
    //console.log("SensibleTextField")
    const [innerValue, setInnerValue] = useState('');

    const formik = useFormikContext();

    useEffect(() => {
        setInnerValue(formik.values[props.field.name]);
    }, [formik.values[props.field.name]]);
  
    const handleOnBlur = async (event) => {
        await formik.handleChange(event);
        formik.handleBlur(event);
    };
  
    const handleOnChange = (event) => {
        setInnerValue(event.currentTarget.value);
    };
  
    return (
        <TextField
            {...props}
            value={innerValue}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
        />
    );
};