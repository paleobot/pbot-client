import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, Stack, TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
//import { Field, Form, Formik, useFormikContext } from 'formik';
//import { CheckboxWithLabel } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
//import { SensibleTextField } from '../SensibleTextField.js';
import { MultiManager } from '../MultiManager.js';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


const TextFieldController = ({name, label, control, errors}) => {
    const pathElements = name.split(".");

    let topName, index, fieldName;
    if (pathElements.length === 3) {
        topName = pathElements[0];
        index = pathElements[1];
        fieldName = pathElements[2];
    } else if (pathElements.length === 2) {
        topName = pathElements[0];
        fieldName = pathElements[1];          
    } 

    return (
        <Controller
            control={control}
            render={({ field }) => <TextField 
                {...field} 
                label={label}
                //error={!!errors.authors?.[index]?.person} 
                //helperText={errors.authors?.[index]?.person?.message}
                error={topName ?
                    index ? 
                        !!errors[topName]?.[index]?.[fieldName] :
                        !!errors[topName]?.[fieldName] :
                    !!errors[fieldName]
                } 
                helperText={topName ?
                    index ?
                        errors[topName]?.[index]?.[fieldName]?.message :
                        errors[topName]?.[fieldName]?.message :
                    errors[fieldName]?.message
                }
            />}
            name={name}
            style={{minWidth: "12ch", width:"100%"}}h
            disabled={false}
        />
    );
}


const authorShape = {
    person: '',
    givenname: '',
    surname: '',
    organization: ''
};
const AuthorFields = ({index, control, errors}) => {
      
    return (
        <Stack direction="column" spacing={0}>
            {/*
            <Controller
                control={control}
                render={({ field }) => <TextField 
                    {...field} 
                    label="Person"
                    error={!!errors.authors?.[index]?.person} 
                    helperText={errors.authors?.[index]?.person?.message}
                />}
                name={`authors.${index}.person`}
                style={{minWidth: "12ch", width:"100%"}}h
                disabled={false}
            />
            */}
            <TextFieldController name={`authors.${index}.person`} label="Person" control={control} errors={errors}/>
            <Controller
                control={control}
                render={({ field }) => <TextField 
                    {...field} 
                    label="Given name"
                />}
                name={`authors.${index}.givenname`}                
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
            <Controller
                control={control}
                render={({ field }) => <TextField 
                    {...field} 
                    label="Surname"
                />}
                name={`authors.${index}.surname`}               
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
            <Controller
                control={control}
                render={({ field }) => <TextField 
                    {...field} 
                    label="Organization"
                />}
                name={`authors.${index}.organization`}                
                style={{minWidth: "12ch", width:"100%"}}
                disabled={false}
            />
        </Stack>
    )
}    
/*           
const linkShape = {
    name: null,
    url: null,
};
const LinkFields = (props) => {
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <Field
                component={SensibleTextField}
                type="text"
                name={`links.${props.index}.name`}
                label="Name"
                style={{minWidth: "12ch", width:"35%"}}
                disabled={false}
            />
            <Field
                component={SensibleTextField}
                type="text"
                name={`links.${props.index}.url`}
                label="URL"
                style={{minWidth: "12ch", width:"35%"}}
                disabled={false}
            />
        </Stack>
    )
}    

const keywordShape = {
    name: null,
    type: null,
};
const KeywordFields = (props) => {
    const formikProps = useFormikContext()
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <Field
                component={SensibleTextField}
                type="text"
                name={`keywords.${props.index}.name`}
                label="Name"
                style={{minWidth: "12ch", width:"35%"}}
                disabled={false}
            />
            {/*
            <Field
                component={SensibleTextField}
                type="text"
                name={`keywords.${props.index}.type`}
                label="URL"
                style={{minWidth: "12ch", width:"35%"}}
                disabled={false}
            />
            *}
            <Field
                component={TextField}
                type="text"
                name={`keywords.${props.index}.type`}
                label="Type"
                style={{minWidth: "12ch", width:"35%"}}
                select={true}
                SelectProps={{
                    multiple: false,
                }}
                onChange={(event,child) => {
                    //props.handleSelect(JSON.parse(child.props.dperson))
                    console.log("onchange")
                    console.log(event)
                    console.log(child)
                    formikProps.setFieldValue(`keywords.${props.index}.type`, event.target.value);
                }}
                disabled={false}
            >
                {["theme", "place", "temporal"].map((type, idx) => (
                    <MenuItem 
                        key={idx} 
                        value={type}
                    >{type}</MenuItem>
                ))}
            </Field>

        </Stack>
    )
}    
*/

