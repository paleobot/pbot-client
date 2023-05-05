import { MenuItem } from '@mui/material';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import React, { useEffect, useState } from 'react';

export const CountrySelect = (props) => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        //fetch("https://paleobiodb.org/data1.2/intervals/list.json?scale_id=all&vocab=pbdb")
        //fetch("https://paleobiodb.org/data1.2/intervals/list.json?scale_id=1&vocab=pbdb")
        fetch("/countries")
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                console.log("Countries response")
                console.log(response)
                setCountries(response.map(country => { 
                    return {
                        name: country.name,
                        code: country.isoCode
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
    }, [])
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="country"
            label="Country"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {countries.map((country) => (
                <MenuItem 
                    key={country.code} 
                    value={country.code}
                >{`${country.name} - ${country.code}`}</MenuItem>
            ))}
        </Field>
    )
}
