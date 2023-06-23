import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";

const SynonymSelect = (props) => {
    console.log("SynonymSelect");
    console.log(props);
    console.log(props.values);
    const gQL = gql`
            query {
                Synonym {
                    pbotID
                    explanation
                    otus {
                        name
                        pbotID
                    }
                    references {
                        Reference {
                            pbotID
                        }
                        order
                    }
                    elementOf {
                        name
                        pbotID
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data);
    let synonyms = [...data.Synonym];
        
    console.log(synonyms);
    synonyms = synonyms.map(synonym => {
        return {
            ...synonym,
            name: synonym.otus.reduce((acc,otu) => acc ? acc + "/" + otu.name : otu.name, null)
        }
    });
    synonyms = alphabetize(synonyms, "name");
    console.log(synonyms);
    
    const style = {minWidth: "12ch"}
    return (
        <Field 
            style={style}
            component={TextField}
            type="text"
            name="synonym"
            label="Synonym"
            fullWidth
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                console.log("onChange");
                console.log(child.props);
                props.values.explanation = child.props.dexplanation;
                props.values.otus = child.props.dotus ? JSON.parse(child.props.dotus) : [];
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.values.public = "true"=== child.props.dpublic || false;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                //props.resetForm();
                props.handleChange(event);
            }}
        >
            {synonyms.map((synonym) => (
                <MenuItem 
                    key={synonym.pbotID} 
                    value={synonym.pbotID} 
                    dexplanation={synonym.explanation} 
                    dotus={synonym.otus ? JSON.stringify(synonym.otus.map(otu => otu.pbotID)) : null}
                    dreferences={synonym.references ? JSON.stringify(synonym.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                    dpublic={synonym.elementOf && synonym.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={synonym.elementOf ? JSON.stringify(synonym.elementOf.map(group => group.pbotID)) : null}
                >{synonym.name/*synonym.otus.reduce((acc,otu) => acc ? acc + "/" + otu.name : otu.name, null)*/}</MenuItem>
            ))}
        </Field>
    )
        
}

const OTUSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    console.log(props.type);
    const gQL = gql`
            query {
                OTU {
                    pbotID
                    name
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data);
    let otus = alphabetize([...data.OTU], "name");
    
    return (
        <Field 
            component={TextField}
            type="text"
            name="otus"
            label="OTUs"
            fullWidth
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
            defaultValue=""
        >
            {otus.map(({ pbotID, name }) => (
                <MenuItem 
                    key={pbotID} 
                    value={pbotID}
                >{name}</MenuItem>
            ))}
        </Field>
    )        
}


const SynonymMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                synonym: '',
                explanation: '',
                otus: [],
                references: [{
                    pbotID: '',
                    order:'',
                }],
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
                explanation: Yup.string().required("Explanation is required"),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                }),
                otus: Yup.array().min(2, "Two OTUs are required").max(2, "Only two OTUs are allowed"),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                //values.family = null;
                //values.genus = null;
                //values.species = null;
                //values.specimen = null;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values:initValues});
            }}
        >
            {props => (
            <Form>
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <SynonymSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.synonym !== '')) &&
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
                            component={TextField}
                            name="explanation" 
                            type="text" 
                            label="Explanation"
                            fullWidth
                            disabled={false}
                        />
                        <br />
                        
                        <OTUSelect values={props.values} handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                        <br />
                        
                        <ReferenceManager values={props.values}/>
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
                
                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
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

export default SynonymMutateForm;
