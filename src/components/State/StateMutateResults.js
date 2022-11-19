import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const StateMutateResults = ({queryParams}) => {
    console.log("StateMutateResults");
    console.log(queryParams);

    return (
        <Mutator
            params={{
                pbotID: queryParams.state || null,
                name: queryParams.name || null,
                definition: queryParams.definition || null,
                parentID: queryParams.parentState || queryParams.character || null,
                schemaID: queryParams.schema || null,
                cascade: queryParams.cascade || false
            }}
            entity="State"
            mode={queryParams.mode}
        />
    );
};

export default StateMutateResults;
