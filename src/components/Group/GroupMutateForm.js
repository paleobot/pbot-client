import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize, sort } from '../../util.js';
import { SensibleTextField } from '../SensibleTextField.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";
import { PersonManager } from '../Person/PersonManager.js';

const GroupSelect = (props) => {
    console.log("GroupSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    const gQL = gql`
        query {
            Group (filter: {name_not: "public"}) {
                pbotID
                name
                purpose
                members {
                    pbotID
                    surname
                }
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Group results<<<<<<<<<<<<<");
    console.log(data.Group);
    const groups = alphabetize([...data.Group], "name");
    console.log(groups);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="group"
            label="Group"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.name = child.props.dname || '';
                props.values.purpose = child.props.dpurpose || '';
                props.values.members = child.props.dmembers ? JSON.parse(child.props.dmembers) : [];
                props.handleChange(event);
            }}
        >
            {groups.map((group) => {
                //sort members, then move current user to top
                let members = sort([...group.members], "surname").filter(m => m.pbotID !== props.me);
                members.unshift({pbotID: props.me});

                return(
                <MenuItem 
                    key={group.pbotID} 
                    value={group.pbotID}
                    dname={group.name}
                    dpurpose={group.purpose}
                    dmembers={group.members ? JSON.stringify(members) : null}
                >{group.name}</MenuItem>
            )})}
        </Field>
    )
}


const GroupMutateForm = ({handleSubmit, mode}) => {
    console.log("GroupMutateForm")
    const me = localStorage.getItem('PBOTMe');
    console.log(me)

    const initValues = {
                group: '', 
                name: '',
                purpose: '',
                members: [{pbotID:me}],
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
                name: Yup.string().required(),
                purpose: Yup.string().required(),
                members: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Member name is required'),
                     })
                ).min(1, "at least one member required"),                
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
                        <GroupSelect values={props.values} me={me} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.group !== '')) &&
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
                                type="text"
                                name="name"
                                label="Name"
                                fullWidth 
                                disabled={false}
                            />
                            <br />

                            <Field
                                component={SensibleTextField}
                                type="text"
                                name="purpose"
                                label="Purpose"
                                fullWidth 
                                multiline
                                disabled={false}
                            />
                            <br />

                            <PersonManager label="Members" name="members" omitOrder values={props.values} handleChange={props.handleChange}/>
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

export default GroupMutateForm;
