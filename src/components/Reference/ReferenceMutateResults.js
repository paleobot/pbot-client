import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const ReferenceMutateResults = ({queryParams}) => {
    console.log("ReferenceMutateResults");
    console.log(queryParams);
    console.log(queryParams.authors);

    return (
        <Mutator
            params={{
                pbotID: queryParams.reference || null,
                title: queryParams.title || null,
                publisher: queryParams.publisher || null,
                year: queryParams.year || null,
                authors: queryParams.authors.map(({searchName, ...keepAttrs}) => keepAttrs)  || null, //.split(", "),
                pbdbid: queryParams.pbdbid || null,
                doi: queryParams.doi || null,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
            }}
            entity="Reference"
            mode={queryParams.mode}
        />
    );
};

export default ReferenceMutateResults;
