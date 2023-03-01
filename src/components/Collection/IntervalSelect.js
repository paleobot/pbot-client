import React, { useState, useEffect }from 'react';
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import {  CheckboxWithLabel, RadioGroup, Select, Autocomplete } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import { TextField } from '@mui/material';

//This this is buggy and terrible. Do not use!
//Pieced together from:
//https://stackworx.github.io/formik-mui/docs/api/mui
//https://github.com/stackworx/formik-mui/pull/344/commits/c95c41af9cfc27a769b22b34ec8a0b972e1f45ad (to get the right TextField)
//https://github.com/jaredpalmer/formik/discussions/3399 (for onBlur issue)
//https://github.com/mui/material-ui/issues/29727 (for warning of invalid value, but doesn't work)
//I dunno, f* this.

const IntervalSelect = (props) => {
    const [intervals, setIntervals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formikProps = useFormikContext()

    const uniq = (a) => {
        const seen = {};
        return a.filter((item) => {
            return seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true);
        });
    }

    useEffect(() => {
        setLoading(true);
        fetch("https://paleobiodb.org/data1.2/intervals/list.json?scale_id=all&vocab=pbdb")
        //fetch("https://paleobiodb.org/data1.2/intervals/list.json?scale_id=1&vocab=pbdb")
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                setIntervals(uniq(response.records.map(int => { //only care about name; get rid of dups
                    return {
                        name: int.interval_name
                    }
                })))
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
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    const options = intervals.map((interval, idx) => {
        return {
            name: interval.name,
            id: idx
        }
    })
    return (
        <Field
            style={style}
            component={Autocomplete}
            options={options}
            getOptionLabel={(option) => option.name || ''}
            name={props.name}
            isOptionEqualToValue={(option, value) => {console.log(option); return option.name === value.name}}
            renderInput={(params) => (
                <TextField
                  {...params}
                  // We have to manually set the corresponding fields on the input component
                  name={props.name}
                  error={formikProps.touched[props.name] && !!formikProps.errors[props.name]}
                  helperText={formikProps.errors[props.name]}
                  onBlur={formikProps.handleBlur}
                  label={"maxinterval" === props.name ? "Maximum interval" : "Minimum interval"}
               />
              )}
            disabled={false}
        />
    )
}

export default IntervalSelect;
