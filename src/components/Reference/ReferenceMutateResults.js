import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const ReferenceMutateResults = ({queryParams, queryEntity}) => {
    console.log("ReferenceMutateResults");
    console.log(queryParams);
    console.log(queryParams.authors);

    let references = queryEntity === "Reference-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.reference || null,
                            title: queryParams.title || null,
                            publisher: queryParams.publisher || null,
                            year: queryParams.year || null,
                            authors: queryParams.authors || null, //.split(", "),
                            doi: queryParams.doi || null,
                            group: queryParams.group || null,
                        }}
                        entity="Reference"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {references}
        </div>
    );
};

export default ReferenceMutateResults;
