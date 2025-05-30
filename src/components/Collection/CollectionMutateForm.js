import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, FormControlLabel, InputLabel, MenuItem, Stack, Tab, TextField, Typography } from '@mui/material';
//import { Field, Form, Formik, useFormikContext } from 'formik';
//import { CheckboxWithLabel } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
//import { SensibleTextField } from '../SensibleTextField.js';
import { yupResolver } from "@hookform/resolvers/yup";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Controller, useForm } from "react-hook-form";
import { MultiManager } from '../MultiManager.js';
import { AutocompleteController } from '../util/AutocompleteController.jsx';
import { TextFieldController } from '../util/TextFieldController';
import { ExistingCollectionManager } from './ExistingCollectionManager';
import { FileManager } from './FileManager.jsx';
import { SelectController } from '../util/SelectController.jsx';
import { LabeledCheckboxController } from '../util/LabeledCheckboxController.jsx';

const authorShape = {
    person: '',
    givenname: '',
    surname: '',
    organization: ''
};
const authorSchema = Yup.object().shape({
    person: Yup.string()
        .required('Person is required'),
    givenname: Yup.string()
        .required('Given name is required'),
    surname: Yup.string()
        .required('Surname is required'),
    organization: Yup.string().nullable(),
});
const AuthorFields = ({index, control, errors}) => {
      
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <TextFieldController name={`metadata.authors.${index}.person`} label="Person" control={control} errors={errors} sx={{width:"75%"}}/>

            <TextFieldController name={`metadata.authors.${index}.givenname`} label="Given name" control={control} errors={errors} sx={{width:"75%"}}/>     

            <TextFieldController name={`metadata.authors.${index}.surname`} label="Surname" control={control} errors={errors} sx={{width:"75%"}}/>

            <TextFieldController name={`metadata.authors.${index}.organization`} label="Organization" control={control} errors={errors} sx={{width:"75%"}}/>
        </Stack>
    )
}    
           
const linkShape = {
    name: '',
    url: '',
};
const linkSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    url: Yup.string().url("Must be a valid URL").required('URL is required'),
});
const LinkFields = ({index, control, errors}) => {
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>

            <AutocompleteController name={`metadata.links.${index}.name`} label="Name" control={control} errors={errors} sx={{width:"75%"}}/>

            {/*<TextFieldController name={`links.${index}.name`} label="Name" control={control} errors={errors} sx={{width:"75%"}}/>*/}

            <TextFieldController name={`metadata.links.${index}.url`} label="URL" control={control} errors={errors} sx={{width:"75%"}}/>
         </Stack>
    )
}    


