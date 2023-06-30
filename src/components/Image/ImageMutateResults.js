import React, { useContext, useEffect } from 'react';
import Mutator from '../Mutator';
import { GlobalContext } from '../GlobalContext.js';

const ImageMutateResults = ({queryParams}) => {
    console.log("ImageMutateResults");
    console.log(queryParams);
    console.log(queryParams.specimens);

    const global = useContext(GlobalContext);
    console.log(global)
    console.log(global.publicGroupID)

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
                    [global.publicGroupID] : queryParams.groups || null,
            }}
            entity="Image"
            mode={queryParams.mode}
        />
    );
};

export default ImageMutateResults;
