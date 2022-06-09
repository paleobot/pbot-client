import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const SpecimenMutateResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let specimens = queryEntity === "Specimen-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.specimen || null,
                            name: queryParams.name || null,
                            references: queryParams.references || null,
                            locality: queryParams.locality || null,
                            organID: queryParams.organ || null,
                            preservationMode: queryParams.preservationMode || null,
                            descriptionIDs: queryParams.describedBy || null,
                            exampleOfID: queryParams.exampleOf || null,
                            holotypeOfID: queryParams.holotypeOf || null,
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
    
    return (
        <div>
            {specimens}
        </div>
    );
};

export default SpecimenMutateResults;
