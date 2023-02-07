import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, Link, IconButton, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {AuthorManager} from '../Person/AuthorManager.js';

import {
  useQuery,
  gql
} from "@apollo/client";
import PBDBSelect from './PBDBSelect.js';

const ReferenceSelect = (props) => {
    console.log("ReferenceSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Reference {
                pbotID
                title
                publisher
                year
                doi
                pbdbid
                authoredBy {
                    Person {
                        pbotID
                        given
                        surname
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

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Reference results<<<<<<<<<<<<<");
    console.log(data.Reference);
    const references = alphabetize([...data.Reference], "title");
    console.log(references);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="reference"
            label="Reference"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.title = child.props.dtitle || '';
                props.values.publisher = child.props.dpublisher || '';
                props.values.year = child.props.dyear || '';
                props.values.doi = child.props.ddoi || '';
                props.values.pbdbid = child.props.dpbdbid || '';
                props.values.authors = child.props.dauthors ? JSON.parse(child.props.dauthors) : [];
                props.values.public = "true"=== child.props.dpublic || false;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                 props.handleChange(event);
            }}
        >
            {references.map((reference) => (
                <MenuItem 
                    key={reference.pbotID} 
                    value={reference.pbotID}
                    dtitle={reference.title}
                    dpublisher={reference.publisher}
                    dyear={reference.year}
                    ddoi={reference.doi}
                    dpbdbid={reference.pbdbid}
                    dauthors={reference.authoredBy ? JSON.stringify(reference.authoredBy.map(author => {return {pbotID: author.Person.pbotID, order: author.order, searchName: author.Person.surname || ''}})) : null}
                    dpublic={reference.elementOf && reference.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={reference.elementOf ? JSON.stringify(reference.elementOf.map(group => group.pbotID)) : null}
                >{reference.title + ", " + reference.publisher + ", " + reference.year}</MenuItem>
            ))}
        </Field>
    )
}

const ReferenceMutateForm = ({handleSubmit, mode}) => {

    
    const initValues = {
                reference: '',
                title: '',
                publisher: '',
                year: '',
                authors: [{
                    pbotID: '',
                    order:'',
                    searchName:'',
                }],
                doi: '',
                pbdbid: '',
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
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                title: Yup.string().required(),
                publisher: Yup.string().required(),
                year: Yup.date().required(),
                //authors: Yup.array().of(Yup.string()).min(1, "Must specify at least one author"),
                authors: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Author name is required'),
                        order: Yup.string()
                            .required('Author order is required')
                            .typeError('Author order is required'),
                        searchName: Yup.string(),
                    })
                ).min(1, "Must specify at least one author"),
                public: Yup.boolean(),
                doi: Yup.string(),
                pbdbid: Yup.string(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
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
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <ReferenceSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.reference !== '')) &&
                <div>
                <Field
                    component={TextField}
                    type="text"
                    name="title"
                    label="Title"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <Field
                    component={TextField}
                    type="text"
                    name="publisher"
                    label="Publisher"
                    fullWidth 
                    disabled={false}
                />
                <br />
                
                <Field
                    component={TextField}
                    type="text"
                    name="year"
                    label="Year"
                    fullWidth 
                    disabled={false}
                />
                <br />

                <AuthorManager values={props.values} handleChange={props.handleChange}/>

                        
                <Grid container spacing={2} direction="row">
                <Grid item xs={5}>
                    <Field
                        component={TextField}
                        type="text"
                        name="pbdbid"
                        label="PBDB ID"
                        fullWidth 
                        disabled={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <PBDBSelect />
                </Grid>
            </Grid>
                       
                        
                <br />

                <Field
                    component={TextField}
                    type="text"
                    name="doi"
                    label="DOI"
                    fullWidth 
                    disabled={false}
                />
                <br />
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
                
                </div>
                }
                
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

export default ReferenceMutateForm;
