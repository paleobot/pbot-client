import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import {GroupSelect} from '../Group/GroupSelect.js';
import {CollectionSelect} from '../Collection/CollectionSelect.js';
import {OrganSelect} from '../Organ/OrganSelect.js';
import { CharacterSelect } from '../Character/CharacterSelect.js';
import { StateSelect } from '../State/StateSelect.js';
import { alphabetize } from '../../util.js';
import {
    useQuery,
    gql
  } from "@apollo/client";
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  
const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    const gQL = gql`
        query {
            Schema {
                pbotID
                title
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Schema results<<<<<<<<<<<<<");
    console.log(data.Schema);
    const schemas = alphabetize([...data.Schema], "title");
    console.log(schemas);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="schema"
            label="Schema"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {schemas.map((schema) => (
                <MenuItem 
                    key={schema.pbotID} 
                    value={schema.pbotID}
                >{schema.title}</MenuItem>
            ))}
        </Field>
    )
}

const SpecimenQueryForm = ({handleSubmit}) => {
    //const [values, setValues] = useState({});
    const initValues = {
        specimenID: '', 
        name: '', 
        collection: '',
        schema: '',
        character: '',
        state: '',
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
                    <div>
                        <CharacterSelect values={props.values} source="characterInstance"/>
                        <br />
                    </div>
                }
                
                {props.values.character !== "" &&
                    <div>
                        <StateSelect values={props.values} source="characterInstance"/>
                        <br />
                    </div>
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
