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
                cascade: queryParams.cascade || false
            }}
            entity="Description"
            mode={queryParams.mode}
        />
    );
};

export default DescriptionMutateResults;
