import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const OrganMutateResults = ({queryParams, queryEntity}) => {
    console.log("OrganMutateResults");
    console.log(queryParams);

    let organs = queryEntity === "Organ-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.organ || null,
                            type: queryParams.type || null,
                        }}
                        entity="Organ"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {organs}
        </div>
    );
};

export default OrganMutateResults;
