import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const OTUSelect = (props) => {
    console.log("OTUSelect");
    console.log(props);
    console.log(props.values);
    const gQL = gql`
            query {
                OTU {
                    pbotID
                    name
                    family
                    genus
                    species
                  	exampleSpecimens {
                      Specimen {
                        name
                        pbotID
                      }
                    }
                    holotype {
                        Specimen {
                            name
                            pbotID
                        }
                    }
                    references {
                        Reference {
                            pbotID
                        }
                        order
                    }
                    elementOf {
                        name
                        pbotID
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data);
    let otus = [...data.OTU];
        
    console.log(otus);
    otus = alphabetize(otus, "name");
    console.log(otus);
    
    const style = {minWidth: "12ch"}
    return (
        <Field 
            style={style}
            component={TextField}
            type="text"
            name="otu"
            label="OTU"
            fullWidth
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                console.log("onChange");
                console.log(child.props);
                console.log(child.props.dexamplespecimens);
                props.values.name = child.props.dname;
                props.values.family = child.props.dfamily;
                props.values.genus = child.props.dgenus;
                props.values.species = child.props.dspecies;
                props.values.exampleSpecimens = child.props.dexamplespecimens ? JSON.parse(child.props.dexamplespecimens) : [];
                props.values.holotypeSpecimen = child.props.dholotypespecimen;
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.values.public = "true"=== child.props.dpublic || false;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                //props.resetForm();
                props.handleChange(event);
            }}
        >
            {otus.map((otu) => (
                <MenuItem 
                    key={otu.pbotID} 
                    value={otu.pbotID} 
                    dname={otu.name} 
                    dfamily={otu.family}
                    dgenus={otu.genus}
                    dspecies={otu.species}
                    dexamplespecimens={otu.exampleSpecimens ? JSON.stringify(otu.exampleSpecimens.map(specimen => specimen.Specimen.pbotID)) : null}
                    dholotypespecimen={otu.holotype.Specimen.pbotID}
                    dreferences={otu.references ? JSON.stringify(otu.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                    dpublic={otu.elementOf && otu.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={otu.elementOf ? JSON.stringify(otu.elementOf.map(group => group.pbotID)) : null}
                >{otu.name}</MenuItem>
            ))}
        </Field>
    )
        
}

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    /*
    //TODO: Now that I'm filtering in the query, this isn't needed. Keeping it here for now in case I change my mind.
    const specimenGQL = gql`
        query {
            Specimen {
                pbotID
                name
            }            
        }
    `;
    */
    let specimenGQL;
    if ("holotype" === props.type) {
        specimenGQL = gql`
            query {
                Specimen (filter: {pbotID_in: ${JSON.stringify(props.values.exampleSpecimens)}}) {
                    pbotID
                    name
                }            
            }
        `;
    } else {
        specimenGQL = gql`
            query {
                Specimen {
                    pbotID
                    name
                }            
            }
        `;
    }
    
    const { loading: specimenLoading, error: specimenError, data: specimenData } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    if (specimenLoading) return <p>Loading...</p>;
    if (specimenError) return <p>Error :(</p>;
                                 
    console.log(specimenData.Specimen);
    let specimens = alphabetize([...specimenData.Specimen], "name");

    if (props.type === "holotype") {
        //TODO: Now that I'm filtering in the query, this isn't needed. Keeping it here for now in case I change my mind.
        //Only want to offer example of specimens as holotype.
        //specimens = specimens.reduce((acc,specimen) => (props.values.exampleSpecimens.includes(specimen.pbotID) ? acc.concat(specimen) : acc),[]);
        //console.log(specimens);
        return (
            <Field
                component={TextField}
                type="text"
                name="holotypeSpecimen"
                label="Holotype specimen"
                style={{minWidth:"200px"}}
                select={true}
                SelectProps={{
                    multiple: false,
                }}
                sx={{minWidth:"200px"}}
                disabled={false}
                onChange={(event,child) => {
                    props.handleChange(event);
                }}
            >
                <MenuItem key="0" value="">&nbsp;</MenuItem>
                {specimens.map(({ pbotID, name }) => (
                    <MenuItem key={pbotID} value={pbotID} dname={name}>{name}</MenuItem>
                ))}
            </Field>
        )
    } else {
        return (
            <Field
                component={TextField}
                type="text"
                name="exampleSpecimens"
                label="Example specimens"
                sx={{minWidth:"200px"}}
                select={true}
                SelectProps={{
                    multiple: true,
                }}
                disabled={false}
                onChange={(event,child) => {
                    if (child.props.value === props.values.holotypeSpecimen) props.values.holotypeSpecimen = ''; //clear holotype if it is the example getting touched here
                    props.handleChange(event);
                }}
            >
                {specimens.map(({ pbotID, name }) => (
                    <MenuItem key={pbotID} value={pbotID} dname={name}>{name}</MenuItem>
                ))}
            </Field>
        )
    }
}


const OTUMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                otu: '',
                exampleSpecimens: [],
                holotypeSpecimen: '',
                family: '', 
                genus: '', 
                species: '',
                name: '',
                references: [{
                    pbotID: '',
                    order:'',
                }],
                public: true,
                groups: [],
                cascade: false,
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
                family: Yup.string().nullable().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                genus: Yup.string().nullable().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                species: Yup.string().nullable().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                name: Yup.string().nullable().required(),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                }),
                holotypeSpecimen: Yup.string().required("Holotype specimen required"),
                exampleSpecimens: Yup.array().min(1, "At least one example specimen required"),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                //values.family = null;
                //values.genus = null;
                //values.species = null;
                //values.specimen = null;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values:initValues});
            }}
        >
            {props => (
            <Form>
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <OTUSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.otu !== '')) &&
                <div>
                
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    disabled={false}
                />
                <br />
               
                <Field 
                    component={TextField}
                    name="family" 
                    type="text" 
                    label="Family"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="genus" 
                    type="text" 
                    label="Genus"
                    disabled={false}
                    onChange={event => {
                        props.handleChange(event)
                    }}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="species" 
                    type="text" 
                    label="Species"
                    disabled={false}
                    onChange={event => {
                        props.handleChange(event)
                    }}
                />
                <br />
          
                <SpecimenSelect type="example" values={props.values} handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                <br />
                
                <SpecimenSelect type="holotype" values={props.values} handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                <br />
                
                <ReferenceManager values={props.values}/>
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
                
                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />

                {(mode === "delete") &&
                <div>
                    <Field
                        component={CheckboxWithLabel}
                        name="cascade"
                        type="checkbox" 
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

export default OTUMutateForm;
