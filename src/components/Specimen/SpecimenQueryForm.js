import { Button, Stack } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
import { CharacterSelect } from '../Character/CharacterSelect.js';
import { CollectionSelect } from '../Collection/CollectionSelect.js';
import { GroupSelect } from '../Group/GroupSelect.js';
import { PartsPreservedSelect } from '../Organ/PartsPreservedSelect.js';
import { PersonManager } from '../Person/PersonManager.js';
import { SchemaSelect } from '../Schema/SchemaSelect.js';
import { SensibleTextField } from '../SensibleTextField.js';
import { StateSelect } from '../State/StateSelect.js';
import { NotableFeaturesSelect } from './NotableFeaturesSelect.js';
import { PreservationModeSelect } from './PreservationModeSelect.js';

const SpecimenQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
        specimenID: '', 
        name: '', 
        collection: '',
        schema: '',
        character: '',
        states: [],
        partsPreserved: [],
        notableFeatures: [],
        preservationMode: '',
        gbifID: '',
        idigbiouuid: '',
        identifiers: [],
        groups: [],
        includeImages: false,
        includeDescriptions: false,
        includeOTUs: false
    };
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
                specimenID: Yup.string()
                .uuid('Must be a valid uuid'),
                name: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                collection: Yup.string(),
                groups: Yup.array().of(Yup.string())
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleSubmit(values)
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
                <Field 
                    component={SensibleTextField}
                    name="specimenID" 
                    type="text"
                    label="Specimen ID"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={SensibleTextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    disabled={false}
                />
                <br />
                
                <CollectionSelect name="collection" label="Collection" populateMode="simple"/>
                <br />

                <PartsPreservedSelect/>
                <br />
                
                <NotableFeaturesSelect />
                <br />

                <PreservationModeSelect />
                <br />

                <SchemaSelect />
                <br />

                {props.values.schema !== '' &&
                    <>
                        <CharacterSelect values={props.values} source="characterInstance"/>
                        <br />
                    </>
                }
                
                {props.values.character !== "" &&
                    <>
                        <StateSelect values={props.values} source="characterInstance" multi={true}/>
                        <br />
                    </>
                }

                <PersonManager label= "Identified by" xname="identifiers" omitOrder={true} values={props.values} handleChange={props.handleChange}/>

                <Field 
                    component={SensibleTextField}
                    name="idigbiouuid" 
                    type="text" 
                    label="iDigBio specimen ID"
                    disabled={false}
                />
                <br />

                <Field 
                    component={SensibleTextField}
                    name="gbifID" 
                    type="text" 
                    label="GBIF specimen ID"
                    disabled={false}
                />
                <br />

                <GroupSelect/>
                <br />
                
                <Field 
                    component={CheckboxWithLabel}
                    name="includeImages" 
                    type="checkbox" 
                    Label={{ label: 'Include images' }}
                    disabled={false}
                />
                <br />

                <Field 
                    component={CheckboxWithLabel}
                    name="includeDescriptions" 
                    type="checkbox" 
                    Label={{ label: 'Include descriptions' }}
                    disabled={false}
                />
                <br />

                <Field 
                    component={CheckboxWithLabel}
                    name="includeOTUs" 
                    type="checkbox" 
                    Label={{ label: 'Include OTUs' }}
                    disabled={false}
                />
                <br />
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

export default SpecimenQueryForm;
