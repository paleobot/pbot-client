import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CollectionGroupMutateResults = ({queryParams}) => {
    console.log("CollectionGroupMutateResults");
    console.log(queryParams);

    return (
        <>
        
        <Mutator
            data={{
                collection_group_name: queryParams.name || null,
                collection_group_desc: queryParams.desc || null,
                collection_group_abbrv: queryParams.abbrv || null,
            }}
            entity="dicts/collection_groups"
            id={queryParams.cg || null}
            mode={queryParams.mode}
            random={queryParams.random}
        />
        
        </>
    );
};

export default CollectionGroupMutateResults;
