import React, { useState, useEffect }from 'react';
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Box } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select, SimpleFileUpload } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {SecureImage} from './SecureImage.js';
import {LinkDialog} from "./LinkDialog.js";

import {
  useQuery,
  gql,
  useApolloClient,
  useMutation,
} from "@apollo/client";

const PreviewImage = (props) => {
    console.log("UploadImage");
    console.log(props);
    console.log(props.values.uploadImage);
    const {setFieldValue} = useFormikContext();
        return (
            <Grid container spacing={2} direction="row" >
                <Grid item xs={6}>
                    <img src={URL.createObjectURL(props.values.uploadImage)} width="200"/>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        type="button"
                        variant="text" 
                        color="secondary" 
                        size="large"
                        onClick={() => setFieldValue("uploadImage", '')} 
                    >
                        X
                    </Button>
                </Grid>
                <br />
            </Grid>
        )
}

const UploadImage = (props) => {
    console.log("UploadImage");
    console.log(props);
    console.log(props.values.uploadImage);
    
    const client = useApolloClient();
    const {setFieldValue} = useFormikContext();
    
    const gQL = gql`
        mutation UploadImage($image: Upload!, $specimenID: String!) {
            UploadImage(image: $image, specimenID: $specimenID) {
                link
            }
        }
    `;
    
    console.log("before useMutation");
    const [uploadFileMutation, { data, loading, error }] = useMutation(gQL, {variables: {image: props.values.uploadImage, specimenID: props.values.specimen }});
    console.log("before useEffect");
    useEffect(() => {
            uploadFileMutation().catch((err) => {
                //Just eat it. The UI will get what it needs below through the error field defined on the hook.
                console.log("catch");
                console.log(err);
            });
    }, []);
    console.log("after useEffect");

    if (loading) {
        return <p>Loading...</p>;
    } else if (error) {
        console.log("ERROR!");
        console.log(error);
        return <p>Error: {error.message}</p>;
    } else if (data) {
        console.log(data);
        
        //Force reload of cache
        client.resetStore();
        
        props.values.link = data.UploadImage.link;
        
        return (
            <Grid container spacing={2} direction="row" >
                <Grid item xs={6}>
                     <SecureImage src={props.values.link}  />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        type="button"
                        variant="text" 
                        color="secondary" 
                        size="large"
                        onClick={() => setFieldValue("uploadImage", '')} 
                    >
                        X
                    </Button>
                </Grid>
                <br />
            </Grid>
        )
        
    } else {
        return (<div></div>); //gotta return something until addDescription runs
    }

}

const CollectionSelect = (props) => {
    console.log("CollectionSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Collection {
                pbotID
                name
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
            name="specimen"
            label="Specimen"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {specimens.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}


const ImageMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                image: '',
                collection: '', 
                specimen: '',
                uploadImage:'',
                link: '',
                citation: '',
                caption: '',
                type: '',
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
                collection: Yup.string().required(),
                specimen: Yup.string().required(),
                //link: Yup.string().required(),
                name: Yup.string(),
                ciation: Yup.string(),
                caption: Yup.string(),
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
                
                <CollectionSelect values={props.values} handleChange={props.handleChange}/>
                <br />
            
                {props.values.collection !== '' &&
                    <div>
                    <SpecimenSelect values={props.values}/>
                    <br />
                    </div>
                }
                
                {/*<LinkDialog values={props.values}/>*/}
                    
                {props.values.specimen !== '' &&
                    <div>
                    <InputLabel>
                        Image
                    </InputLabel>
                    {!props.values.uploadImage &&
                        <Button color="secondary" component="label">
                        Choose file
                        <input 
                            name="uploadImage"
                            hidden 
                            accept="image/*" 
                            onChange={(event) => {
                                console.log("------------onChange---------------");
                                //props.values.uploadImage = event.target.files[0]
                                props.setFieldValue("uploadImage",event.target.files[0]);
                                console.log(props.values.uploadImage);
                            }}
                            type="file" 
                        />
                        </Button>
                    }
                    {props.values.uploadImage &&
                        <PreviewImage values={props.values}/>
                    }

                    <Field
                        component={TextField}
                        type="text"
                        name="citation"
                        label="Citation"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="caption"
                        label="Caption"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="type"
                        label="Type"
                        fullWidth 
                        disabled={false}
                    />
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

export default ImageMutateForm;
