import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CharacterInstanceMutateResults = ({queryParams}) => {
    console.log(queryParams);

    return (
        <Mutator
            params={{
                pbotID: queryParams.characterInstance || null,
                descriptionID: queryParams.description || null,
                characterID: queryParams.character || null, 
                stateID: queryParams.state.split(",")[1] || null,
                quantity: queryParams.quantity || null,
                order: queryParams.order || null,
            }}
            entity="CharacterInstance"
            mode={queryParams.mode}
        />
    );
};

export default CharacterInstanceMutateResults;
