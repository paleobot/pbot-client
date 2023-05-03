//Modified version of https://codereacter.medium.com/reducing-the-number-of-renders-when-using-formik-9790bf111ab9

import React, { useState, useEffect, useCallback }from 'react';
import {useDebouncedCallback} from 'use-debounce';
import { TextField } from 'formik-mui';

export const DebouncedTextField = (props) => {
    console.log("DebouncedTextField")
    console.log(props.value)
    const [innerValue, setInnerValue] = useState('');
    const INPUT_DELAY = 500;


    useEffect(() => {
        console.log("TFW useEffect")
        console.log(props.value)
        if (props.value) {
            setInnerValue(props.value);
        } else {
            setInnerValue('');
        }
    }, [props.value]);
  
    const debouncedHandleOnChange = useDebouncedCallback(
        (event) => {
            if (props.onChange) {
            props.onChange(event);
            }
        },
        INPUT_DELAY
    );
  
    const handleOnChange = useCallback((event) => {
        event.persist();
        const newValue = event.currentTarget.value;
        setInnerValue(newValue);
        debouncedHandleOnChange(event);
    }, []);
  
    return (
        <TextField
            {...props}
            value={innerValue}
            onChange={handleOnChange}
        />
    );
};