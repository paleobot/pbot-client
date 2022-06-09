import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import {CollectionSelect} from '../Collection/CollectionSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    //TODO: look into https://www.graphql-scalars.dev/docs/scalars/uuid for managing idigbiouuid
    const gQL = gql`
            query {
                Specimen {
                    pbotID
                    name
                    locality
                    preservationMode
                    idigbiouuid
                    pbdbcid
                    pbdboccid
                    organ {
                        pbotID
                    }
                    describedBy {
                      	Description {
                        	pbotID
                      	}
                    }
                    exampleOf {
                        OTU {
                            name
                            pbotID
                        }
                    }
                    holotypeOf {
                        OTU {
                            name
                            pbotID
                        }
                    }
                    elementOf {
                        name
                        pbotID
                    }
                    collection {
                        pbotID
                    }
                    references {
                        Reference {
                            pbotID
                        }
                        order
                    }
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Specimen results<<<<<<<<<<<<<");
    console.log(data.Specimen);
    const specimens = alphabetize([...data.Specimen], "name");
    console.log(specimens);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="specimen"
            label="Specimen"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.name = child.props.dname;
                props.values.locality = child.props.dlocality ? child.props.dlocality : '';
                props.values.organ = child.props.dorgan ? child.props.dorgan : '';
                props.values.preservationMode = child.props.dpreservationmode ? child.props.dpreservationmode : '';
                props.values.describedBy = child.props.ddescribedby ? JSON.parse(child.props.ddescribedby) : [];
                props.values.exampleOf = child.props.dexampleOf ? child.props.dexampleOf : '';
                props.values.holotypeOf = child.props.dholotypeOf ? child.props.dholotypeOf : '';
                props.values.idigbiouuid = child.props.didigbiouuid ? child.props.didigbiouuid : '';
                props.values.pbdbcid = child.props.dpbdbcid ? child.props.dpbdbcid : '';
                props.values.pbdboccid = child.props.dpbdboccid ? child.props.dpbdboccid : '';
                props.values.public = "true"=== child.props.dpublic || false;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.values.collection = child.props.dcollection ? child.props.dcollection : '';
                props.handleChange(event);
            }}
        >
            {specimens.map((specimen) => (
                <MenuItem 
                    key={specimen.pbotID} 
                    value={specimen.pbotID}
                    dname={specimen.name}
                    dlocality={specimen.locality}
                    dorgan={specimen.organ.pbotID}
                    dpreservationmode={specimen.preservationMode}
                    ddescribedby={specimen.describedBy ? JSON.stringify(specimen.describedBy.map(d => d.Description.pbotID)) : ''}
                    dexampleOf={specimen.exampleOf ? specimen.exampleOf.OTU.pbotID : ''}
                    dholotypeOf={specimen.holotypeOf ? specimen.holotypeOf.OTU.pbotID : ''}
                    didigbiouuid={specimen.idigbiouuid}
                    dpbdbcid={specimen.pbdbcid}
                    dpbdboccid={specimen.pbdboccid}
                    dpublic={specimen.elementOf && specimen.elementOf.reduce((acc,group) => {return "public" === group.name}, false)}
                    dgroups={specimen.elementOf ? JSON.stringify(specimen.elementOf.map(group => group.pbotID)) : null}
                    dreferences={specimen.references ? JSON.stringify(specimen.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order}})) : null}
                    dcollection={specimen.collection ? specimen.collection.pbotID : ''}
                >{specimen.name}</MenuItem>
            ))}
        </Field>
    )
}

const OrganSelect = (props) => {
    console.log("OrganSelect");
    console.log(props);
    const organGQL = gql`
            query {
                Organ {
                    type
                    pbotID
                }            
            }
        `;

    const { loading: organLoading, error: organError, data: organData } = useQuery(organGQL, {fetchPolicy: "cache-and-network"});

    if (organLoading) return <p>Loading...</p>;
    if (organError) return <p>Error :(</p>;
                                 
    console.log(organData.organs);
    const organs = alphabetize([...organData.Organ], "type");
    
    return (
        <Field
            component={TextField}
            type="text"
            name="organ"
            label="Organ"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {organs.map(({ pbotID, type }) => (
                <MenuItem key={pbotID} value={pbotID}>{type}</MenuItem>
            ))}
        </Field>
    )
        
}

const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    console.log(props.type);
    const descriptionGQL = gql`
            query {
                Description {
                    pbotID
                    name
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: descriptionLoading, error: descriptionError, data: descriptionData } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

    if (descriptionLoading) return <p>Loading...</p>;
    if (descriptionError) return <p>Error :(</p>;
                                 
    console.log(descriptionData);
    let descriptions = [...descriptionData.Description];
    
    return (
        <Field 
            component={TextField}
            type="text"
            name="describedBy"
            label="Described by"
            fullWidth
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
            defaultValue=""
        >
            {alphabetize(descriptions, "name").map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )        
}

const OTUSelect = (props) => {
    console.log("OTUSelect");
    console.log(props);
    console.log(props.type);
    let gQL;
    //TODO: Commenting this out for now. The intent was to limit holotype options to otus not already holotypes. But this doesn't work well with the edit functionality (not populated with holotype, since not returned from query).
    /* 
    if ("holotype" === props.type) {
        gQL= gql`
            query {
                OTU (filter: { holotype: null }) {
                    pbotID
                    name
                }            
            }
        `;
    } else {
        */
        gQL = gql`
           query {
                OTU {
                    pbotID
                    name
                }            
            }
         `;
    //}
       
    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data);
    let otus = [...data.OTU];
    
    console.log("otus && otus.length > 0");
    console.log(otus && otus.length > 0);
    
    if (props.type === "holotype") {
        return (
            <Field 
                component={TextField}
                type="text"
                name="holotypeOf"
                label="Holotype of"
                fullWidth
                select={true}
                SelectProps={{
                    multiple: false,
                }}
                disabled={!(otus && otus.length > 0)}
                defaultValue=""
            >
                <MenuItem key="0" value=""><i>nothing</i></MenuItem>
                {alphabetize(otus, "name").map(({ pbotID, name }) => (
                    <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
                ))}
            </Field>
        )        
    } else {
        return (
            <Field 
                component={TextField}
                type="text"
                name="exampleOf"
                label="Example of"
                fullWidth
                select={true}
                SelectProps={{
                    multiple: false,
                }}
                disabled={false}
                defaultValue=""
            >
                <MenuItem key="0" value=""><i>nothing</i></MenuItem>
                {alphabetize(otus, "name").map(({ pbotID, name }) => (
                    <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
                ))}
            </Field>
        )
    }
}

const SpecimenMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    //const [values, setValues] = useState({});
    const initValues = {
                specimen: '',
                name: '',
                locality: '',
                organ: '',
                preservationMode: '',
                describedBy: [],
                exampleOf: '',
                holotypeOf: '',
                otu: '',
                idigbiouuid: '',
                pbdbcid: '',
                pbdboccid: '',
                references: [{
                    pbotID: '',
                    order:'',
                }],
                public: true,
                collection: '',
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
    
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                organ: Yup.string().required(),
                preservationMode: Yup.string(),
                locality: Yup.string(),
                idigbiouuid: Yup.string().uuid('Must be a valid uuid'),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                collection: Yup.string(),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
           })}
            onSubmit={(values, {resetForm}) => {
                alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>
                <Field 
                    component={TextField}
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <SpecimenSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.specimen !== '')) &&
                    <div>
                    
                    <Field
                        component={TextField}
                        type="text"
                        name="name"
                        label="Name"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />
                    
                    <ReferenceManager values={props.values}/>

                    <Field
                        component={TextField}
                        type="text"
                        name="locality"
                        label="Locality"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />

                    <OrganSelect />
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="preservationMode"
                        label="Preservation mode"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />
                    
                    <DescriptionSelect/>
                    <br />

                    <OTUSelect type="holotype"/>
                    <br />
                    
                    <OTUSelect type="example"/>
                    <br />
                    
                    <Field
                        component={TextField}
                        type="text"
                        name="idigbiouuid"
                        label="iDigBio UUID"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="pbdbcid"
                        label="PBDB cid"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="pbdboccid"
                        label="PBDB occid"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />
                    
                    <CollectionSelect />
                    <br />

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

export default SpecimenMutateForm;
