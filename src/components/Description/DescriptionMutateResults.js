import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const DescriptionMutateResults = ({queryParams, queryEntity}) => {
    console.log("DescriptionMutateResults");
    console.log(queryParams);

    const descriptions = queryEntity === "Description-mutate" ? 
                    (
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
                    ) : 
                    '';
    
    return (
        <div>
            {descriptions}
        </div>
    );
};

export default DescriptionMutateResults;
