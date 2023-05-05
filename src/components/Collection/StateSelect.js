import { MenuItem } from '@mui/material';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import React, { useEffect, useState } from 'react';

export const StateSelect = (props) => {
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (props.country === '') return
        setLoading(true);
        fetch(`/states/${props.country}`)
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                console.log("States response")
                console.log(response)
                setStates(response.map(state => { 
                    return {
                        name: state.name,
                        code: state.isoCode
                    }
                }));
            }
        ).catch (
            (error) => {
                console.log("error!")
                console.log(error)
                setError(error)
            }
        )
    }, [props.country])
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="state"
            label="State/Province"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {states.map((state) => (
                <MenuItem 
                    key={state.code} 
                    value={state.code}
                >{`${state.name} - ${state.code}`}</MenuItem>
            ))}
        </Field>
    )
}