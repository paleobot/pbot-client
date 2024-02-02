//Modified version of https://codereacter.medium.com/reducing-the-number-of-renders-when-using-formik-9790bf111ab9

import React, { useState, useEffect }from 'react';
import { TextField } from 'formik-mui';
import { useFormikContext } from 'formik';

export const SensibleTextField = (props) => {
    //console.log("SensibleTextField")
    const [innerValue, setInnerValue] = useState('');

    //Using formik context allows us access to everything we need, without the need
    //for them to be passed through parameters. This makes SensibleTextField a truly
    //drop-in replacement for TextField.
    const formik = useFormikContext();

    //This makes sure local val is updated whenever something happens to main val 
    //(like form reset or populate from pbdb)
    useEffect(() => {
        setInnerValue(formik.values[props.field.name]);
    }, [formik.values[props.field.name]]);
    
    //Field is losing focus. Update main val via formik's change handler. Then
    //call formik's blur handler to make sure field is validated.  
    const handleOnBlur = async (event) => {
        //console.log("handleOnBlur")
        if (event.target.value && props.prefix && !event.target.value.startsWith(props.prefix)) {
            event.target.value = props.prefix + event.target.value;
        }
        //console.log(event.target.value)
        await formik.handleChange(event);
        formik.handleBlur(event);
    };
  
    //Only set local val
    const handleOnChange = (event) => {
        setInnerValue(event.currentTarget.value);
    };
  
    return (
        <TextField
            {...props}
            value={innerValue}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            onKeyDown={e => { e.key === 'Enter' && handleOnBlur(e)}}
        />
    );
};