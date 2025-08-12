import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const CollectionMutateResults = ({queryParams}) => {
    console.log("CollectionMutateResults");
    console.log(queryParams);
    console.log(queryParams.specimens);

    const global = useContext(GlobalContext);

    return (
        <Mutator
            params={{
                pbotID: queryParams.collection || null,
                name: queryParams.name || null,
                timescale: queryParams.timescale || null,
                mininterval: queryParams.mininterval ? 
                    JSON.parse(queryParams.mininterval).name :
                    queryParams.maxinterval ? 
                        JSON.parse(queryParams.maxinterval).name : 
                        null,
                maxinterval: queryParams.maxinterval ? JSON.parse(queryParams.maxinterval).name : null,
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
               location: { 
                    latitude: parseFloat(queryParams.lat) || null, 
                    longitude: parseFloat(queryParams.lon) || null
                },
                gpsCoordinateUncertainty: parseFloat(queryParams.gpsuncertainty) || null,
                geographicResolution: queryParams.geographicresolution || null,
                geographicComments: queryParams.geographiccomments || null,
                directDate: parseFloat(queryParams.directdate) || null,
                directDateError: parseFloat(queryParams.directdateerror) || null,
                directDateType: queryParams.directdatetype || null,
                numericAgeMin: parseFloat(queryParams.numericagemin) || null,
                numericAgeMinError: parseFloat(queryParams.numericageminerror) || null,
                numericAgeMinType: queryParams.numericagemintype || null,
                numericAgeMax: parseFloat(queryParams.numericagemax) || null,
                numericAgeMaxError: parseFloat(queryParams.numericagemaxerror) || null,
                numericAgeMaxType: queryParams.numericagemaxtype || null,
                ageComments: queryParams.agecomments || null,
                protectedSite: queryParams.protectedSite || false,
                country: queryParams.country || null,
                state: queryParams.state || null,
                pbdbid: queryParams.pbdbid || null,
                references: queryParams.references || null,
                cascade: queryParams.cascade || false,
                groups: queryParams.public ? 
                    [global.publicGroupID] : queryParams.groups || null,
            }}
            entity="Collection"
            mode={queryParams.mode}
        />
    );
};

export default CollectionMutateResults;
