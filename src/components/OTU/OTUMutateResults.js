import React, { useEffect } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import Mutator from '../Mutator';

const OTUMutateResults = ({queryParams}) => {
    console.log("OTUMutateResults");
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <Mutator 
            params={{
                pbotID: queryParams.otu || null,
                identifiedSpecimens: queryParams.identifiedSpecimens || null,
                partsPreservedIDs: queryParams.partsPreserved || null,
                notableFeaturesIDs: queryParams.notableFeatures || null,
                notes: queryParams.notes || null,
                typeSpecimens: queryParams.typeSpecimens || null,
                holotypeSpecimen: queryParams.holotypeSpecimen || null,
                majorTaxonGroup: queryParams.majorTaxonGroup || null,
                pbdbParentTaxon: queryParams.pbdbParentTaxon || null,
                family: queryParams.family || null, 
                genus: queryParams.genus || null, 
                species: queryParams.species || null, 
                additionalClades: queryParams.additionalClades || null, 
                name: queryParams.name || null,
                authority: queryParams.authority || null,
                diagnosis: queryParams.diagnosis || null,
                qualityIndex: queryParams.qualityIndex || null,
                references: queryParams.references || null,
                groups: queryParams.public ? 
                    [global.publicGroupID] : queryParams.groups || null,
            }}
            entity="OTU"
            mode={queryParams.mode}
        />
    );
};

export default OTUMutateResults;
