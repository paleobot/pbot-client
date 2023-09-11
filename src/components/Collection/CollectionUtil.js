import { MenuItem } from '@mui/material';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import React, { useEffect, useState } from 'react';
import { collectionMethods, collectionTypes, geographicResolutionScale, sizeClasses } from "../../Lists.js";
import { alphabetize } from '../../util.js';
import {
    useQuery,
    gql
  } from "@apollo/client";
  


export const CollectionTypeSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="collectiontype"
            label="Collection type"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {collectionTypes.map((ct) => (
                <MenuItem 
                    key={ct} 
                    value={ct}
                >{ct}</MenuItem>
            ))}
        </Field>
    )
}

export const SizeClassSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="sizeclasses"
            label="Size classes"
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
        >
            {sizeClasses.map((sc) => (
                <MenuItem 
                    key={sc} 
                    value={sc}
                >{sc}</MenuItem>
            ))}
        </Field>
    )
}

export const CollectionMethodSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="collectionmethods"
            label="Collection methods"
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
        >
            {collectionMethods.map((cm) => (
                <MenuItem 
                    key={cm} 
                    value={cm}
                >{cm}</MenuItem>
            ))}
        </Field>
    )
}

export const GeographicResolutionSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="geographicresolution"
            label="Scale of geographic resolution"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            <MenuItem value=""><i>None</i></MenuItem>
            {geographicResolutionScale.map((gR) => (
                <MenuItem 
                    key={gR} 
                    value={gR}
                >{gR}</MenuItem>
            ))}
        </Field>
    )
}


export const TimescaleSelect = (props) => {
    //console.log("TimescaleSelect")
    const [timescales, setTimescales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch("https://macrostrat.org/api/v2/defs/timescales?all")
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                //console.log("Timescale result")
                //console.log(response.success.data)
                setTimescales(response.success.data.map(ts => { 
                    return {
                        name: ts.timescale,
                        maxAge: ts.max_age,
                        minAge: ts.min_age
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

    const style = {minWidth: "12ch", width:"35%"}
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="timescale"
            label="Timescale"
            select={true}
            onChange={event => {
                props.setFieldValue("maxinterval", '');
                props.setFieldValue("mininterval", '');
                props.setFieldValue("timescale", event.target.value);
            }}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {timescales.map((ts) => (
                <MenuItem 
                    key={ts.name} 
                    value={ts.name}
                >{`${ts.name} (${ts.maxAge} - ${ts.minAge} Ma)`}</MenuItem>
            ))}
        </Field>
    )
}

export const IntervalSelect = (props) => {
    const [intervals, setIntervals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uniq = (a) => {
        const seen = {};
        return a.filter((item) => {
            return seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true);
        });
    }

    useEffect(() => {
        if (!props.values.timescale) return;
        setLoading(true);
        fetch(`https://macrostrat.org/api/v2/defs/intervals?timescale=${props.values.timescale}`)
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                /*
                setIntervals(uniq(response.records.map(int => { //only care about name; get rid of dups
                    return {
                        name: int.interval_name
                    }
                })))
                */
                setIntervals(response.success.data.map(int => { 
                    return {
                        name: int.name,
                        maxAge: int.b_age,
                        minAge: int.t_age
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
    }, [props.values.timescale])

    const style = {minWidth: "12ch", width:"35%"}
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name={props.name}
            label={"maxinterval" === props.name ? "Maximum interval" : "Minimum interval"}
            select={true}
            onChange={event => {
                if (props.name === "mininterval") {
                    props.setFieldValue("mininterval", event.target.value)
                } else {
                    props.setFieldValue("maxinterval", event.target.value)
                    if (!props.values.mininterval) {
                        props.setFieldValue("mininterval", event.target.value)
                    }
                }
            }}
            SelectProps={{
                multiple: false,
            }}
            disabled={!props.values.timescale}
        >
            {intervals.map((interval) => (
                <MenuItem 
                    key={interval.name} 
                    value={interval.name}
                >{`${interval.name} (${interval.maxAge} - ${interval.minAge} Ma)`}</MenuItem>
            ))}
        </Field>
    )
}

export const LithologySelect = (props) => {
    const [lithologies, setLithologies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uniq = (a) => {
        const seen = {};
        return a.filter((item) => {
            return seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true);
        });
    }

    useEffect(() => {
        setLoading(true);
        fetch("https://macrostrat.org/api/v1/defs/lithologies?all")
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                setLithologies(response.success.data.map(int => { //only care about name
                    return {
                        name: int.lith
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
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="lithology"
            label="Lithology"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {lithologies.map((lith) => (
                <MenuItem 
                    key={lith.name} 
                    value={lith.name}
                >{lith.name}</MenuItem>
            ))}
        </Field>
    )
}

export const EnvironmentSelect = (props) => {
    const [environments, setEnvironments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uniq = (a) => {
        const seen = {};
        return a.filter((item) => {
            return seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true);
        });
    }

    useEffect(() => {
        setLoading(true);
        fetch("https://macrostrat.org/api/v1/defs/environments?all")
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                setEnvironments(response.success.data.map(int => { //only care about name
                    return {
                        name: int.environ
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
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :(</p>

    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="environment"
            label="Environment"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            <MenuItem value=""><i>None</i></MenuItem>
            {environments.map((env, idx) => (
                <MenuItem 
                    key={idx} 
                    value={env.name}
                >{env.name}</MenuItem>
            ))}
        </Field>
    )
}

export const PreservationModeSelect = (props) => {
    console.log("PreservationModeSelect");
    console.log(props);
    const gQL = gql`
            query {
                PreservationMode {
                    name
                    pbotID
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.preservationModes);
    const preservationModes = alphabetize([...data.PreservationMode], "name");
    
    return (
        <Field
            component={TextField}
            type="text"
            name="preservationmodes"
            label="Preservation modes"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
        >
            {preservationModes.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
        
}
