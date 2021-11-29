import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CharacterMutateResults = ({queryParams, queryEntity}) => {
    console.log("CharacterMutateResults");
    console.log(queryParams);

    let characters = queryEntity === "Character-mutate" ? (
                    <Mutator
                        params={{
                            characterID: queryParams.character || null,
                            name: queryParams.name || null,
                            definition: queryParams.definition || null,
                            schemaID: queryParams.schema || null,
                        }}
                        entity="Character"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {characters}
        </div>
    );
};

export default CharacterMutateResults;
