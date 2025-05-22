import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CollectionGroupMutateResults = ({queryParams}) => {
    console.log("OrganMutateResults");
    console.log(queryParams);

    return (
        <>
        <p>Not yet implemented</p>
        {/*}
        <Mutator
            params={{
                pbotID: queryParams.organ || null,
                type: queryParams.type || null,
            }}
            entity="Organ"
            mode={queryParams.mode}
        />
        */}
        </>
    );
};

export default CollectionGroupMutateResults;
