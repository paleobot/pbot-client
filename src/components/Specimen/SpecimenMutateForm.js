import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceSelect} from '../Reference/ReferenceSelect.js';

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
                    description {
                      	Description {
                        	pbotID
                      	}
                    }
                    archtypeDescription {
                      	Description {
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
                        pbotID
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
            onChange={event => {
                //props.resetForm();
                props.values.name = event.currentTarget.dataset.name;
                props.values.locality = event.currentTarget.dataset.locality ? event.currentTarget.dataset.locality : '';
                props.values.organ = event.currentTarget.dataset.organ ? event.currentTarget.dataset.organ : '';
                props.values.preservationMode = event.currentTarget.dataset.preservationmode ? event.currentTarget.dataset.preservationmode : '';
                props.values.describedBy = event.currentTarget.dataset.describedby ? event.currentTarget.dataset.describedby : '';
                props.values.exampleOf = event.currentTarget.dataset.exampleof ? event.currentTarget.dataset.exampleof : '';
                props.values.idigbiouuid = event.currentTarget.dataset.idigbiouuid ? event.currentTarget.dataset.idigbiouuid : '';
                props.values.pbdbcid = event.currentTarget.dataset.pbdbcid ? event.currentTarget.dataset.pbdbcid : '';
                props.values.pbdboccid = event.currentTarget.dataset.pbdboccid ? event.currentTarget.dataset.pbdboccid : '';
                props.values.public = "true"=== event.currentTarget.dataset.public || false;
                props.values.origPublic = props.values.public;
                props.values.groups = event.currentTarget.dataset.groups ? JSON.parse(event.currentTarget.dataset.groups) : [];
                props.values.references = event.currentTarget.dataset.references ? JSON.parse(event.currentTarget.dataset.references) : [];
                props.values.collection = event.currentTarget.dataset.collection ? event.currentTarget.dataset.collection : '';
                props.handleChange(event);
            }}
        >
            {specimens.map((specimen) => (
                <MenuItem 
                    key={specimen.pbotID} 
                    value={specimen.pbotID}
                    data-name={specimen.name}
                    data-locality={specimen.locality}
                    data-organ={specimen.organ.pbotID}
                    data-preservationmode={specimen.preservationMode}
                    data-describedby={specimen.description ? specimen.description.Description.pbotID : ''}
                    data-exampleof={specimen.archtypeDescription ? specimen.archtypeDescription.Description.pbotID : ''}
                    data-idigbiouuid={specimen.idigbiouuid}
                    data-pbdbcid={specimen.pbdbcid}
                    data-pbdboccid={specimen.pbdboccid}
                    data-public={specimen.elementOf && specimen.elementOf.reduce((acc,group) => {return "public" === group.name}, false)}
                    data-groups={specimen.elementOf ? JSON.stringify(specimen.elementOf.map(group => group.pbotID)) : null}
                    data-references={specimen.references ? JSON.stringify(specimen.references.map(reference => reference.pbotID)) : null}
                    data-collection={specimen.collection ? specimen.collection.pbotID : ''}
                >{specimen.name}</MenuItem>
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
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    const collections = alphabetize([...data.Collection], "name");
    
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
        >
            {collections.map((collection) => (
                <MenuItem 
                    key={collection.pbotID} 
                    value={collection.pbotID}
                >{collection.name}</MenuItem>
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
    console.log("SpecimenDescriptionSelect");
    console.log(props);
    console.log(props.type);
    const descriptionGQL = gql`
            query {
                Description (type: "${props.type}") {
                    pbotID
                    name
                  	specimen {
                      Specimen {
                        name
                      }
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: descriptionLoading, error: descriptionError, data: descriptionData } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

    if (descriptionLoading) return <p>Loading...</p>;
    if (descriptionError) return <p>Error :(</p>;
                                 
    console.log(descriptionData);
    let descriptions = [...descriptionData.Description];
    
    descriptions = descriptions.reduce((acc, description) => {
        const newDesc = {...description};
        console.log(newDesc);

        if (newDesc.name) {
            acc.push(newDesc);
        } else {
            if (description.specimen) {
                console.log(description.specimen.Specimen.name);
                newDesc.name = description.specimen.Specimen.name;
                acc.push(newDesc);
            } 
        }
        return acc;
    }, []);
    
    console.log(descriptions);
    descriptions = alphabetize(descriptions, "name");
    console.log(descriptions);
    
    if (props.type === "specimen") {
        return (
            <Field 
               component={TextField}
                type="text"
                name="describedBy"
                label="Described by"
                fullWidth
                select={true}
                SelectProps={{
                    multiple: false,
                }}
                disabled={false}
                defaultValue=""
            >
                {descriptions.map(({ pbotID, name }) => (
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
                {descriptions.map(({ pbotID, name }) => (
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
                describedBy: '',
                exampleOf: '',
                otu: '',
                idigbiouuid: '',
                pbdbcid: '',
                pbdboccid: '',
                references: [],
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
                references: Yup.array().of(Yup.string()),
                collection: Yup.string(),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
           })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
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
                    
                    <ReferenceSelect />
                    <br />

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
                    
                    <DescriptionSelect type="specimen"/>
                    <br />

                    <DescriptionSelect type="OTU"/>
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
