import { Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
import { CharacterSelect } from '../Character/CharacterSelect.js';
import { CollectionSelect } from '../Collection/CollectionSelect.js';
import { GroupSelect } from '../Group/GroupSelect.js';
import { OrganSelect } from '../Organ/OrganSelect.js';
import { SchemaSelect } from '../Schema/SchemaSelect.js';
import { StateSelect } from '../State/StateSelect.js';

const SpecimenQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
        specimenID: '', 
        name: '', 
        collection: '',
        schema: '',
        character: '',
        states: [],
        organs: [],
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
                    component={TextField}
                    name="specimenID" 
                    type="text"
                    label="Specimen ID"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="name" 
                    type="text" 
                    label="Name"
                    disabled={false}
                />
                <br />
                
                <CollectionSelect />
                <br />

                <OrganSelect/>
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

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default SpecimenQueryForm;
