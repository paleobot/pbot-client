import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const SynonymMutateResults = ({queryParams, queryEntity}) => {
    console.log("SynonymMutateResults");
    console.log(queryParams);

    const synonyms = queryEntity === "Synonym-mutate" ? 
                    (
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
                    ) : 
                    '';
    
    return (
        <div>
            {synonyms}
        </div>
    );
};

export default SynonymMutateResults;
