import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const SynonymMutateResults = ({queryParams}) => {
    console.log("SynonymMutateResults");
    console.log(queryParams);

    return (
        <Mutator 
            params={{
                pbotID: queryParams.synonym || null,
                explanation: queryParams.explanation || null,
                otus: queryParams.otus || null,
                references: queryParams.references || null,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
            }}
            entity="Synonym"
            mode={queryParams.mode}
        />
    );
};

export default SynonymMutateResults;
