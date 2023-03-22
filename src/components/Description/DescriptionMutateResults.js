import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const DescriptionMutateResults = ({queryParams}) => {
    console.log("DescriptionMutateResults");
    console.log(queryParams);

    return (
        <Mutator 
            params={{
                pbotID: queryParams.description || null,
                specimenIDs: queryParams.specimens || null,
                schemaID: queryParams.schema || null,
                references: queryParams.references || null,
                name: queryParams.name || null,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
                cascade: queryParams.cascade || false,
                characterInstances: queryParams.characterInstances.map(({character: characterID, state: stateID, ...props}) => ({characterID, stateID: stateID.split(",")[1], ...props}))
                /*
                [{
                    //descriptionID: "",
                    characterID: "261c9b21-e823-4e27-86ee-fc35ee8a57e1",
                    stateID: "6e40c32d-494c-4a63-885c-f85c89f5232d",
                    order: "1"
                }]
                */
            }}
            entity="Description"
            mode={queryParams.mode}
        />
    );
};

export default DescriptionMutateResults;
