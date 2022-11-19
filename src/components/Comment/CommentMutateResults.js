import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const CommentMutateResults = ({queryParams}) => {
    console.log("CommentMutateResults");
    console.log(queryParams);

    return (
        <Mutator
            params={{
                pbotID: queryParams.comment || null,
                content: queryParams.content || null,
                //subjectID: queryParams.synonym || null,
                subjectID: queryParams.parentComment || queryParams.synonym || null, 
                references: queryParams.references || null,
            }}
            entity="Comment"
            mode={queryParams.mode}
        />
    );
};

export default CommentMutateResults;
