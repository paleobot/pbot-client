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
                mininterval: queryParams.mininterval || null,
                maxinterval: queryParams.maxinterval || null,
                collectionType: queryParams.collectiontype || null,
                sizeClasses: queryParams.sizeclasses || null,
                lithology: queryParams.lithology || null,
                preservationModeIDs: queryParams.preservationmodes || null,
                environment: queryParams.environment || null,
                collectors: queryParams.collectors || null,
                lat: parseFloat(queryParams.lat) || null,
                lon: parseFloat(queryParams.lon) || null,
                country: queryParams.country || null,
                pbdbid: queryParams.pbdbid || null,
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
