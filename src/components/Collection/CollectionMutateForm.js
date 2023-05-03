import React, { useState, useEffect }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails, Stack, Box, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {collectionTypes, sizeClasses, geographicResolutionScale} from "./Lists.js"

//import IntervalSelect from './IntervalSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import PBDBSelect from './PBDBSelect.js';
import States from '../State/States.js';
import { DebouncedTextField } from '../DebouncedTextField.js';


const CollectionTypeSelect = (props) => {
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

const SizeClassSelect = (props) => {
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

const GeographicResolutionSelect = (props) => {
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
            {geographicResolutionScale.map((gR) => (
                <MenuItem 
                    key={gR} 
                    value={gR}
                >{gR}</MenuItem>
            ))}
        </Field>
    )
}

const CountrySelect = (props) => {
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

const StateSelect = (props) => {
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

const EnvironmentSelect = (props) => {
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
            {environments.map((env, idx) => (
                <MenuItem 
                    key={idx} 
                    value={env.name}
                >{env.name}</MenuItem>
            ))}
        </Field>
    )
}

const CollectionSelect = (props) => {
    //console.log("CollectionSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Collection {
                pbotID
                name
                collectionType
                sizeClasses
                lat
                lon
                gpsCoordinateUncertainty
                geographicResolution
                geographicComments
                protectedSite
                country
                state
                maxinterval
                mininterval
                lithology
                environment
                collectors
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
                preservationModes {
                    pbotID
                }
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    //console.log(">>>>>>>>>>>>Collection results<<<<<<<<<<<<<");
    //console.log(data.Collection);
    const collections = alphabetize([...data.Collection], "name");
    //console.log(collections);
    
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
                props.values.collectiontype = child.props.dcollectiontype || '';
                props.values.sizeclasses = child.props.dsizeclasses ? JSON.parse(child.props.dsizeclasses) : [];
                props.values.lat = child.props.dlat || '';
                props.values.lon = child.props.dlon || '';
                props.values.gpsuncertainty = child.props.dgpsuncertainty || '';
                props.values.geographicresolution = child.props.dgeographicresolution || '';
                props.values.geographiccomments = child.props.dgeographiccomments || '';
                props.values.protectedSite = child.props.dprotectedsite === "true";
                props.values.country = child.props.dcountry || '';
                props.values.state = child.props.dstate || '';
                props.values.maxinterval = child.props.dmaxinterval || '';
                props.values.mininterval = child.props.dmininterval || '';
                props.values.lithology = child.props.dlithology || '';
                props.values.environment = child.props.denvironment || '';
                props.values.collectors = child.props.dcollectors || '';
                props.values.pbdbid = child.props.dpbdbid || '';
                props.values.preservationmodes = child.props.dpreservationmodes ? JSON.parse(child.props.dpreservationmodes) : [];
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
                    dcollectiontype={collection.collectionType}
                    dsizeclasses={collection.sizeClasses ? JSON.stringify(collection.sizeClasses.map(sizeClass => sizeClass)) : null}
                    dlat={collection.lat}
                    dlon={collection.lon}
                    dgpsuncertainty={collection.gpsCoordinateUncertainty}
                    dgeographicresolution={collection.geographicResolution}
                    dgeographiccomments={collection.geographicComments}
                    dprotectedsite={collection.protectedSite === null ? '' : collection.protectedSite.toString()}
                    dcountry={collection.country}
                    dstate={collection.state}
                    dmaxinterval={collection.maxinterval}
                    dmininterval={collection.mininterval}
                    dlithology={collection.lithology}
                    denvironment={collection.environment}
                    dcollectors={collection.collectors}
                    dpbdbid={collection.pbdbid}
                    dpreservationmodes={collection.preservationModes ? JSON.stringify(collection.preservationModes.map(preservationMode => preservationMode.pbotID)) : null}
                    dpublic={collection.elementOf && collection.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={collection.elementOf ? JSON.stringify(collection.elementOf.map(group => group.pbotID)) : null}
                    dspecimens={collection.specimens ? JSON.stringify(collection.specimens.map(specimen => specimen.pbotID)) : null}
                    dreferences={collection.references ? JSON.stringify(collection.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                >{collection.name}</MenuItem>
            ))}
        </Field>
    )
}

const PreservationModeSelect = (props) => {
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


const CollectionMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                collection: '', 
                name: '',
                collectiontype: '',
                maxinterval: '',
                mininterval: '',
                lat: '',
                lon: '',
                gpsuncertainty: '',
                geographicresolution: '',
                geographiccomments: '',
                country: '',
                state: '',
                lithology: '',
                preservationmodes: [],
                environment: '',
                collectors: '',
                sizeclasses: [],
                pbdbid: '',
                references: [{
                    pbotID: '',
                    order:'',
                }],
                cascade: false,
                public: true,
                groups: [],
                mode: mode,
                protectedSite: false,
    };

    //To clear form when mode changes (this and the innerRef below). formikRef points to the Formik DOM element, 
    //allowing useEffect to call resetForm
    const formikRef = React.useRef();
    React.useEffect(() => {
        console.log("useEffect (mode)")
        if (formikRef.current) {
            formikRef.current.resetForm({values:initValues});
        }
    },[mode]);

    const [selectedTab, setSelectedTab] = React.useState('1');
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                lithology: Yup.string().required(),
                preservationmodes: Yup.array().of(Yup.string()).min(1, "preservation modes must have at least one entry"),
                environment: Yup.string(),
                collectors: Yup.string(),
                maxinterval: Yup.string().required("maximum interval is a required field"),
                mininterval: Yup.string(),
                lat: Yup.number().required("latitude is a required field").min(-90).max(90),
                lon: Yup.number().required("longitude is a required field").min(-180).max(180),
                gpsuncertainty: Yup.number().required("gps uncertainty is required").positive().integer(),
                geographicresolution: Yup.string(),
                geographiccomments: Yup.string(),
                protectedSite: Yup.boolean().required("Protection status is required"),
                pbdbid: Yup.string(),
                country: Yup.string().required(),
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
                    <>
                    <Accordion style={accstyle} defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Required fields
                    </AccordionSummary>
                    <AccordionDetails>
                
                            <Field
                                component={DebouncedTextField}
                                type="text"
                                name="name"
                                label="Name"
                                fullWidth 
                                disabled={false}
                                value={props.values.name}
                                onChange={props.handleChange}
                            />
                            <br />

                            <CollectionTypeSelect />
                            <br />

                            <Stack direction="row" spacing={4}>
                                <Field
                                    component={DebouncedTextField}
                                    type="text"
                                    name="lat"
                                    label="Latitude"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                    value={props.values.lat}
                                    onChange={props.handleChange}
                                />
                                <Field
                                    component={DebouncedTextField}
                                    type="text"
                                    name="lon"
                                    label="Longitude"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                    value={props.values.lon}
                                    onChange={props.handleChange}
                                />
                            </Stack>

                            <Field
                                component={DebouncedTextField}
                                name="gpsuncertainty"
                                type="text"
                                label="GPS coordinate uncertainty"
                                value={props.values.gpsuncertainty}
                                onChange={props.handleChange}
                            />
                            <br />

                            <CountrySelect />
                            <br />

                            <br />
                            <Field 
                                component={CheckboxWithLabel}
                                name="protectedSite" 
                                type="checkbox"
                                Label={{label:"Protected site"}}
                            />
                            
                            <Stack direction="row" spacing={4}>
                                <IntervalSelect name="maxinterval" values={props.values} setFieldValue={props.setFieldValue}/>
                                <IntervalSelect name="mininterval" values={props.values} setFieldValue={props.setFieldValue}/>
                            </Stack>
                            
                            <LithologySelect />
                            <br />
                            
                            <PreservationModeSelect />
                            <br />

                            <SizeClassSelect />
                            <br />

                            <Stack direction="row" spacing={0}>
                                <Field
                                    component={DebouncedTextField}
                                    type="text"
                                    name="pbdbid"
                                    label="PBDB ID"
                                    fullWidth 
                                    disabled={false}
                                    value={props.values.pbdbid}
                                    onChange={props.handleChange}
                                />
                                <PBDBSelect />
                            </Stack>

                            <ReferenceManager values={props.values}/>
                        
                            <Field 
                                component={CheckboxWithLabel}
                                name="public" 
                                type="checkbox"
                                Label={{label:"Public"}}
                                disabled={(mode === "edit" && props.values.origPublic)}
                            />
                            
                            {!props.values.public &&
                            <div>
                                <GroupSelect />
                                <br />
                            </div>
                            }
                            
                        </AccordionDetails>
                    </Accordion>

                    <Accordion style={accstyle}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="optional-content"
                            id="optional-header"                        
                        >
                            Optional fields
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={selectedTab}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList 
                                            textColor="secondary" 
                                            indicatorColor="secondary" 
                                            onChange={handleChange} 
                                            aria-label="optional tabs"
                                        >
                                            <Tab label="Geographic" value="1"/>
                                            <Tab label="Age" value="2"/>
                                            <Tab label="Geologic" value="3"/>
                                            <Tab label="Collecting" value="4"/>
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1">
                                        <StateSelect country={props.values.country} />
                                        <br />

                                        <GeographicResolutionSelect />
                                        <br />

                                        <Field
                                            component={DebouncedTextField}
                                            name="geographiccomments"
                                            type="text"
                                            label="Comments on geographic information"
                                            value={props.values.geographiccomments}
                                            onChange={props.handleChange}
                                        />
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="2">
                                        <Field
                                            component={TextField}
                                            name="directdate"
                                            type="text"
                                            label="Direct date !"
                                        />
                                        <br />

                                        <Stack direction="row" spacing={4}>
                                            <Field
                                                component={TextField}
                                                name="nummaxage"
                                                type="text"
                                                label="Numeric maximum age !"
                                            />
                                            <Field
                                                component={TextField}
                                                name="numminage"
                                                type="text"
                                                label="Numeric minimum age !"
                                            />
                                        </Stack>

                                        <Field
                                            component={TextField}
                                            name="agecomments"
                                            type="text"
                                            label="Comments !"
                                        />
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="3">
                                        <Field
                                            component={TextField}
                                            name="addllith"
                                            type="text"
                                            label="Additional description of lithology !"
                                        />
                                        <br />

                                        <br />
                                        <Typography variant="h7">Stratigraphy</Typography>
                                        
                                        <div style={{marginLeft:"2em"}}>
                                            <Field
                                                component={TextField}
                                                name="geologicgroup"
                                                type="text"
                                                label="Group !"
                                            />
                                            <br />

                                            <Field
                                                component={TextField}
                                                name="geologicformation"
                                                type="text"
                                                label="Formation !"
                                            />
                                            <br />

                                            <Field
                                                component={TextField}
                                                name="geologicmember"
                                                type="text"
                                                label="Member !"
                                            />
                                            <br />

                                            <Field
                                                component={TextField}
                                                name="geologicbed"
                                                type="text"
                                                label="Bed !"
                                            />
                                            <br />

                                            <Field
                                                component={TextField}
                                                name="stratigraphcomments"
                                                type="text"
                                                label="Comments on stratigraphy !"
                                            />
                                            <br />
                                        </div>

                                        <EnvironmentSelect/>
                                        <br />

                                        <Field
                                            component={TextField}
                                            name="environmentcomments"
                                            type="text"
                                            label="Comments on environment !"
                                        />
                                        <br />

                                    </TabPanel>                            
                                    <TabPanel value="4">
                                        <Field
                                            component={TextField}
                                            type="text"
                                            name="collectors"
                                            label="Collectors"
                                            fullWidth 
                                            disabled={false}
                                        />
                                        <br />

                                        <Field
                                            component={TextField}
                                            type="text"
                                            name="collectionmethods"
                                            label="Collection methods !"
                                            fullWidth 
                                            disabled={false}
                                        />
                                        <br />

                                        <Field
                                            component={TextField}
                                            type="text"
                                            name="collectionmethodscomments"
                                            label="Comments on collection methods !"
                                            fullWidth 
                                            disabled={false}
                                        />
                                        <br />
                                    </TabPanel>   
                                </TabContext>
                            </Box>                         
  
                      </AccordionDetails>
                    </Accordion>
                
                    </>
                }
                
                {(mode === "delete") &&
                <div>
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        Label={{ label: 'Cascade' }}
                    />
                  <br />
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
