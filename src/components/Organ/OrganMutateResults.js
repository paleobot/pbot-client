import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const OrganMutateResults = ({queryParams}) => {
    console.log("OrganMutateResults");
    console.log(queryParams);

    return (
        <Mutator
            params={{
                pbotID: queryParams.organ || null,
                type: queryParams.type || null,
            }}
            entity="Organ"
            mode={queryParams.mode}
        />
    );
};

export default OrganMutateResults;
