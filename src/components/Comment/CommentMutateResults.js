import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CommentMutateResults = ({queryParams, queryEntity}) => {
    console.log("CommentMutateResults");
    console.log(queryParams);

    let comments = queryEntity === "Comment-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.comment || null,
                            content: queryParams.content || null,
                            subjectID: queryParams.synonym || null,
                            //parentID: queryParams.parentCharacter || queryParams.schema || null, 
                            references: queryParams.references || null,
                        }}
                        entity="Comment"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {comments}
        </div>
    );
};

export default CommentMutateResults;
