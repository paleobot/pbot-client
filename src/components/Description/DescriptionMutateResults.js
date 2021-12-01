import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const DescriptionMutateResults = ({queryParams, queryEntity}) => {
    console.log("DescriptionMutateResults");
    console.log(queryParams);

    const descriptions = queryEntity === "Description-mutate" ? 
                    (
                        <Mutator 
                            params={{
                                pbotID: queryParams.description || null,
                                type: queryParams.type || null,
                                specimenID: queryParams.specimen || null,
                                schemaID: queryParams.schema || null,
                                family: queryParams.family || null, 
                                genus: queryParams.genus || null, 
                                species: queryParams.species || null, 
                                name: queryParams.name || null,
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
