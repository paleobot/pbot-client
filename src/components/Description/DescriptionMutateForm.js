import React, { useState }from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import CharacterInstanceManager from '../CharacterInstance/CharacterInstanceManager.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {DescriptionSelect} from '../Description/DescriptionSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import { SensibleTextField } from '../SensibleTextField.js';
import { SpecimenManager } from '../Specimen/SpecimenManager.js';

/*
const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    console.log(props.values);
    const descriptionGQL = gql`
            query {
                Description {
                    pbotID
                    name
                    notes
                  	schema {
                      pbotID
                    }
                  	specimens {
                      Specimen {
                        name
                        pbotID
                      }
                    }
                    elementOf {
                        name
                        pbotID
                    }
                    references (orderBy: order_asc) {
                        Reference {
                            pbotID
                        }
                        order
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: descriptionLoading, error: descriptionError, data: descriptionData } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

    if (descriptionLoading) return <p>Loading...</p>;
    if (descriptionError) return <p>Error :(</p>;
                                 
    console.log(descriptionData);
    let descriptions = [...descriptionData.Description];
    
    //TODO: This was necessary because we initially did not have name fields in specimen Descriptions.
    //I require that now, but there are still some that do not have this.
    descriptions = descriptions.reduce((acc, description) => {
        const newDesc = {...description};
        console.log(newDesc);

        if (newDesc.name) {
            acc.push(newDesc);
        } else {
            if (description.specimen) {
                console.log(description.specimen.Specimen.name);
                newDesc.name = description.specimen.Specimen.name;
                acc.push(newDesc);
            } 
        }
        return acc;
    }, []);
    
    console.log(descriptions);
    descriptions = alphabetize(descriptions, "name");
    console.log(descriptions);
    
    const style = {minWidth: "12ch"}
    return (
        <Field 
            style={style}
            component={TextField}
            type="text"
            name="description"
            label="Description"
            fullWidth
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                console.log(child.props);
                console.log(child.props.dtype);
                props.values.schema = child.props.dschema;
                props.values.name = child.props.dname;
                props.values.notes = child.props.dnotes;
                props.values.specimens = child.props.dspecimens ? JSON.parse(child.props.dspecimens) : [];
                props.values.public = "true"=== child.props.dpublic || false;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                //props.resetForm();
                props.handleChange(event);
            }}
        >
            {descriptions.map((description) => (
                <MenuItem 
                    key={description.pbotID} 
                    value={description.pbotID} 
                    dschema={description.schema.pbotID} 
                    dname={description.name} 
                    dnotes={description.notes} 
                    dspecimens={description.specimens ? JSON.stringify(description.specimens.map(specimen => specimen.Specimen.pbotID)) : []}
                    dpublic={description.elementOf && description.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={description.elementOf ? JSON.stringify(description.elementOf.map(group => group.pbotID)) : null}
                    dreferences={description.references ? JSON.stringify(description.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                >{description.name}</MenuItem>
            ))}
        </Field>
    )
        
}
*/

const SchemaSelect = (props) => {
    console.log("SchemaSelect");
    const schemaGQL = gql`
            query {
                Schema {
                    pbotID
                    title
                }            
            }
        `;

    const { loading: schemaLoading, error: schemaError, data: schemaData } = useQuery(schemaGQL, {fetchPolicy: "cache-and-network"});

    if (schemaLoading) return <p>Loading...</p>;
    if (schemaError) return <p>Error :(</p>;
                                 
    console.log(schemaData.Schema);
    const schemas = alphabetize([...schemaData.Schema], "title");
    
    return (
        <Field
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
            {schemas.map(({ pbotID, title }) => (
                <MenuItem key={pbotID} value={pbotID}>{title}</MenuItem>
            ))}
        </Field>
    )
}

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    const specimenGQL = gql`
            query {
                Specimen {
                    pbotID
                    name
                }            
            }
        `;

    const { loading: specimenLoading, error: specimenError, data: specimenData } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    if (specimenLoading) return <p>Loading...</p>;
    if (specimenError) return <p>Error :(</p>;
                                 
    console.log(specimenData.Specimen);
    const specimens = alphabetize([...specimenData.Specimen], "name");
    
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
            onChange={(event,child) => {
                props.handleChange(event);
                //props.setFieldValue("name", child.props.dname) TODO:With multiple:true, this no longer works properly
            }}
        >
            {specimens.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID} dname={name}>{name}</MenuItem>
            ))}
        </Field>
    )
}

const DescriptionMutateForm = ({handleSubmit, mode}) => {
    const [open, setOpen] = React.useState(false);
    
    const initValues = {
                description: '',
                schema: '',
                references: [{
                    pbotID: '',
                    order:'',
                }],
                specimens: [{pbotID: ''}],
                name: '',
                writtenDescription: '',
                notes: '',
                public: true,
                groups: [],
                cascade: false,
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
                schema: Yup.string().required(),
                //TODO: decide if specimen is required for specimen types                         
                //specimen: Yup.string().when("type", {
                //    is: (val) => val === "specimen",
                //    then: Yup.string().required()
                //}),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                name: Yup.string().nullable().required(),
                notes: Yup.string().nullable(),
                public: Yup.boolean(),
                //specimens: Yup.array().of(Yup.string()).min(1, "At least one specimen required"),
                specimens: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Specimen is required'),
                    })
                ).min(1, "At least one specimen required"),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                values.specimen = null;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values:initValues});
            }}
        >
            {props => (
            <Form>
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        {/*<DescriptionSelect values={props.values} handleChange={props.handleChange}/>*/}
                        <DescriptionSelect name="description" label="Description" populateMode="full" select/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.description !== '')) &&
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
                
                        <Field 
                            component={SensibleTextField}
                            name="name" 
                            type="text" 
                            label="Name"
                            fullWidth
                            disabled={false}
                        />
                        <br />
                        
                        <SchemaSelect />
                        <br />
                        
                        <ReferenceManager values={props.values}/>

                        <div>
                        <SpecimenManager groupLabel="Specimens" individualLabel="specimen" values={props.values}/>
                        <br />
                        </div>
                                
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
                            <GroupSelect omitPublic={true}/>
                            <br />
                        </div>
                        }
                    </AccordionDetails>
                </Accordion>

                <Accordion style={accstyle} disabled={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="optional-content"
                        id="optional-header"                        
                    >
                        Optional fields
                    </AccordionSummary>
                    <AccordionDetails >
                        <Field 
                            component={SensibleTextField}
                            name="writtenDescription" 
                            type="text" 
                            label="Written description"
                            fullWidth
                            disabled={false}
                        />
                        <br />
                        
                        <Field 
                            component={SensibleTextField}
                            name="notes" 
                            type="text" 
                            label="Notes"
                            fullWidth
                            disabled={false}
                        />
                        <br />
                        
                    </AccordionDetails>
                </Accordion>
                </div>
                }
                <br />

                {(mode === "edit" && props.values.description !== '') &&
                    <CharacterInstanceManager values={props.values} />
                }

                  
                
                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />

                {(mode === "delete") &&
                <div>
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        Label={{ label: 'Cascade' }}
                    />
                  <br />
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

export default DescriptionMutateForm;
