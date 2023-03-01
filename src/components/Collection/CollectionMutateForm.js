import React, { useState, useEffect }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
//import IntervalSelect from './IntervalSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import PBDBSelect from './PBDBSelect.js';

const IntervalSelect = (props) => {
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
        setLoading(true);
        //fetch("https://paleobiodb.org/data1.2/intervals/list.json?scale_id=all&vocab=pbdb")
        //fetch("https://paleobiodb.org/data1.2/intervals/list.json?scale_id=1&vocab=pbdb")
        fetch("https://macrostrat.org/api/v1/defs/intervals?timescale_id=1")
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
                setIntervals(response.success.data.map(int => { //only care about name
                    return {
                        name: int.name
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
            name={props.name}
            label={"maxinterval" === props.name ? "Maximum interval" : "Minimum interval"}
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {intervals.map((interval) => (
                <MenuItem 
                    key={interval.name} 
                    value={interval.name}
                >{interval.name}</MenuItem>
            ))}
        </Field>
    )
}

const LithologySelect = (props) => {
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

const CollectionSelect = (props) => {
    console.log("CollectionSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Collection {
                pbotID
                name
                lat
                lon
                pbdbid
                elementOf {
                    name
                    pbotID
                }
                references {
                    Reference {
                        pbotID
                    }
                    order
                }
                specimens {
                    pbotID
                }
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Collection results<<<<<<<<<<<<<");
    console.log(data.Collection);
    const collections = alphabetize([...data.Collection], "name");
    console.log(collections);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="collection"
            label="Collection"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                console.log("Collection onChange");
                console.log(child.props.dspecimens);
                props.values.name = child.props.dname || '';
                props.values.lat = child.props.dlat || '';
                props.values.lon = child.props.dlon || '';
                props.values.pbdbid = child.props.dpbdbid || '';
                props.values.public = "true"===child.props.dpublic;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.values.specimens = child.props.dspecimens ? JSON.parse(child.props.dspecimens) : [];
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                console.log(props.values.specimens);
                props.handleChange(event);
            }}
        >
            {collections.map((collection) => (
                <MenuItem 
                    key={collection.pbotID} 
                    value={collection.pbotID}
                    dname={collection.name}
                    dlat={collection.lat}
                    dlon={collection.lon}
                    dpbdbid={collection.pbdbid}
                    dpublic={collection.elementOf && collection.elementOf.reduce((acc,group) => {console.log(">>>>>>>>>>Collection.name = "); console.log(collection.name); console.log("group.name ="); console.log(group.name); console.log(acc || "public" === group.name);return acc || "public" === group.name}, false).toString()}
                    dgroups={collection.elementOf ? JSON.stringify(collection.elementOf.map(group => group.pbotID)) : null}
                    dspecimens={collection.specimens ? JSON.stringify(collection.specimens.map(specimen => specimen.pbotID)) : null}
                    dreferences={collection.references ? JSON.stringify(collection.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                >{collection.name}</MenuItem>
            ))}
        </Field>
    )
}

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");

    const gQL = gql`
            query {
                Specimen (filter: { OR: [{collection: {pbotID: "${props.values.collection}"}}, {collection: null}]}) {
                    pbotID
                    name
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Specimen);
    
    const specimens = alphabetize([...data.Specimen], "name");
    console.log(specimens)
    
    return (
        <Field
            component={TextField}
            type="text"
            name="specimens"
            label="Specimens"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
        >
            {specimens.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}


const CollectionMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                collection: '', 
                name: '',
                maxinterval: '',
                mininterval: '',
                lat: '',
                lon: '',
                lithology: '',
                pbdbid: '',
                specimens: [],
                references: [{
                    pbotID: '',
                    order:'',
                }],
                public: true,
                groups: [],
                mode: mode,
    };

    //To clear form when mode changes (this and the innerRef below). formikRef points to the Formik DOM element, 
    //allowing useEffect to call resetForm
    const formikRef = React.useRef();
    React.useEffect(() => {
        if (formikRef.current) {
            formikRef.current.resetForm({values:initValues});
        }
    });
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                lithology: Yup.string(),
                maxinterval: Yup.string(),
                mininterval: Yup.string(),
                lat: Yup.string(), //for now
                lon: Yup.string(), //for now
                pbdbid: Yup.string(),
                specimens: Yup.array().of(Yup.string()).when('public', {
                    is: true,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one specimen for a public collection")
                }),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>

                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <CollectionSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.collection !== '')) &&
                    <div>
                    <Field
                        component={TextField}
                        type="text"
                        name="name"
                        label="Name"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="lat"
                        label="Latitude"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="lon"
                        label="Longitude"
                        fullWidth 
                        disabled={false}
                    />
                    <br />


                    <IntervalSelect name="maxinterval" />
                    <br />

                    <IntervalSelect name="mininterval" />
                    <br />
                    
                    <LithologySelect />
                    <br />
                    

                    <Grid container spacing={2} direction="row">
                        <Grid item xs={5}>
                            <Field
                                component={TextField}
                                type="text"
                                name="pbdbid"
                                label="PBDB ID"
                                fullWidth 
                                disabled={false}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <PBDBSelect />
                        </Grid>
                    </Grid>
                    <br />

                    <SpecimenSelect values={props.values}/>
                    <br />

                    <ReferenceManager values={props.values}/>
                
                    <Field 
                        component={CheckboxWithLabel}
                        name="public" 
                        type="checkbox"
                        Label={{label:"Public"}}
                        disabled={(mode === "edit" && props.values.origPublic)}
                    />
                    <br />
                    
                    {!props.values.public &&
                    <div>
                        <GroupSelect />
                        <br />
                    </div>
                    }
                
                    </div>
                }
                
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default CollectionMutateForm;
