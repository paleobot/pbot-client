import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const CollectionMutateResults = ({queryParams}) => {
    console.log("CollectionMutateResults");
    console.log(queryParams);
    console.log(queryParams.specimens);

    return (
        <Mutator
            params={{
                pbotID: queryParams.collection || null,
                name: queryParams.name || null,
                specimens: queryParams.specimens || null, 
                references: queryParams.references || null,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
            }}
            entity="Collection"
            mode={queryParams.mode}
        />
    );
};

export default CollectionMutateResults;
