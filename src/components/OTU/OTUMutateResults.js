import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const OTUMutateResults = ({queryParams, queryEntity}) => {
    console.log("OTUMutateResults");
    console.log(queryParams);

    const otus = queryEntity === "OTU-mutate" ? 
                    (
                        <Mutator 
                            params={{
                                pbotID: queryParams.description || null,
                                exampleSpecimens: queryParams.exampleSpecimens || null,
                                holotype: queryParams.holotypeSpecimen || null,
                                family: queryParams.family || null, 
                                genus: queryParams.genus || null, 
                                species: queryParams.species || null, 
                                name: queryParams.name || null,
                                groups: queryParams.public ? 
                                    [publicGroupID] : queryParams.groups || null,
                            }}
                            entity="OTU"
                            mode={queryParams.mode}
                        />
                    ) : 
                    '';
    
    return (
        <div>
            {otus}
        </div>
    );
};

export default OTUMutateResults;
