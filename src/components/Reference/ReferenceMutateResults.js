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
                bookTitle: queryParams.bookTitle || null,
                publicationType: queryParams.publicationType || null,
                firstPage: queryParams.firstPage || null,
                lastPage: queryParams.lastPage || null,
                journal:   queryParams.journal || null,
                publicationVolume: queryParams.publicationVolume || null,
                publicationNumber: queryParams.publicationNumber || null,
                publisher: queryParams.publisher || null,
                description: queryParams.description || null,
                bookType:  queryParams.bookType || null,
                editors: queryParams.editors || null,
                notes: queryParams.notes || null,
                year: queryParams.year || null,
                authors: queryParams.authors.map(({searchName, ...keepAttrs}) => keepAttrs)  || null, 
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
