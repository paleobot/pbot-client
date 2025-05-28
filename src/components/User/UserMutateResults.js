import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const UserMutateResults = ({queryParams}) => {
    console.log("PersonMutateResults");
    console.log(queryParams);

    return (
        <Mutator 
            data={{
                firstName: queryParams.givenName || null,
                lastName: queryParams.surname || null,
                email: queryParams.email || null,
                desiredRole: queryParams.role || null,
                password: queryParams.password || null,
                organization: queryParams.organization || "AZGS",
                tos: queryParams.tos || true,
            }}
            entity="users"
            mode={queryParams.mode}
            random={queryParams.random}
        />
    );

};

export default UserMutateResults;
