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
                surname: queryParams.surname || null,
                email: queryParams.email || null,
                orcid: queryParams.orcid || null,
                groups: queryParams.groups || null,
            }}
            entity="Person"
            mode={queryParams.mode}
        />
    );
};

export default PersonMutateResults;
