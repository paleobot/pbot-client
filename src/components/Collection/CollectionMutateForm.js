import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, Stack, TextField, MenuItem, Checkbox, FormControlLabel, Select, FormControl, Typography, Box, Tab } from '@mui/material';
//import { Field, Form, Formik, useFormikContext } from 'formik';
//import { CheckboxWithLabel } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
//import { SensibleTextField } from '../SensibleTextField.js';
import { MultiManager } from '../MultiManager.js';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ExistingCollectionManager } from './ExistingCollectionManager';
import { TextFieldController } from '../util/TextFieldController';
import { FileSelectController } from '../util/FileSelectController.jsx';
import ClearIcon from '@mui/icons-material/Clear';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const LabeledCheckboxController = ({name, label, control, errors, ...props}) => {
    //Note 1: We could add path elements here to allow for nested checkboxes, but we don't need it right now. If we do, we can use the same logic as in TextFieldController, or better yet, we could factor it out into a common controller function.

    return (
        <Controller
            control={control}
            render={({ field }) => <FormControlLabel 
                label={label}        
                control={
                    <Checkbox
                        {...field} 
                        {...props}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                    />
               }
            />}
            error={!!errors[name]} 
            helperText={errors[name]?.message}    
            name={name}
        />   
    )

}                         

const SelectController = ({name, label, options, control, errors, ...props}) => {
    //Note 1: We could add path elements here to allow for nested checkboxes, but we don't need it right now. If we do, we can use the same logic as in TextFieldController, or better yet, we could factor it out into a common controller function.

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
  
    React.useEffect(() => {
        const fetchData = async () => {
            //If options is an array, we don't need to fetch anything. Just set the data.
            if (Array.isArray(options)) {
                setData(options);
                setLoading(false);
                return;
            }

            //Otherwise, we need to fetch the data. 
            //TODO: For now, I'm assuming options is a URL. I might change that to expect only the path, and then add the base URL in the fetchData function.
            try {
                const response = await fetch(options.url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let json = await response.json();
                json = json.data.map((item) => {
                    return {
                        name: item[options.nameField],
                        value: item[options.valueField]
                    }
                })
                setData(json);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        }

        fetchData();
    }, []);
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (error) {
      return <p>Error: {error.message}</p>;
    }
  
    return (
        <Controller
            control={control}
            error={!!errors[name]} 
            helperText={errors[name]?.message}    
            name={name}
            render={({ field }) => 
                <TextField
                    {...field}
                    {...props}
                    select
                    sx={[
                        {minWidth: "12ch"},
                        // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
                        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
                    ]}
                    label={label}
                >
                    {data.map((option, index) => (
                        <MenuItem value={option.value}>{option.name}</MenuItem>
                    ))}
                </TextField>
            }
        />
    )
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
            <TextFieldController name={`authors.${index}.person`} label="Person" control={control} errors={errors} sx={{width:"75%"}}/>

            <TextFieldController name={`authors.${index}.givenname`} label="Given name" control={control} errors={errors} sx={{width:"75%"}}/>     

            <TextFieldController name={`authors.${index}.surname`} label="Surname" control={control} errors={errors} sx={{width:"75%"}}/>

            <TextFieldController name={`authors.${index}.organization`} label="Organization" control={control} errors={errors} sx={{width:"75%"}}/>
        </Stack>
    )
}    
           
const linkShape = {
    name: '',
    url: '',
};
const LinkFields = ({index, control, errors}) => {
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <TextFieldController name={`links.${index}.name`} label="Name" control={control} errors={errors} sx={{width:"75%"}}/>

            <TextFieldController name={`links.${index}.url`} label="URL" control={control} errors={errors} sx={{width:"75%"}}/>
         </Stack>
    )
}    


