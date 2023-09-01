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
import {collectionTypes, sizeClasses, geographicResolutionScale, collectionMethods} from "../../Lists.js"
import { CountrySelect } from './CountrySelect.js'
import { StateSelect } from './StateSelect.js'
import {CollectionSelect} from '../Collection/CollectionSelect.js';

//import IntervalSelect from './IntervalSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import PBDBSelect from './PBDBSelect.js';
import States from '../State/States.js';
import { SensibleTextField } from '../SensibleTextField.js';
import { DateEntry } from './DateEntry.js';


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

const CollectionMethodSelect = (props) => {
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


const TimescaleSelect = (props) => {
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

/*
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
                timescale
                maxinterval
                mininterval
                lithology
                additionalLithology
                stratigraphicGroup
                stratigraphicFormation
                stratigraphicMember
                stratigraphicBed
                stratigraphicComments
                environment
                environmentComments
                collectors
                collectionMethods
                collectingComments
                pbdbid
                directDate
                directDateError
                directDateType
                numericAgeMin
                numericAgeMinError
                numericAgeMinType
                numericAgeMax
                numericAgeMaxError
                numericAgeMaxType
                ageComments
                elementOf {
                    name
                    pbotID
                }
                references (orderBy: order_asc) {
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
                props.values.timescale = child.props.dtimescale || '';
                props.values.maxinterval = child.props.dmaxinterval || '';
                props.values.mininterval = child.props.dmininterval || '';
                props.values.lithology = child.props.dlithology || '';
                props.values.additionallithology = child.props.dadditionallithology || '';
                props.values.stratigraphicgroup = child.props.dstratigraphicgroup || '';
                props.values.stratigraphicformation = child.props.dstratigraphicformation || '';
                props.values.stratigraphicmember = child.props.dstratigraphicmember || '';
                props.values.stratigraphicbed = child.props.dstratigraphicbed || '';
                props.values.stratigraphiccomments = child.props.dstratigraphiccomments || '';
                props.values.environment = child.props.denvironment || '';
                props.values.environmentcomments = child.props.denvironmentcomments || '';
                props.values.collectors = child.props.dcollectors || '';
                props.values.collectionmethods = child.props.dcollectionmethods ? JSON.parse(child.props.dcollectionmethods) : [];
                props.values.collectingcomments = child.props.dcollectingcomments || '';
                props.values.pbdbid = child.props.dpbdbid || '';
                props.values.directdate = child.props.ddirectdate || '';
                props.values.directdateerror = child.props.ddirectdateerror || '';
                props.values.directdatetype = child.props.ddirectdatetype || '';
                props.values.numericagemin = child.props.dnumericagemin || '';
                props.values.numericageminerror = child.props.dnumericageminerror || '';
                props.values.numericagemintype = child.props.dnumericagemintype || '';
                props.values.numericagemax = child.props.dnumericagemax || '';
                props.values.numericagemaxerror = child.props.dnumericagemaxerror || '';
                props.values.numericagemaxtype = child.props.dnumericagemaxtype || '';
                props.values.agecomments = child.props.dagecomments || '';
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
                    dtimescale={collection.timescale}
                    dmaxinterval={collection.maxinterval}
                    dmininterval={collection.mininterval}
                    dlithology={collection.lithology}
                    dadditionallithology={collection.additionalLithology}
                    dstratigraphicgroup={collection.stratigraphicGroup}
                    dstratigraphicformation={collection.stratigraphicFormation}
                    dstratigraphicmember={collection.stratigraphicMember}
                    dstratigraphicbed={collection.stratigraphicBed}
                    dstratigraphiccomments={collection.stratigraphicComments}
                    denvironment={collection.environment}
                    denvironmentcomments={collection.environmentComments}
                    dcollectors={collection.collectors}
                    dcollectionmethods={collection.collectionMethods ? JSON.stringify(collection.collectionMethods.map(cm => cm)) : null}
                    dcollectingcomments={collection.collectingComments}
                    dpbdbid={collection.pbdbid}
                    ddirectdate={collection.directDate}
                    ddirectdateerror={collection.directDateError}
                    ddirectdatetype={collection.directDateType}
                    dnumericagemin={collection.numericAgeMin}
                    dnumericageminerror={collection.numericAgeMinError}
                    dnumericagemintype={collection.numericAgeMinType}
                    dnumericagemax={collection.numericAgeMax}
                    dnumericagemaxerror={collection.numericAgeMaxError}
                    dnumericagemaxtype={collection.numericAgeMaxType}
                    dagecomments={collection.ageComments}
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
*/

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
                timescale: '',
                maxinterval: '',
                mininterval: '',
                lat: '',
                lon: '',
                gpsuncertainty: '',
                geographicresolution: '',
                geographiccomments: '',
                country: '',
                state: '',
                directdate: '',
                directdateerror: '',
                directdatetype: '',
                numericagemin: '',
                numericageminerror: '',
                numericagemintype: '',
                numericagemax: '',
                numericagemaxerror: '',
                numericagemaxtype: '',
                agecomments: '',
                lithology: '',
                additionallithology: '',
                stratigraphicgroup: '',
                stratigraphicformation: '',
                stratigraphicmember: '',
                stratigraphicbed: '',
                stratigraphiccomments: '',
                environment: '',
                environmentcomments: '',
                preservationmodes: [],
                collectors: '',
                collectionmethods: [],
                collectingcomments: '',
                sizeclasses: [],
                pbdbid: '',
                pbdbCheck: "delete" === mode, //only force pbdb check if not deleting
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
    const handleTabChange = (event, newValue) => {
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
                collectiontype: Yup.string().required(),
                lithology: Yup.string().required(),
                additionallithology: Yup.string(),
                stratigraphicgroup: Yup.string(),
                stratigraphicformation: Yup.string(),
                stratigraphicmember: Yup.string(),
                stratigraphicbed: Yup.string(),
                stratigraphiccomments: Yup.string(),
                environment: Yup.string(),
                environmentcomments: Yup.string(),
                preservationmodes: Yup.array().of(Yup.string()).min(1, "preservation modes must have at least one entry"),
                collectors: Yup.string(),
                collectionmethods: Yup.array().of(Yup.string()),
                collectingcomments: Yup.string(),
                timescale: Yup.string().required("timescale is a required field"),
                maxinterval: Yup.string().required("maximum interval is a required field"),
                mininterval: Yup.string(),
                lat: Yup.number().required("latitude is a required field").min(-90).max(90),
                lon: Yup.number().required("longitude is a required field").min(-180).max(180),
                gpsuncertainty: Yup.number().required("gps uncertainty is required").positive().integer(),
                geographicresolution: Yup.string(),
                geographiccomments: Yup.string(),
                protectedSite: Yup.boolean().required("Protection status is required"),
                pbdbid: Yup.string().when('pbdbCheck', {
                    is: false,
                    then: Yup.string().required("While PBDB ID is not required, you must at least check")
                }),
                pbdbCheck: Yup.bool(),
                country: Yup.string().required(),
                directdate: Yup.number(),
                directdateerror: Yup.number(),
                directdatetype: Yup.string(),
                numericagemin: Yup.number(),
                numericageminerror: Yup.number(),
                numericagemintype: Yup.string(),
                numericagemax: Yup.number(),
                numericagemaxerror: Yup.number(),
                numericagemaxtype: Yup.string(),
                agecomments: Yup.string(),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                }),
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
                        {/*}
                        <CollectionSelect values={props.values} handleChange={props.handleChange}/>
                        <br />*/}
                        <CollectionSelect name="collection" label="Collection" populateMode="full"/>
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
                                component={SensibleTextField}
                                type="text"
                                name="name"
                                label="Name"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <CollectionTypeSelect />
                            <br />

                            <Stack direction="row" spacing={4}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="lat"
                                    label="Latitude"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="lon"
                                    label="Longitude"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>

                            <Field
                                component={SensibleTextField}
                                name="gpsuncertainty"
                                type="text"
                                label="GPS coordinate uncertainty (meters)"
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
                            <br />

                            <TimescaleSelect values={props.values} setFieldValue={props.setFieldValue}/>
                            
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
                                    component={SensibleTextField}
                                    type="text"
                                    name="pbdbid"
                                    label="PBDB ID"
                                    fullWidth 
                                    disabled={false}
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
                                <GroupSelect  omitPublic={true} />
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
                                            onChange={handleTabChange} 
                                            aria-label="optional tabs"
                                        >
                                            <Tab label="Geographic" value="1"/>
                                            <Tab label="Age" value="2"/>
                                            <Tab label="Geologic" value="3"/>
                                            <Tab label="Collecting" value="4"/>
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1">
                                        <StateSelect country={props.values.country} includeNone/>
                                        <br />

                                        <GeographicResolutionSelect />
                                        <br />

                                        <Field
                                            component={SensibleTextField}
                                            name="geographiccomments"
                                            type="text"
                                            multiline
                                            label="Notes on geographic information"
                                        />
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="2">
                                        <DateEntry name="directdate" />
                                        <br />
                                        <DateEntry name="numericagemax" />
                                        <br />
                                        <DateEntry name="numericagemin" />
                                        <br />

                                        <Field
                                            component={SensibleTextField}
                                            name="agecomments"
                                            type="text"
                                            multiline
                                            label="Notes on age"
                                        />
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="3">
                                        <Field
                                            component={SensibleTextField}
                                            name="additionallithology"
                                            type="text"
                                            label="Additional description of lithology"
                                        />
                                        <br />

                                        <br />
                                        <Typography variant="h7">Stratigraphy</Typography>
                                        
                                        <div style={{marginLeft:"2em"}}>
                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphicgroup"
                                                type="text"
                                                label="Group"
                                            />
                                            <br />

                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphicformation"
                                                type="text"
                                                label="Formation"
                                            />
                                            <br />

                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphicmember"
                                                type="text"
                                                label="Member"
                                            />
                                            <br />

                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphicbed"
                                                type="text"
                                                label="Bed"
                                            />
                                            <br />

                                            <Field
                                                component={SensibleTextField}
                                                name="stratigraphiccomments"
                                                type="text"
                                                multiline
                                                label="Notes on stratigraphy"
                                            />
                                            <br />
                                        </div>

                                        <EnvironmentSelect/>
                                        <br />

                                        <Field
                                            component={SensibleTextField}
                                            name="environmentcomments"
                                            type="text"
                                            multiline
                                            label="Notes on environment"
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

                                        <CollectionMethodSelect />
                                        <br />

                                        <Field
                                            component={SensibleTextField}
                                            type="text"
                                            name="collectingcomments"
                                            multiline
                                            label="Notes on collection methods"
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

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                    <Button type="reset" variant="outlined" color="secondary">Reset</Button>
                </Stack>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default CollectionMutateForm;
