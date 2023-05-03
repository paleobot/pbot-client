//Modified version of https://codereacter.medium.com/reducing-the-number-of-renders-when-using-formik-9790bf111ab9

import React, { useState, useEffect, useCallback }from 'react';
import {useDebouncedCallback} from 'use-debounce';
import { TextField } from 'formik-mui';

export const SensibleTextField = (props) => {
    console.log("DebouncedTextField")
    console.log(props.value)
    const [innerValue, setInnerValue] = useState('');

    useEffect(() => {
        console.log("TFW useEffect")
        if (props.value) {
            setInnerValue(props.value);
        } else {
            setInnerValue('');
        }
    }, [props.value]);
  
    const handleOnBlur = async (event) => {
        if (props.onChange) {
            props.onChange(event);
        }
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