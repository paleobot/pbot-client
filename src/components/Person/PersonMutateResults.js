import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const PersonMutateResults = ({queryParams, queryEntity}) => {
    console.log("PersonMutateResults");
    console.log(queryParams);

    let persons = queryEntity === "Person-mutate" ? (
                    <Mutator 
                        params={{
                            personID: queryParams.person || null,
                            given: queryParams.given || null,
                            surname: queryParams.surname || null,
                            email: queryParams.email || null,
                            orcid: queryParams.orcid || null,
                        }}
                        entity="Person"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {persons}
        </div>
    );
};

export default PersonMutateResults;
