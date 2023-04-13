import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const OTUMutateResults = ({queryParams}) => {
    console.log("OTUMutateResults");
    console.log(queryParams);

    return (
        <Mutator 
            params={{
                pbotID: queryParams.otu || null,
                identifiedSpecimens: queryParams.identifiedSpecimens || null,
                typeSpecimens: queryParams.typeSpecimens || null,
                holotypeSpecimen: queryParams.holotypeSpecimen || null,
                family: queryParams.family || null, 
                genus: queryParams.genus || null, 
                species: queryParams.species || null, 
                name: queryParams.name || null,
                references: queryParams.references || null,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
            }}
            entity="OTU"
            mode={queryParams.mode}
        />
    );
};

export default OTUMutateResults;
