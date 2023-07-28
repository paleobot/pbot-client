import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material';
import { Field } from 'formik';
import { CheckboxWithLabel } from 'formik-mui';
import React from 'react';
import { GroupSelect } from '../../Group/GroupSelect.js';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PersonManager } from '../../Person/PersonManager.js';
import { SensibleTextField } from '../../SensibleTextField.js';
import PBDBSelect from '../PBDBSelect.js';



const ContributedArticleFields = (props) => {
        
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
                        label="Chapter title"
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

                    <PersonManager label="Authors" name="authors" values={props.values} handleChange={props.handleChange}/>

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="bookTitle"
                        label="Book title"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="editors"
                        label="Editors"
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
                        label="Chapter title"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <Field
                        component={SensibleTextField}
                        type="text"
                        name="bookTitle"
                        label="Book title"
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

export default ContributedArticleFields;