const keywordShape = {
    name: '',
    type: '',
};
const keywordSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.string().required('Type is required'),
});
const KeywordFields = ({index, control, errors}) => {
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <TextFieldController name={`metadata.keywords.${index}.name`} label="Name" control={control} errors={errors} sx={{width:"75%"}}/>
            <SelectController 
                name={`metadata.keywords.${index}.type`} 
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

const CollectionMutateForm = ({handleSubmit: hSubmit, mode}) => {
    const initValues = {
        metadata: {
            identifiers: {
                perm_id: '',
                supersedes: [],
            }, 
            title: '',
            year: '',
            collection_group: {name: ''},
            authors: [{
                person: '',
                givenname: '',
                surname: '',
                organization: ''
            }],
            //journal: {
            //    name: '',
            //    publisher: '',
            //    url: ''
            //},
            series: '',
            abstract: '',
            informalname: '',
            links: [/*{
                name: 'UA Library',
                url: ''
            }*/],
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
                
            keywords: [/*{
                name: '',
                type: ''
            }*/],
            files: [],    
        },
        //extra fields, not part of collection metadata
        documentFiles: [],
        imageFiles: [],
        noteFiles: [],
        metadataFiles: [],
        gems2Files: [],
        ncgmp09Files: [],
        legacyFiles: [],
        layerFiles: [],
        rasterFiles: [],
        complete: '',
        //oldCollections: [],
        supersedes: [],
    };

    const minYear = 1700
    const maxYear = new Date().getFullYear();
    const deleteValidationSchema = Yup.object().shape({
        metadata: Yup.object().shape({
            identifiers: Yup.object().shape({
                perm_id: Yup.string().required('Perm ID is required'),
            }).required('Perm ID is required'),
        })
    })
    const validationSchema=Yup.object().shape({
        metadata: Yup.object().shape({
            title: Yup.string().required('Title is required'),
            collection_group: Yup.object().shape({
                name: Yup.string().required('Collection group is required')
            }).required('Collection group is required'),
            year: Yup.number().min(minYear, `Year must be greater than or equal to ${minYear}`).max(maxYear, `Year must be less than or equal to ${maxYear}`).required('Year is required'),
            authors: Yup.array().of(authorSchema).min(1, 'At least one author is required'),
            series: Yup.string().required('Series is required'),
            abstract: Yup.string().required('Abstract is required'),
            informalname: Yup.string(),
            links: Yup.array().of(linkSchema),
            keywords: Yup.array().of(keywordSchema),
            license: Yup.object().shape({
                name: Yup.string(),
                url: Yup.string().url(),
            }),
            private: Yup.boolean(),
            bounding_box: Yup.object().shape({
                west: Yup.number().min(-180).max(180),
                south: Yup.number().min(-90).max(90),
                east: Yup.number().min(-180).max(180),
                north: Yup.number().min(-90).max(90),
            }).required('Bounding box is required'),
        }),
        //These need to be objects to work with the file select controller
        documentFiles: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        imageFiles: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        noteFiles: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        metadataFiles: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        gems2Files: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        ncgmp09Files: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        legacyFiles: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        layerFiles: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        rasterFiles: Yup.array().of(Yup.object().shape({
            name: Yup.string()
        })),
        //complete: Yup.string()
    })

    const { handleSubmit, reset, control, watch, formState: {errors} } = useForm({
        defaultValues: initValues,
        //resolver: yupResolver(validationSchema),
        resolver: mode === "delete" ? yupResolver(deleteValidationSchema) : yupResolver(validationSchema),
        mode: "onBlur",
        trigger: "onBlur",
      });

    const resetForm = (initialValues = initValues, props) => {
        //Add random value to ensure results are not retained (e.g. useEffect in Mutator is contingent on this value)
        initialValues.random = Math.random();
        reset(initialValues, props);
    }
    
    const doSubmit = async (data) => {
        console.log("doSubmit")
        console.log(JSON.parse(JSON.stringify(data)))
        data.mode = mode;
        await hSubmit(data);
        resetForm();
    }
    
    //To clear form when mode changes 
    React.useEffect(() => {
            resetForm();
    },[mode]);
    
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
                        <ExistingCollectionManager mode={mode} control={control} reset={resetForm} watch={watch} errors={errors}/>
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
                
                            <TextFieldController name={`metadata.title`} label="Title" control={control} errors={errors}/>
                            <br />

                            <TextFieldController name={`metadata.year`} label="Year" control={control} errors={errors}/>
                            <br />

                            <SelectController 
                                name="metadata.collection_group.name"
                                label="Collection group" 
                                options={{
                                    //url: "https://data.azgs.arizona.edu/api/v1/dicts/collection_groups",
                                    path: "api/v1/dicts/collection_groups",
                                    nameField: "name",
                                    valueField: "name"
                                }} 
                                control={control} 
                                errors={errors} 
                                disabled={mode === "edit"}
                                style={{minWidth: "12ch", marginTop: "1em", width:"75%"}} variant="standard"
                            />
                            <br />

                            <LabeledCheckboxController name={`metadata.private`} label="Private" control={control} errors={errors} size="large" />
                            <br />

                            <MultiManager label="Authors" name="metadata.authors" content={AuthorFields} shape={authorShape} schema={authorSchema} control={control} watch={watch("metadata.authors")} errors={errors}/>
                            <br />

                            <TextFieldController name={`metadata.series`} label="Series" control={control} errors={errors}/>
                            <br />

                            <TextFieldController name={`metadata.abstract`} label="Abstract" control={control} errors={errors} variant="filled" multiline rows={4} sx={{marginTop:"1.5em"}}/>
                            <br />

                            <InputLabel sx={{ marginTop:"1.5em"}}>
                                Bounding box
                            </InputLabel>
                            <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
                                <TextFieldController name={`metadata.bounding_box.west`} label="West" control={control} errors={errors}/>

                                <TextFieldController name={`metadata.bounding_box.south`} label="South" control={control} errors={errors}/>

                                <TextFieldController name={`metadata.bounding_box.east`} label="East" control={control} errors={errors}/>

                                <TextFieldController name={`metadata.bounding_box.north`} label="North" control={control} errors={errors}/>
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
    
                                        {mode === "edit" &&
                                            <div>
                                                <ExistingCollectionManager supersedes mode={mode} control={control} reset={resetForm} watch={watch} errors={errors}/>
                                            </div>
                                        }
                                        <br />

                                        <TextFieldController name={`metadata.informalname`} label="Informal name" control={control} errors={errors}/>
                                        <br />

                                        <MultiManager label="Links" name="metadata.links" content={LinkFields} shape={linkShape} schema={linkSchema} control={control} watch={watch("metadata.links")} errors={errors} optional/> 
                                        <br />

                                        <TextFieldController name={`metadata.language`} label="Language" control={control} errors={errors}/>
                                        <br />

                                        <InputLabel sx={{ marginTop:"1.5em"}}>
                                            License
                                        </InputLabel>
                                        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>

                                            <TextFieldController name={`metadata.license.type`} label="Type" control={control} errors={errors}/>

                                            <TextFieldController name={`metadata.license.url`} label="URL" control={control} errors={errors}/>

                                        </Stack>
                                        <br />

                                    </TabPanel>
                                    <TabPanel value="2">

                                        <FileManager name="documentFiles" label="Documents" control={control} watch={watch("documentFiles")} errors={errors} mode={mode}/>

                                        <FileManager name="imageFiles" label="Images" control={control} watch={watch("imageFiles")} errors={errors} mode={mode}/>

                                        <FileManager name="noteFiles" label="Notes" control={control} watch={watch("noteFiles")} errors={errors} mode={mode}/>

                                        <FileManager name="metadataFiles" label="Metadata" control={control} watch={watch("metadataFiles")} errors={errors} mode={mode}/>

                                        <FileManager name="gems2Files" label="GeMS2" control={control} watch={watch("gems2Files")} errors={errors} mode={mode}/>

                                        <FileManager name="ncgmp09Files" label="NCGMP09" control={control} watch={watch("ncgmp09Files")} errors={errors} mode={mode}/>

                                        <FileManager name="legacyFiles" label="Legacy" control={control} watch={watch("legacyFiles")} errors={errors} mode={mode}/>

                                        <FileManager name="layerFiles" label="Layers" control={control} watch={watch("layerFiles")} errors={errors} mode={mode}/>

                                        <FileManager name="rasterFiles" label="Raster" control={control} watch={watch("rasterFiles")} errors={errors} mode={mode}/>

                                    </TabPanel>
                                    <TabPanel value="3">

                                        <MultiManager label="Keywords" name="metadata.keywords" content={KeywordFields} schema={keywordSchema} shape={keywordShape} control={control} watch={watch("metadata.keywords")} errors={errors} optional/>
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
                    <Button type="reset" variant="outlined" color="secondary" onClick={() => {resetForm()}}>Reset</Button>
                </Stack>
                <br />
                <br />
            </form>
    
    );
};

export default CollectionMutateForm;
