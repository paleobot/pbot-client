import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

import { gql } from "@apollo/client/core";
import { useApolloClient } from "@apollo/client/react/hooks/useApolloClient.js";
import { useMutation } from "@apollo/client/react/hooks/useMutation.js";

const SpecimenMutateResults = ({queryParams, queryEntity}) => {
    console.log("-------------------SpecimenMutateResults--------------------");
    console.log(queryParams);
    console.log(queryParams.references);
    console.log(queryParams.references[0].pbotID);
    //console.log(queryParams.images);
    //console.log(queryParams.images[0].image);
    console.log(queryParams.image)

    //TODO: 1) Move this into Mutator. 2) Can this be made part of the Specimen mutation in the API?
    const SINGLE_UPLOAD_MUTATION = gql`
    mutation singleUpload($file: Upload!) {
        singleUpload(file: $file) {
            filename
        }
    }
    `;

    const [uploadFileMutation] = useMutation(SINGLE_UPLOAD_MUTATION);
    const apolloClient = useApolloClient();
    uploadFileMutation({ variables: { file: queryParams.image } }).then(() => {
        apolloClient.resetStore();
    });

    /*
    let specimens = queryEntity === "Specimen-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.specimen || null,
                            name: queryParams.name || null,
                            references: queryParams.references || null,
                            organID: queryParams.organ || null,
                            preservationMode: queryParams.preservationMode || null,
                            descriptionIDs: queryParams.describedBy || null,
                            idigbiouuid: queryParams.idigbiouuid || null,
                            pbdbcid: queryParams.pbdbcid || null,
                            pbdboccid: queryParams.pbdboccid || null,
                            collection: queryParams.collection || null,
                            groups: queryParams.public ? 
                                [publicGroupID] : queryParams.groups || null,
                        }}
                        entity="Specimen"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    */
    const specimens = "Hi there";
    return (
        <div>
            {specimens}
        </div>
    );
};

export default SpecimenMutateResults;
