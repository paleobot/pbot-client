import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';

import {
  useQuery,
  gql
} from "@apollo/client";

/*
const NameField = (props) => {
  const {
    values: { type, specimen, genus, species },
    touched,
    setFieldValue,
  } = useFormikContext();
  const [field, meta] = useField(props);

  React.useEffect(() => {
    // set the value of textC, based on textA and textB
    if (type === "OTU") {
        if (touched.genus && ouched.species) {
            setFieldValue(props.name, genus + " " + species);
        }
    } else {
        if (touched.specimen) {
            setFieldValue(props.name, specimen);
        }
    }
  }, [type, genus, species, specimen, touched.genus, touched.species, touched.specimen, setFieldValue, props.name]);
  return (
    <>
      <input {...props} {...field} />
      {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
    </>
  );
};
*/

const DescriptionMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
    
    const specimenGQL = gql`
            query {
                Specimen {
                    specimenID
                    name
                }            
            }
        `;

    const { loading: specimenLoading, error: specimenError, data: specimenData } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    //if (loading) return <p>Loading...</p>;
    //if (error) return <p>Error :(</p>;
                                 

    const schemaGQL = gql`
            query {
                Schema {
                    schemaID
                    title
                }            
            }
        `;

    const { loading: schemaLoading, error: schemaError, data: schemaData } = useQuery(schemaGQL, {fetchPolicy: "cache-and-network"});

    if (specimenLoading || schemaLoading) return <p>Loading...</p>;
    if (specimenError || schemaError) return <p>Error :(</p>;
                                 
    console.log(specimenData.Specimen);
    
    const specimens = specimenData.Specimen;
    console.log(specimens);
 
    console.log(schemaData.Schema);
    
    const schemas = schemaData.Schema;
    console.log(schemas);
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                type: '',
                schema: '',
                specimen: '',
                family: '', 
                genus: '', 
                species: '',
            }}
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
                specimen: Yup.string().when("type", {
                    is: (val) => val === "specimen",
                    then: Yup.string().required()
                }),
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
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
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
                resetForm();
            }}
        >
            {props => (
            <Form>
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
                >
                    <MenuItem value="OTU">OTU</MenuItem>
                    <MenuItem value="specimen">Specimen</MenuItem>
                </Field>
                <br />

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
                    {schemas.map(({ schemaID, title }) => (
                        <MenuItem key={schemaID} value={schemaID}>{title}</MenuItem>
                    ))}
                </Field>
                <br />
                
                {props.values.type === "specimen" &&
                    <div>
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
                        >
                            {specimens.map(({ specimenID, name }) => (
                                <MenuItem key={specimenID} value={specimenID}>{name}</MenuItem>
                            ))}
                        </Field>
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
                        />
                        <br />
                        
                        <Field 
                            component={TextField}
                            name="species" 
                            type="text" 
                            label="Species"
                            disabled={false}
                        />
                        <br />
                    </div>
                }
          
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    value={props.values.type === "OTU" ?
                                props.values.genus + " " + props.values.species :
                                props.values.specimen}
                    disabled={false}
                />
          
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
