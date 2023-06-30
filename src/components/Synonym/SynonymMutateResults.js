import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../GlobalContext';
import Mutator from '../Mutator';

const SynonymMutateResults = ({queryParams}) => {
    console.log("SynonymMutateResults");
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <Mutator 
            params={{
                pbotID: queryParams.synonym || null,
                explanation: queryParams.explanation || null,
                otus: queryParams.otus || null,
                references: queryParams.references || null,
                groups: queryParams.public ? 
                    [global.publicGroupID] : queryParams.groups || null,
            }}
            entity="Synonym"
            mode={queryParams.mode}
        />
    );
};

export default SynonymMutateResults;
