import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Stack } from '@mui/material';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { bookTypes } from "../../../Lists.js";
import { PersonManager } from '../../Person/PersonManager.js';
import { SensibleTextField } from '../../SensibleTextField.js';
import PBDBSelect from '../PBDBSelect.js';

const BookTypeSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="bookType"
            label="Type"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {bookTypes.map((bt) => (
                <MenuItem 
                    key={bt} 
                    value={bt}
                >{bt}</MenuItem>
            ))}
        </Field>
    )
}

const StandaloneBookFields = (props) => {
        
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
                       
        <div>
        {!props.query &&
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

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="title"
                        label="Title"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="year"
                        label="Year"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Stack direction="row" spacing={0}>
                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="pbdbid"
                            label="PBDB ID"
                            fullWidth 
                            disabled={false}
                        />
                        <PBDBSelect />
                    </Stack>
                        
                    <PersonManager label="Authors" name="authors" values={props.values} handleChange={props.handleChange}/>

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="publisher"
                        label="Publisher"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="firstPage"
                        label="First page number"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="lastPage"
                        label="Last page number"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <BookTypeSelect />
                    <br />

                </AccordionDetails>
            </Accordion>            

            <Accordion style={accstyle} defaultExpanded={false}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="required-content"
                    id="required-header"                        
                >
                    Optional fields
                </AccordionSummary>
                <AccordionDetails>

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="notes"
                        label="Notes"
                        fullWidth 
                        multiline
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="doi"
                        label="DOI"
                        fullWidth 
                        disabled={false}
                    />
                    <br />
                    
                </AccordionDetails>
            </Accordion>
            </>
        }     
        {props.query &&
            <>
                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="title"
                        label="Title"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <PersonManager label="Authors" name="authors" omitOrder={true} values={props.values} handleChange={props.handleChange}/>

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="year"
                        label="Year"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="publisher"
                        label="Publisher"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="firstPage"
                        label="First page number"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="lastPage"
                        label="Last page number"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <BookTypeSelect />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="pbdbid"
                        label="PBDB ID"
                        fullWidth 
                        disabled={false}
                    />
                    <br />
                    
                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="doi"
                        label="DOI"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

            </>
        }
        </div>
    
    );
};

export default StandaloneBookFields;
