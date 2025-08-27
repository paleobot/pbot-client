import React, { useEffect } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import Mutator from '../Mutator';

const SchemaMutateResults = ({queryParams}) => {
    console.log("SchemaMutateResults");
    console.log(queryParams);
    console.log(queryParams.authors);
    
    const global = useContext(GlobalContext);

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
                    [global.publicGroupID] : queryParams.groups || null,
                cascade: queryParams.cascade || false
            }}
            entity="Schema"
            mode={queryParams.mode}
        />
    );
};

export default SchemaMutateResults;
