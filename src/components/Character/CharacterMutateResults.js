import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CharacterMutateResults = ({queryParams, queryEntity}) => {
    console.log("CharacterMutateResults");
    console.log(queryParams);

    let characters = queryEntity === "Character-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.character || null,
                            name: queryParams.name || null,
                            definition: queryParams.definition || null,
                            parentID: queryParams.parentCharacter || queryParams.schema || null, 
                            schemaID: queryParams.schema || null,
                            cascade: queryParams.cascade || false
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
