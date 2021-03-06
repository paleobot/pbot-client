import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
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

const CollectionSelect = (props) => {
    console.log("CollectionSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Collection {
                pbotID
                name
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
                    dspecimens={collection.specimens ? JSON.stringify(collection.specimens.map(specimen => specimen.pbotID)) : null}
                    dreferences={collection.references ? JSON.stringify(collection.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order}})) : null}
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


const CollectionMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                collection: '', 
                name: '',
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
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                name: Yup.string().required(),
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
                handleQueryParamChange(values);
                setShowResult(true);
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
