import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const SchemaMutateResults = ({queryParams}) => {
    console.log("SchemaMutateResults");
    console.log(queryParams);
    console.log(queryParams.authors);
    
    return (
        <Mutator
            params={{
                pbotID: queryParams.schema || null,
                title: queryParams.title || null,
                year: queryParams.year || null,
                acknowledgments: queryParams.acknowledgments || null,
                purpose: queryParams.purpose || null,
                partsPreservedIDs: queryParams.partsPreserved || null,
                notableFeaturesIDs: queryParams.notableFeatures || null,
                references: queryParams.references || null,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
                cascade: queryParams.cascade || false
            }}
            entity="Schema"
            mode={queryParams.mode}
        />
    );
};

export default SchemaMutateResults;
