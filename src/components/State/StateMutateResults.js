import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const StateMutateResults = ({queryParams, queryEntity}) => {
    console.log("StateMutateResults");
    console.log(queryParams);

    let states = queryEntity === "State-mutate" ? (
                    <Mutator
                        params={{
                            stateID: queryParams.state || null,
                            name: queryParams.name || null,
                            definition: queryParams.definition || null,
                            characterID: queryParams.character || null,
                            parentStateID: queryParams.parentState || null
                        }}
                        entity="State"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {states}
        </div>
    );
};

export default StateMutateResults;
