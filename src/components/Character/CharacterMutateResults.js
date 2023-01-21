import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CharacterMutateResults = ({queryParams}) => {
    console.log("CharacterMutateResults");
    console.log(queryParams);

    return (
        <Mutator
            params={{
                pbotID: queryParams.character || null,
                name: queryParams.name || null,
                definition: queryParams.definition || null,
                order: queryParams.order || null,
                parentID: queryParams.parentCharacter || queryParams.schema || null, 
                schemaID: queryParams.schema || null,
                cascade: queryParams.cascade || false
            }}
            entity="Character"
            mode={queryParams.mode}
        />
    );
};

export default CharacterMutateResults;
