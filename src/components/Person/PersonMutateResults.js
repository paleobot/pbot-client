import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const PersonMutateResults = ({queryParams}) => {
    console.log("PersonMutateResults");
    console.log(queryParams);

    return (
        <Mutator 
            params={{
                pbotID: queryParams.person || null,
                given: queryParams.given || null,
                middle: queryParams.middle || null,
                surname: queryParams.surname || null,
                email: queryParams.email || null,
                orcid: queryParams.orcid || null,
            }}
            entity="Person"
            mode={queryParams.mode}
        />
    );
};

export default PersonMutateResults;
