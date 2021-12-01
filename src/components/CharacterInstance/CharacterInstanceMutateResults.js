import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CharacterInstanceMutateResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let characterInstances = queryEntity === "CharacterInstance-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.characterInstance || null,
                            descriptionID: queryParams.description || null,
                            characterID: queryParams.character || null, 
                            stateID: queryParams.state.split(",")[1] || null,
                            quantity: queryParams.quantity || null,
                        }}
                        entity="CharacterInstance"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {characterInstances}
        </div>
    );
};

export default CharacterInstanceMutateResults;
