import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';

import {
  useQuery,
  gql
} from "@apollo/client";


const OrganSelect = (props) => {
    console.log("OrganSelect");
    console.log(props);
    console.log(props.schema);
    const organGQL = gql`
            query {
                Organ {
                    type
                    organID
                }            
            }
        `;

    const { loading: organLoading, error: organError, data: organData } = useQuery(organGQL, {fetchPolicy: "cache-and-network"});

    if (organLoading) return <p>Loading...</p>;
    if (organError) return <p>Error :(</p>;
                                 
    console.log(organData.organs);
    const organs = [...organData.Organ];
    organs.sort((a,b) => {
        const nameA = a.type ? a.type.toUpperCase() : "z"; //"z" forces null names to end of list
        const nameB = b.type ? b.type.toUpperCase() : "z"; 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    
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
            {organs.map(({ organID, type }) => (
                <MenuItem key={organID} value={organID}>{type}</MenuItem>
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
                    descriptionID
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
    descriptions.sort((a,b) => {
        const nameA = a.name ? a.name.toUpperCase() : "z"; //"z" forces null names to end of list
        const nameB = b.name ? b.name.toUpperCase() : "z"; 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
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
                {descriptions.map(({ descriptionID, name }) => (
                    <MenuItem key={descriptionID} value={descriptionID}>{name}</MenuItem>
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
                {descriptions.map(({ descriptionID, name }) => (
                    <MenuItem key={descriptionID} value={descriptionID}>{name}</MenuItem>
                ))}
            </Field>
        )
    }
        
}


const SpecimenMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
        
    return (
       
        <Formik
            initialValues={{
                name: '',
                locality: '',
                organ: '',
                perservationMode: '',
                describedBy: '',
                exampleOf: '',
                otu: '',
                idigbiouuid: '',
                pbdbcid: '',
                pbdboccid: '',
            }}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                idigbiouuid: Yup.string().uuid('Must be a valid uuid'),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
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
                    name="name"
                    label="Name"
                    fullWidth 
                    disabled={false}
                >
                </Field>
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
                    name="perservationMode"
                    label="Preservation mode"
                    fullWidth 
                    disabled={false}
                >
                </Field>
                <br />
                
                <DescriptionSelect type="specimen" />
                <br />

                <DescriptionSelect type="OTU" />
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
