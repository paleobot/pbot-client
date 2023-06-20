import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const ImageMutateResults = ({queryParams}) => {
    console.log("ImageMutateResults");
    console.log(queryParams);
    console.log(queryParams.specimens);

    return (
        <Mutator
            params={{
                pbotID: queryParams.image || null,
                imageOf: queryParams.specimen || null, 
                image: queryParams.uploadImage || null,
                category: queryParams.category || null,
                link: queryParams.link || null,
                citation: queryParams.citation || null,
                caption: queryParams.caption || null,
                //type: queryParams.type || null,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
            }}
            entity="Image"
            mode={queryParams.mode}
        />
    );
};

export default ImageMutateResults;
