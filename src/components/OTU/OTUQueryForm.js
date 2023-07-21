import { Button, Stack } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
import { CharacterSelect } from '../Character/CharacterSelect.js';
import { GroupSelect } from '../Group/GroupSelect.js';
import { SchemaSelect } from '../Schema/SchemaSelect.js';
import { StateSelect } from '../State/StateSelect.js';

const OTUQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
                otuID: '', 
                family: '', 
                genus: '', 
                species: '',
                schema: '',
                character: '',
                states: [],
                groups: [],
                includeHolotypeDescription: false,
                includeMergedDescription: false,
                includeSynonyms: false,
                includeComments: false,
            };
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    
    const indent01 = {marginLeft: "2em"}
    return (
       
        <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
                otuID: Yup.string()
                .uuid('Must be a valid uuid'),
                family: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                genus: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                species: Yup.string()
                .max(30, 'Must be 30 characters or less'),
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
                    name="otuID" 
                    type="text"
                    label="OTU ID"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="family" 
                    type="text" 
                    label="Family"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="genus" 
                    type="text" 
                    label="Genus"
                    disabled={false}
                />
                <br />
                <Field 
                    component={TextField}
                    name="species" 
                    type="text" 
                    label="Species"
                    disabled={false}
                />
                <br />
                
                <SchemaSelect />
                <br />

                {props.values.schema !== '' &&
                    <div>
                        <CharacterSelect values={props.values} source="characterInstance"/>
                        <br />
                    </div>
                }
                
                {props.values.character !== "" &&
                    <div>
                        <StateSelect values={props.values} source="characterInstance" multi={true}/>
                        <br />
                    </div>
                }

                <GroupSelect/>
                <br />

                <Field 
                    component={CheckboxWithLabel}
                    name="includeSynonyms" 
                    type="checkbox" 
                    Label={{ label: 'Include synonyms' }}
                    disabled={false}
                />
                
                {props.values.includeSynonyms &&
                    <div style={indent01}>
                    <Field 
                        component={CheckboxWithLabel}
                        name="includeComments" 
                        type="checkbox" 
                        Label={{ label: 'Include comments' }}
                        disabled={false}
                    />
                    </div>
                }
                {!props.values.includeSynonyms &&
                <br />
                }
                
                <Field 
                    component={CheckboxWithLabel}
                    name="includeHolotypeDescription" 
                    type="checkbox" 
                    Label={{ label: 'Include holotype description' }}
                    disabled={false}
                />
                <br />

                <Field 
                    component={CheckboxWithLabel}
                    name="includeMergedDescription" 
                    type="checkbox" 
                    Label={{ label: 'Include merged description' }}
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

export default OTUQueryForm;
