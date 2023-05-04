import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

const CollectionMutateResults = ({queryParams}) => {
    console.log("CollectionMutateResults");
    console.log(queryParams);
    console.log(queryParams.specimens);

    return (
        <Mutator
            params={{
                pbotID: queryParams.collection || null,
                name: queryParams.name || null,
                mininterval: queryParams.mininterval || queryParams.maxinterval,
                maxinterval: queryParams.maxinterval || null,
                collectionType: queryParams.collectiontype || null,
                sizeClasses: queryParams.sizeclasses || null,
                lithology: queryParams.lithology || null,
                additionalLithology: queryParams.additionallithology || null,
                stratigraphicGroup: queryParams.stratigraphicgroup || null,
                stratigraphicFormation: queryParams.stratigraphicformation || null,
                stratigraphicMember: queryParams.stratigraphicmember || null,
                stratigraphicBed: queryParams.stratigraphicbed || null,
                stratigraphicComments: queryParams.stratigraphiccomments || null,
                preservationModeIDs: queryParams.preservationmodes || null,
                environment: queryParams.environment || null,
                environmentComments: queryParams.environmentcomments || null,
                collectors: queryParams.collectors || null,
                collectionMethods: queryParams.collectionmethods || null,
                collectingComments: queryParams.collectingcomments || null,
                lat: parseFloat(queryParams.lat) || null,
                lon: parseFloat(queryParams.lon) || null,
                gpsCoordinateUncertainty: parseInt(queryParams.gpsuncertainty) || null,
                geographicResolution: queryParams.geographicresolution || null,
                geographicComments: queryParams.geographiccomments || null,
                directDate: parseInt(queryParams.directdate) || null,
                directDateError: parseInt(queryParams.directdateerror) || null,
                directDateType: queryParams.directdatetype || null,
                numericAgeMin: parseInt(queryParams.numericagemin) || null,
                numericAgeMinError: parseInt(queryParams.numericageminerror) || null,
                numericAgeMinType: queryParams.numericagemintype || null,
                numericAgeMax: parseInt(queryParams.numericagemax) || null,
                numericAgeMaxError: parseInt(queryParams.numericagemaxerror) || null,
                numericAgeMaxType: queryParams.numericagemaxtype || null,
                ageComments: queryParams.agecomments || null,
                protectedSite: queryParams.protectedSite || false,
                country: queryParams.country || null,
                state: queryParams.state || null,
                pbdbid: queryParams.pbdbid || null,
                references: queryParams.references || null,
                cascade: queryParams.cascade || false,
                groups: queryParams.public ? 
                    [publicGroupID] : queryParams.groups || null,
            }}
            entity="Collection"
            mode={queryParams.mode}
        />
    );
};

export default CollectionMutateResults;
