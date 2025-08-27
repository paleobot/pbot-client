import React, { useState }from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { alphabetize, sort } from '../../util.js';
import CharacterInstanceMutateForm from './CharacterInstanceMutateForm.js';
import CharacterInstanceMutateResults from './CharacterInstanceMutateResults.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";
import { CharacterAccordion } from '../Character/CharacterAccordion.js';
//import CharacterInstances from '../CharacterInstance/CharacterInstances.js';

const CharacterInstanceManager = (props) => {
    //const formikProps = useFormikContext();

    const accstyle = {textAlign: "left", width: "70%"}
    return (
        <>
            {props.values.schema &&
                <Accordion style={accstyle} defaultExpanded={false}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Character instances
                    </AccordionSummary>
                    <AccordionDetails>
                        <CharacterAccordion description={props.values.description} schema={props.values.schema} />
                    </AccordionDetails>
                </Accordion>
            }
        </>
    );
};

export default CharacterInstanceManager;
