import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const SpecimenMutateResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let specimens = queryEntity === "Specimen-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.specimen || null,
                            name: queryParams.name || null,
                            locality: queryParams.locality || null,
                            organID: queryParams.organ || null,
                            preservationMode: queryParams.preservationMode || null,
                            descriptionID: queryParams.describedBy || null,
                            otuID: queryParams.exampleOf || null,
                            idigbiouuid: queryParams.idigbiouuid || null,
                            pbdbcid: queryParams.pbdbcid || null,
                            pbdboccid: queryParams.pbdboccid || null,
                            groups: queryParams.groups || null,
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
