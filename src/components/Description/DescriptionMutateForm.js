import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    console.log(props.values);
    const descriptionGQL = gql`
            query {
                Description {
                    pbotID
                    type
                    name
                    family
                    genus
                    species
                  	schema {
                      pbotID
                    }
                  	specimen {
                      Specimen {
                        name
                        pbotID
                      }
                    }
                    elementOf {
                        pbotID
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
    
    //TODO: This was necessary because we initially did not have name fields in specimen Descriptions.
    //I require that now, but there are still some that do not have this.
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
    
    const style = {minWidth: "12ch"}
    return (
        <Field 
            style={style}
            component={TextField}
            type="text"
            name="description"
            label="Description"
            fullWidth
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            defaultValue=""
            onChange={event => {
                props.values.schema = event.currentTarget.dataset.schema;
                props.values.name = event.currentTarget.dataset.name;
                props.values.type = event.currentTarget.dataset.type;
                props.values.family = event.currentTarget.dataset.family;
                props.values.genus = event.currentTarget.dataset.genus;
                props.values.species = event.currentTarget.dataset.species;
                props.values.specimen = event.currentTarget.dataset.specimen;
                props.values.groups = event.currentTarget.dataset.groups ? JSON.parse(event.currentTarget.dataset.groups) : [];
                //props.resetForm();
                props.handleChange(event);
            }}
        >
            {descriptions.map((description) => (
                <MenuItem 
                    key={description.pbotID} 
                    value={description.pbotID} 
                    data-schema={description.schema.pbotID} 
                    data-name={description.name} 
                    data-type={description.type}
                    data-family={description.family}
                    data-genus={description.genus}
                    data-species={description.species}
                    data-specimen={description.specimen ? description.specimen.Specimen.pbotID : ''}
                    data-groups={description.elementOf ? JSON.stringify(description.elementOf.map(group => group.pbotID)) : null}
                >{description.name}</MenuItem>
            ))}
        </Field>
    )
        
}

const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    const schemaGQL = gql`
            query {
                Schema {
                    pbotID
                    title
                }            
            }
        `;

    const { loading: schemaLoading, error: schemaError, data: schemaData } = useQuery(schemaGQL, {fetchPolicy: "cache-and-network"});

    if (schemaLoading) return <p>Loading...</p>;
    if (schemaError) return <p>Error :(</p>;
                                 
    console.log(schemaData.Schema);
    const schemas = alphabetize([...schemaData.Schema], "title");
    
    return (
        <Field
            component={TextField}
            type="text"
            name="schema"
            label="Schema"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {schemas.map(({ pbotID, title }) => (
                <MenuItem key={pbotID} value={pbotID}>{title}</MenuItem>
            ))}
        </Field>
    )
}

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    const specimenGQL = gql`
            query {
                Specimen {
                    pbotID
                    name
                }            
            }
        `;

    const { loading: specimenLoading, error: specimenError, data: specimenData } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    if (specimenLoading) return <p>Loading...</p>;
    if (specimenError) return <p>Error :(</p>;
                                 
    console.log(specimenData.Specimen);
    const specimens = alphabetize([...specimenData.Specimen], "name");
    
    return (
        <Field
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
                props.handleChange(event);
                props.setFieldValue("name", event.currentTarget.dataset.name)
            }}
        >
            {specimens.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID} data-name={name}>{name}</MenuItem>
            ))}
        </Field>
    )
}


const DescriptionMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                description: '',
                type: '',
                schema: '',
                specimen: '',
                family: '', 
                genus: '', 
                species: '',
                name: '',
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
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                type: Yup.string().required(),
                schema: Yup.string().required(),
                //TODO: decide if specimen is required for specimen types                         
                //specimen: Yup.string().when("type", {
                //    is: (val) => val === "specimen",
                //    then: Yup.string().required()
                //}),
                family: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                genus: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                species: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                name: Yup.string().required(),
                groups: Yup.array().of(Yup.string()).required(),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                if (values.type === "specimen") {
                    values.family = null;
                    values.genus = null;
                    values.species = null;
                } else {
                    values.specimen = null;
                }
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
                resetForm({values:initValues});
            }}
        >
            {props => (
            <Form>
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <DescriptionSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.description !== '')) &&
                <div>
                
                <Field
                    component={TextField}
                    type="text"
                    name="type"
                    label="Type"
                    fullWidth 
                    disabled={false}
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    onChange={event => {
                        props.resetForm();
                        props.handleChange(event);
                    }}
                >
                    <MenuItem value="OTU">OTU</MenuItem>
                    <MenuItem value="specimen">Specimen</MenuItem>
                </Field>
                <br />

                <SchemaSelect />
                <br />
                
                {props.values.type === "specimen" &&
                    <div>
                    <SpecimenSelect handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                    <br />
                    </div>
                }
                
                {props.values.type === "OTU" &&
                    <div>
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
                                props.setFieldValue("name", event.target.value + " " + props.values.species)
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
                                props.setFieldValue("name", props.values.genus + " " + event.target.value)
                            }}
                        />
                        <br />
                    </div>
                }
          
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    disabled={false}
                />
                
                <GroupSelect />
                <br />
                
                </div>
                }
                
                <Field 
                    component={TextField}
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />

                {(mode === "delete") &&
                <div>
                    <Field
                        type="checkbox"
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

export default DescriptionMutateForm;