const keywordShape = {
    name: '',
    type: '',
};
const KeywordFields = ({index, control, errors}) => {
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <TextFieldController name={`keywords.${index}.name`} label="Name" control={control} errors={errors} sx={{width:"75%"}}/>
            <SelectController 
                name={`keywords.${index}.type`} 
                label="Type" 
                options={[
                    {name: "theme", value: "theme"}, 
                    {name: "place", value: "place"}, 
                    {name: "temporal", value: "temporal"}
                ]} 
                control={control} 
                errors={errors} 
                sx={{minWidth: "12ch", width:"75%"}} 
                variant="standard"
            />
        </Stack>
    )
}    

const fileShape = {
    name: '',
};
const FileFields = ({name, index, control, errors}) => {
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <FileSelectController name={`${name}.${index}.name`} control={control} errors={errors} sx={{width:"75%"}}/>
        </Stack>
    )
}    

const CollectionMutateForm = ({handleSubmit: hSubmit, mode}) => {
    const initValues = {
        identifiers: {
            perm_id: '',
        }, 
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
        links: [/*{
            name: '',
            url: ''
        }*/],
        keywords: [{
            name: '',
            type: ''
        }],
        language: 'English',
        license: {
            type: 'CC BY-NC-SA 4.0',
            url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
        },
        private: false,
        bounding_box: {
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
        complete: '',
        //extra fields, not part of collection metadata
        oldCollection: '',
        oldCollections: [],
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
        links: Yup.array().of(
            Yup.object().shape({
                name: Yup.string(),
                url: Yup.string().url(),
            })
        ),
        keywords: Yup.array().of(
            Yup.object().shape({
                name: Yup.string(),
                type: Yup.string(),
            })
        ),
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
        //documents: Yup.array().of(Yup.string()),
        //images: Yup.array().of(Yup.string()),
        //notes: Yup.array().of(Yup.string()),
        //metadata: Yup.array().of(Yup.string()),
        //gems2: Yup.array().of(Yup.string()),
        //ncgmp09: Yup.array().of(Yup.string()),
        //legacy: Yup.array().of(Yup.string()),
        //layers: Yup.array().of(Yup.string()),
        //raster: Yup.array().of(Yup.string()),
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
                        <ExistingCollectionManager mode={mode} control={control} reset={reset} watch={watch} errors={errors}/>
                    </div>
                }
                
                {(mode === "create" || ((mode === "edit" || mode === "replace") /*&& control._formValues.collection !== ''*/)) &&
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
                
                            <TextFieldController name={`title`} label="Title" control={control} errors={errors}/>
                            <br />

                            <TextFieldController name={`year`} label="Year" control={control} errors={errors}/>
                            <br />

                            <SelectController 
                                name="collectiongroup"
                                label="Collection group" 
                                options={{
                                    url: "https://data.azgs.arizona.edu/api/v1/dicts/collection_groups",
                                    nameField: "name",
                                    valueField: "name"
                                }} 
                                control={control} 
                                errors={errors} 
                                style={{minWidth: "12ch", marginTop: "1em", width:"75%"}} variant="standard"
                            />
                            <br />

                            <MultiManager label="Authors" name="authors" content={AuthorFields} shape={authorShape} control={control} watch={watch("authors")} errors={errors}/>
                            <br />

                            <TextFieldController name={`series`} label="Series" control={control} errors={errors}/>
                            <br />

                            <TextFieldController name={`abstract`} label="Abstract" control={control} errors={errors} multiline sx={{marginTop:"0.5em"}}/>
                            <br />

                            <LabeledCheckboxController name={`private`} label="Private" control={control} errors={errors}/>
                            <br />

                            <InputLabel>
                                Bounding box
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <TextFieldController name={`bounding_box.west`} label="West" control={control} errors={errors}/>

                                <TextFieldController name={`bounding_box.south`} label="South" control={control} errors={errors}/>

                                <TextFieldController name={`bounding_box.east`} label="East" control={control} errors={errors}/>

                                <TextFieldController name={`bounding_box.north`} label="North" control={control} errors={errors}/>
                            </Stack>

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

                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={selectedTab}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList 
                                            textColor="secondary" 
                                            indicatorColor="secondary" 
                                            onChange={handleTabChange} 
                                            aria-label="optional tabs"
                                        >
                                            <Tab label="General" value="1"/>
                                            <Tab label="Files" value="2"/>
                                            <Tab label="Keywords" value="3"/>
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1">
    
                                        <TextFieldController name={`informalname`} label="Informal name" control={control} errors={errors}/>
                                        <br />

                                        <MultiManager label="Links" name="links" content={LinkFields} shape={linkShape} control={control} watch={watch("links")} errors={errors} optional/>
                                        <br />

                                        <TextFieldController name={`language`} label="Language" control={control} errors={errors}/>
                                        <br />

                                        <InputLabel sx={{ marginTop:"1.5em"}}>
                                            License
                                        </InputLabel>
                                        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>

                                            <TextFieldController name={`license.type`} label="Type" control={control} errors={errors}/>

                                            <TextFieldController name={`license.url`} label="URL" control={control} errors={errors}/>

                                        </Stack>
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="2">

                                        {//TODO: This is to display existing files when editing. Needs to be moved into its own component.
                                        }
                                        {control._formValues.files && control._formValues.files.length > 0 &&
                                        <>
                                        <InputLabel sx={{ marginTop:"1.5em"}}>
                                            Existing documents
                                        </InputLabel>
                                        {control._formValues.files.map((file, index) => {
                                            if (file.type === "documents") {
                                                return (
                                                    <Stack direction="row" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                                        <Typography name={`files.${index}.name`}  control={control} errors={errors} sx={{width:"75%"}}>
                                                            {file.name}
                                                        </Typography>
                                                        <Button
                                                            type="button"
                                                            variant="text" 
                                                            color="secondary" 
                                                            size="large"
                                                            onClick={() => remove(index)}
                                                            sx={{width:"100px"}}
                                                        >
                                                            <ClearIcon/>
                                                        </Button>

                                                    </Stack>
                                                )
                                            }
                                            return null;
                                        })}

                                        </>
                                        }
                                        
                                        <MultiManager label="Documents" name="documents" content={FileFields} shape={fileShape} control={control} watch={watch("documents")} errors={errors} optional/>
                                        <br />

                                        <MultiManager label="Images" name="images" content={FileFields} shape={fileShape} control={control} watch={watch("images")} errors={errors} optional/>
                                        <br />

                                        <MultiManager label="Notes" name="notes" content={FileFields} shape={fileShape} control={control} watch={watch("notes")} errors={errors} optional/>
                                        <br />

                                        <MultiManager label="Metadata" name="metadata" content={FileFields} shape={fileShape} control={control} watch={watch("metadata")} errors={errors} optional/>
                                        <br />

                                        <MultiManager label="GEMS2" name="gems2" content={FileFields} shape={fileShape} control={control} watch={watch("gems2")} errors={errors} optional/>
                                        <br />

                                        <MultiManager label="NCGMP09" name="ncgmp09" content={FileFields} shape={fileShape} control={control} watch={watch("ncgmp09")} errors={errors} optional/>
                                        <br />

                                        <MultiManager label="Legacy" name="legacy" content={FileFields} shape={fileShape} control={control} watch={watch("legacy")} errors={errors} optional/>
                                        <br />

                                        <MultiManager label="Layers" name="layers" content={FileFields} shape={fileShape} control={control} watch={watch("layers")} errors={errors} optional/>
                                        <br />

                                        <MultiManager label="Raster" name="raster" content={FileFields} shape={fileShape} control={control} watch={watch("raster")} errors={errors} optional/>
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="3">

                                        <MultiManager label="Keywords" name="keywords" content={KeywordFields} shape={keywordShape} control={control} watch={watch("keywords")} errors={errors}/>
                                        <br />

                                    </TabPanel>
                                </TabContext>
                            </Box>                                    
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