const CollectionMutateForm = ({handleSubmit: hSubmit, mode}) => {
    const initValues = {
        collection: '', 
        title: '',
        collectiongroup: '',
        authors: [{
            person: '',
            givenname: '',
            surname: '',
            organization: ''
        }],
        year: '',
        journal: {
            name: '',
            publisher: '',
            url: ''
        },
        series: '',
        abstract: '',
        informalname: '',
        links: [{
            name: null,
            url: null
        }],
        keywords: [{
            name: null,
            type: null
        }],
        language: 'English',
        license: {
            type: 'CC BY-NC-SA 4.0',
            url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
        },
        private: false,
        boundingbox: {
            west: -113,
            south: 33.5,
            east: -112,
            north: 34
        },
        documents: [],
        images: [],
        notes: [],
        metadata: [],
        gems2: [],
        ncgmp09: [],
        legacy: [],
        layers: [],
        raster: [],
        complete: ''
    };

    const validationSchema=Yup.object({
        title: Yup.string().required(),
        collectiongroup: Yup.string().required(),
        year: Yup.string().required(),
        authors: Yup.array().of(
            Yup.object().shape({
                person: Yup.string()
                    .required('Person is required'),
                givenname: Yup.string()
                    .required('Given name is required'),
                surname: Yup.string()
                    .required('Surname is required'),
                organization: Yup.string().nullable(),
            })
        ).min(1, 'At least one author is required'),
        journal: Yup.object().shape({
            name: Yup.string(),
            publisher: Yup.string(),
            url: Yup.string().url(),
        }),
        series: Yup.string(),
        abstract: Yup.string(),
        informalname: Yup.string(),
        /*
        links: Yup.array().of(
            Yup.object().shape({
                name: Yup.string(),
                url: Yup.string(),
            })
        ),
        keywords: Yup.array().of(
            Yup.object().shape({
                name: Yup.string(),
                type: Yup.string(),
            })
        ),
        */
        license: Yup.object().shape({
            name: Yup.string(),
            url: Yup.string().url(),
        }),
        private: Yup.boolean(),
        boundingbox: Yup.object().shape({
            west: Yup.number().min(-180).max(180),
            south: Yup.number().min(-90).max(90),
            east: Yup.number().min(-180).max(180),
            north: Yup.number().min(-90).max(90),
        }),
        documents: Yup.array().of(Yup.string()),
        images: Yup.array().of(Yup.string()),
        notes: Yup.array().of(Yup.string()),
        metadata: Yup.array().of(Yup.string()),
        gems2: Yup.array().of(Yup.string()),
        ncgmp09: Yup.array().of(Yup.string()),
        legacy: Yup.array().of(Yup.string()),
        layers: Yup.array().of(Yup.string()),
        raster: Yup.array().of(Yup.string()),
        complete: Yup.string()
    })

    const { handleSubmit, reset, control, watch, formState: {errors} } = useForm({
        defaultValues: initValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
        trigger: "onBlur",
      });
    
    const doSubmit = (data) => {
        //e.preventDefault();
        console.log("doSubmit")
        console.log(JSON.parse(JSON.stringify(data)))
        //console.log(data.authors[0])
        data.mode = mode;
        hSubmit(data);
        reset()
    }
    

    //To clear form when mode changes (this and the innerRef below). formikRef points to the Formik DOM element, 
    //allowing useEffect to call resetForm
    /*
    const formikRef = React.useRef();
    React.useEffect(() => {
        console.log("useEffect (mode)")
        if (formikRef.current) {
            formikRef.current.resetForm({values:initValues});
        }
    },[mode]);
    */

    const [selectedTab, setSelectedTab] = React.useState('1');
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "100%"}
    return (
       
        <form onSubmit={handleSubmit(doSubmit)} >
                <input 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete" || mode === "replace") &&
                    <div>
                        {/*<CollectionSelect name="collection" label="Collection" populateMode="full"/>*/}
                        <Controller
                            render={({ field }) => <TextField 
                                {...field}
                                error={!!errors.collection} 
                                helperText={errors.collection?.message}
                            />}
                            name="collection"
                            label="Collection"
                            control={control}
                            fullWidth 
                            disabled={false}
                        />
                        <br />
                    </div>
                }
                
                {(mode === "create" || ((mode === "edit" || mode === "replace") && props.values.collection !== '')) &&
                    <>
                    <Accordion style={accstyle} defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Required fields
                    </AccordionSummary>
                    <AccordionDetails>
                
                            <Controller
                                render={({ field }) => <TextField 
                                    {...field} 
                                    label="Title" 
                                    error={!!errors.title} 
                                    helperText={errors.title?.message}
                                />}
                                name="title"
                                control={control}
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Controller
                                render={({ field }) => <TextField 
                                    {...field} 
                                    label="Year"
                                    error={!!errors.year} 
                                    helperText={errors.year?.message}
                                />}
                                name="year"
                                control={control}
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            {/*<CollectionGroupSelect />*/}
                            <Controller
                                render={({ field }) => <TextField 
                                    {...field} 
                                    label="Collection group"
                                    error={!!errors.collectiongroup} 
                                    helperText={errors.collectiongroup?.message}
                                />}
                                name="collectiongroup"
                                control={control}
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                        </AccordionDetails>
                    </Accordion>

                    <Accordion style={accstyle}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="optional-content"
                            id="optional-header"                        
                        >
                            Optional fields
                        </AccordionSummary>
                        <AccordionDetails>

                            
                            <MultiManager label="Authors" name="authors" content={AuthorFields} shape={authorShape} control={control} watch={watch("authors")} errors={errors}/>
                            <br />
                            

                            <InputLabel>
                                Journal
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Controller
                                    render={({ field }) => <TextField
                                        {...field} 
                                        label="Name"
                                        error={!!errors.journal?.name} 
                                        helperText={errors.journal?.name?.message}
                                    />}
                                    name="journal.name"                               
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Controller
                                    render={({ field }) => <TextField
                                        {...field} 
                                        label="Publisher"
                                        error={!!errors.journal?.publisher} 
                                        helperText={errors.journal?.publisher?.message}
                                    />}
                                    name="journal.publisher"                          
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Controller
                                    render={({ field }) => <TextField 
                                        {...field} 
                                        label="URL"
                                        error={!!errors.journal?.url} 
                                        helperText={errors.journal?.url?.message}
                                    />}
                                    name="journal.url"                               
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                            <br />

                            <Controller
                                render={({ field }) => <TextField 
                                    {...field} 
                                    label="Series"
                                    error={!!errors.series} 
                                    helperText={errors.series?.message}
                                />}
                                name="series"                            
                                control={control}
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Controller
                                render={({ field }) => <TextField 
                                    {...field} 
                                    multiline 
                                    label="Abstract"
                                    error={!!errors.abstract} 
                                    helperText={errors.abstract?.message}
                                />}
                                name="abstract"                         
                                control={control}
                                fullWidth 
                                disabled={false}
                                variant="outlined"
                                sx={{marginTop:"0.5em"}}
                            />
                            <br />
                           
                            <Controller
                                render={({ field }) => <TextField 
                                    {...field} 
                                    label="Informal name"
                                    error={!!errors.informalname} 
                                    helperText={errors.informalname?.message}
                                />}
                                name="informalname"                      
                                control={control}
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            {/*}
                            <MultiManager label="Links" name="links" content={LinkFields} shape={linkShape} values={props.values} handleChange={props.handleChange} omitOrder={true}/>
                            <br />
                            */}
                            {/*
                            <InputLabel sx={{marginTop: "1.5em"}}>
                                Links
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="links[0].name"
                                    label="Name"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="links[0].url"
                                    label="URL"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                            <br />
                            */}

                            {/*}
                            <MultiManager label="Keywords" name="keywords" content={KeywordFields} shape={keywordShape} values={props.values} handleChange={props.handleChange} omitOrder={true}/>
                            <br />
                            */}
                            {/*
                            <InputLabel sx={{marginTop: "1.5em"}}>
                                Keywords
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="keywords[0].name"
                                    label="Name"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Field
                                    component={SensibleTextField}
                                    type="text"
                                    name="keywords[0].type"
                                    label="Type"
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                            <br />
                            */}

                            <Controller
                                render={({ field }) => <TextField 
                                    {...field} 
                                    label="Language"
                                    error={!!errors.language} 
                                    helperText={errors.language?.message}
                                />}
                                name="language"                          
                                control={control}
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <InputLabel sx={{ marginTop:"1.5em"}}>
                                License
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Controller
                                    render={({ field }) => <TextField 
                                        {...field} 
                                        label="Name"
                                        error={!!errors.license?.type} 
                                        helperText={errors.license?.type?.message}    
                                    />}
                                    name="license.type"                               
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Controller
                                    render={({ field }) => <TextField 
                                        {...field} 
                                        label="URL"
                                        error={!!errors.license?.url} 
                                        helperText={errors.license?.url?.message}    
                                    />}
                                    name="license.url"                                 
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                            <br />
                        
                            <FormControlLabel
                                control={
                                <Controller
                                    name="private"
                                    control={control}
                                    render={({ field: props }) => (
                                    <Checkbox
                                        {...props}
                                        checked={props.value}
                                        onChange={(e) => props.onChange(e.target.checked)}
                                        error={!!errors.private} 
                                        helperText={errors.private?.message}    
                                    />
                                    )}
                                />
                                }
                                label="Private"
                            />                            
                            <br />

                            <InputLabel>
                                Bounding box
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <Controller
                                    render={({ field }) => <TextField 
                                        {...field} 
                                        label="West"
                                        error={!!errors.boundingbox?.west} 
                                        helperText={errors.boundingbox?.west?.message}    
                                    />}
                                    name="boundingbox.west"                                
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Controller
                                    render={({ field }) => <TextField 
                                        {...field} 
                                        label="South"
                                        error={!!errors.boundingbox?.south} 
                                        helperText={errors.boundingbox?.south?.message}    
                                    />}
                                    name="boundingbox.south"                               
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Controller
                                    render={({ field }) => <TextField 
                                        {...field} 
                                        label="East"
                                        error={!!errors.boundingbox?.east} 
                                        helperText={errors.boundingbox?.east?.message}    
                                    />}
                                    name="boundingbox.east"                                
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                                <Controller
                                    render={({ field }) => <TextField 
                                        {...field} 
                                        label="North"
                                        error={!!errors.boundingbox?.north} 
                                        helperText={errors.boundingbox?.north?.message}    
                                    />}
                                    name="boundingbox.north"                               
                                    control={control}
                                    style={{minWidth: "12ch", width:"35%"}}
                                    disabled={false}
                                />
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                
                    </>
                }
                

                <br />
                <br />

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                    <Button type="reset" variant="outlined" color="secondary">Reset</Button>
                </Stack>
                <br />
                <br />
            </form>
    
    );
};

export default CollectionMutateForm;
