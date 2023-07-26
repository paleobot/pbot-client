import React, { useState, useEffect }from 'react';
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Box, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select, SimpleFileUpload } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {SecureImage} from './SecureImage.js';
import {LinkDialog} from "./LinkDialog.js";
import { SensibleTextField } from '../SensibleTextField.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql,
  useApolloClient,
  useMutation,
} from "@apollo/client";
import { ImageCategorySelect } from './ImageCategorySelect.js';

const PreviewImage = (props) => {
    console.log("UploadImage");
    console.log(props);
    console.log(props.values.uploadImage);
    const {setFieldValue} = useFormikContext();
    if (props.values.uploadImage) {
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
        );
    } else if (props.values.link) {
        return (
            <Grid container spacing={2} direction="row" >
                <Grid item xs={6}>
                    {/*<img src={props.values.link} width="200"/>*/}
                    <SecureImage src={props.values.link} width="200"/>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        type="button"
                        variant="text" 
                        color="secondary" 
                        size="large"
                        onClick={() => setFieldValue("link", '')} 
                    >
                        X
                    </Button>
                </Grid>
                <br />
            </Grid>
        );
    } else {
        return (
            <div></div>
        );
    }
}

/*
 * TODO:unused. Ghosting for now
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
*/

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

const ImageSelect = (props) => {
    console.log("ImageSelect");

    const gQL = gql`
            query {
                Image (filter: { OR: [{imageOf: {pbotID: "${props.values.specimen}"}}, {imageOf: null}]}) {
                    pbotID
                    link
                    category
                    citation
                    caption
                    type
                    elementOf {
                        name
                        pbotID
                    }
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Image);
    
    //const images = alphabetize([...data.Image], "link"); //TODO: No reason to alphabetize on link. Better to use the file name at the end of link?
    const images = [...data.Image];
    console.log(images)
    
    return (
        <Field
            component={TextField}
            type="text"
            name="image"
            label="Image node"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.link = child.props.dlink ? child.props.dlink : '';
                props.values.category = child.props.dcategory ? child.props.dcategory : '';
                props.values.citation = child.props.dcitation ? child.props.dcitation : '';
                props.values.caption = child.props.dcaption ? child.props.dcaption : '';
                props.values.type = child.props.dtype ? JSON.parse(child.props.dtype) : '';
                props.values.public =  "true"===child.props.dpublic;;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.handleChange(event);
            }}
        >
            {images.map((image) => (
                <MenuItem 
                    key={image.pbotID} 
                    value={image.pbotID}
                    dlink={image.link}
                    dcategory={image.category}
                    dcitation={image.citation}
                    dcaption={image.caption}
                    dtype={image.type}
                    dpublic={image.elementOf && image.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={image.elementOf ? JSON.stringify(image.elementOf.map(group => group.pbotID)) : null}
                >
                    <SecureImage src={image.link} width="100"/>
                </MenuItem>
            ))}
        </Field>
    )
}

const FILE_SIZE_LIMIT = process.env.REACT_APP_FILE_SIZE_LIMIT;
const SUPPORTED_IMAGE_FORMATS = process.env.REACT_APP_SUPPORTED_IMAGE_FORMATS.split(";");

const ImageMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                image: '',
                collection: '', 
                specimen: '',
                uploadImage:'',
                link: '',
                category: '',
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
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                collection: Yup.string().required(),
                specimen: Yup.string().required(),
                link: Yup.string(),                    
                uploadImage: Yup.mixed()
                    .test("fileSize", "File too large", value => value ? value.size <= FILE_SIZE_LIMIT : true)
                    .test("fileFormat", "Unsupported Format", value => value ? SUPPORTED_IMAGE_FORMATS.includes(value.type) : true)
                    .when("link", {
                        is: (link) => !link,
                        then: Yup.mixed().required("File or link required"),
                        otherwise: Yup.mixed()
                    }),
                category: Yup.string().required(),
                citation: Yup.string().required(),
                caption: Yup.string().required(),
                type: Yup.string(),
                                        
            })}
            onSubmit={(values, {resetForm}) => {
                //console.log(values.uploadImage);
                //alert(JSON.stringify(values.uploadImage, null, 2));
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
                
                <CollectionSelect values={props.values} handleChange={props.handleChange}/>
                <br />
            
                {props.values.collection !== '' &&
                    <div>
                    <SpecimenSelect values={props.values}/>
                    <br />
                    </div>
                }
                                    
                {props.values.specimen !== '' && 
                    <div>
                    {("delete" === props.values.mode || "edit" === props.values.mode) &&
                        <div>
                        <ImageSelect values={props.values}  handleChange={props.handleChange}/>
                        <br />
                        </div>
                    }
                

                    {("create" === props.values.mode || ("edit" === props.values.mode && props.values.image !== '')) &&
                        <div>
                        <Accordion style={accstyle} defaultExpanded={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="required-content"
                                id="required-header"                        
                            >
                                Required fields
                            </AccordionSummary>
                            <AccordionDetails>

                                <InputLabel>
                                    Image
                                </InputLabel>
                                {!props.values.uploadImage && !props.values.link &&
                                    <Stack direction="row" spacing={3}>
                                            <Button variant="outlined" color="secondary" component="label">
                                                File
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
                                            <span>or</span>
                                            <LinkDialog values={props.values}/>
                                    </Stack>
                                }
                                {(props.values.uploadImage || props.values.link) &&
                                    <PreviewImage values={props.values}/>
                                }
                                <ErrorMessage name="uploadImage">
                                    { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                </ErrorMessage>

                                <ImageCategorySelect />
                                <br />

                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="citation"
                                    label="Credit"
                                    fullWidth 
                                    disabled={false}
                                />
                                <br />

                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="caption"
                                    label="Caption"
                                    fullWidth 
                                    disabled={false}
                                />
                                <br />

                                {/*}
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="type"
                                    label="Type"
                                    fullWidth 
                                    disabled={false}
                                />
                                <br />
                                */}

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
                                    <GroupSelect omitPublic={true} />
                                    <br />
                                </div>
                                }
                            </AccordionDetails>
                        </Accordion>

                        <Accordion style={accstyle} disabled={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="optional-content"
                                id="optional-header"                        
                            >
                                Optional fields
                            </AccordionSummary>
                            <AccordionDetails >
                                None
                            </AccordionDetails>
                        </Accordion>
                        
                        </div>
                    }
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

export default ImageMutateForm;
