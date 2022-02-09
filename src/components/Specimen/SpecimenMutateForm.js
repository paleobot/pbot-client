import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';
import { alphabetize } from '../../util.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
            query {
                Specimen {
                    pbotID
                    name
                    locality
                    organ {
                        pbotID
                        type
                    }
                    description {
                      	Description {
                        	pbotID
                        	name
                      	}
                    }
                    archtypeDescription {
                      	Description {
                        	pbotID
                        	name
                        }
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
                props.handleChange(event);
            }}
        >
            {specimens.map(({ pbotID, name, locality, organ, preservationMode, description, archtypeDescription, idigbiouuid, pbdbcid, pbdboccid }) => (
                <MenuItem 
                    key={pbotID} 
                    value={pbotID}
                    data-name={name}
                    data-locality={locality}
                    data-organ={organ.organID}
                    data-preservationmode={preservationMode}
                    data-describedby={description ? description.Description.pbotID : ''}
                    data-exampleof={archtypeDescription ? archtypeDescription.Description.pbotID : ''}
                    data-idigbiouuid={idigbiouuid}
                    data-pbdbcid={pbdbcid}
                    data-pbdboccid={pbdboccid}
                >{name}</MenuItem>
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
                perservationMode: '',
                describedBy: '',
                exampleOf: '',
                otu: '',
                idigbiouuid: '',
                pbdbcid: '',
                pbdboccid: '',
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
                idigbiouuid: Yup.string().uuid('Must be a valid uuid'),
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
