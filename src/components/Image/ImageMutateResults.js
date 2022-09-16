import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const ImageMutateResults = ({queryParams, queryEntity}) => {
    console.log("ImageMutateResults");
    console.log(queryParams);
    console.log(queryParams.specimens);

    let images = queryEntity === "Image-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.image || null,
                            imageOf: queryParams.specimen || null, 
                            image: queryParams.uploadImage || null,
                            link: queryParams.link || null,
                            citation: queryParams.citation || null,
                            caption: queryParams.caption || null,
                            type: queryParams.type || null,
                            groups: queryParams.public ? 
                                [publicGroupID] : queryParams.groups || null,
                        }}
                        entity="Image"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {images}
        </div>
    );
};

export default ImageMutateResults;
