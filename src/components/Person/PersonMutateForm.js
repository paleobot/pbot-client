import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import { SensibleTextField } from '../SensibleTextField.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";
import { PersonSelect } from './PersonSelect.js';

const PersonMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
        person: '',
        given: '',
        middle: '',
        surname: '',
        email: '',
        orcid: '',
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

    const generateOrcidChecksum = (baseDigits) => { 
        let total = 0; 
        for (let i = 0; i < baseDigits.length; i++) { 
            const digit = parseInt(baseDigits[i]); 
            total = (total + digit) * 2; 
        } 
        const remainder = total % 11; 
        const result = (12 - remainder) % 11; 
        return result == 10 ? "X" : result.toString(); 
    };
            
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
          innerRef={formikRef}
          initialValues={initValues}
            validationSchema={Yup.object({
                given: Yup.string().required("Given is a required field"),
                middle: Yup.string(),
                surname: Yup.string().required("Surname is a required field"),
                email: Yup.string().email(),
                //TODO: Consider better validation on orcid that includes checksum digit verification
                orcid: Yup.string().matches(/https:\/\/orcid.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]/, {message: "Not a valid orcid"}).test(
                    "checksumValid",
                    "not a valid orcid",
                    (value, context) => {
                        if (!value) return true;
                        const baseDigits = value.slice(18, 36).replaceAll('-', '');
                        const checksum = value.slice(36);
                        return generateOrcidChecksum(baseDigits) === checksum;
                    }

                ),
            })}
            onSubmit={(values, {resetForm}) => {
                values.mode = mode;
                handleSubmit(values);
                resetForm({values:initValues});
            }}
        >
            {props => (
            <Form>
                <Field 
                    component={TextField}
                    name="mode" 
                    sx={{display:"none"}}
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <PersonSelect name="person"/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.person !== '')) &&
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
                            name="given"
                            label="Given"
                            fullWidth 
                            disabled={false}
                        />
                        <br />

                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="surname"
                            label="Surname"
                            fullWidth 
                            disabled={false}
                        />
                        <br />

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
                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="middle"
                            label="Middle name/initial"
                            fullWidth 
                            disabled={false}
                        />
                        <br />

                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="email"
                            label="Email"
                            fullWidth 
                            disabled={false}
                        />
                        <br />

                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="orcid"
                            label="ORCID"
                            fullWidth 
                            prefix="https://orcid.org/"
                            disabled={false}
                        />
                        <br />

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

export default PersonMutateForm;
