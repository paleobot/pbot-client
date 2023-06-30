import React, { useEffect } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import Mutator from '../Mutator';

const DescriptionMutateResults = ({queryParams}) => {
    console.log("DescriptionMutateResults");
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <Mutator 
            params={{
                pbotID: queryParams.description || null,
                specimenIDs: queryParams.specimens || null,
                schemaID: queryParams.schema || null,
                references: queryParams.references || null,
                name: queryParams.name || null,
                groups: queryParams.public ? 
                    [global.publicGroupID] : queryParams.groups || null,
                cascade: queryParams.cascade || false
            }}
            entity="Description"
            mode={queryParams.mode}
        />
    );
};

export default DescriptionMutateResults;
