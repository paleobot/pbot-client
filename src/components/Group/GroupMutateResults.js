import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const GroupMutateResults = ({queryParams, queryEntity}) => {
    console.log("GroupMutateResults");
    console.log(queryParams);
    console.log(queryParams.members);

    let groups = queryEntity === "Group-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.group || null,
                            name: queryParams.name || null,
                            members: queryParams.members || null 
                        }}
                        entity="Group"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {groups}
        </div>
    );
};

export default GroupMutateResults;
