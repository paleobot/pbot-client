import React, { useEffect } from 'react';
import Mutator from '../Mutator';


const GroupMutateResults = ({queryParams}) => {
    console.log("GroupMutateResults");
    console.log(queryParams);
    console.log(queryParams.members);

    return (
        <Mutator
            params={{
                pbotID: queryParams.group || null,
                name: queryParams.name || null,
                purpose: queryParams.purpose || null,
                members: queryParams.members ? 
                    queryParams.members.map(({pbotID}) => pbotID)  : null, 
            }}
            entity="Group"
            mode={queryParams.mode}
        />
    );
};

export default GroupMutateResults;
