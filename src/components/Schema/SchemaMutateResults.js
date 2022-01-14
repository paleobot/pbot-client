import React, { useEffect } from 'react';
import Mutator from '../Mutator';

const SchemaMutateResults = ({queryParams, queryEntity}) => {
    console.log("SchemaMutateResults");
    console.log(queryParams);
    console.log(queryParams.authors);

    let schemas = queryEntity === "Schema-mutate" ? (
                    <Mutator
                        params={{
                            pbotID: queryParams.schema || null,
                            title: queryParams.title || null,
                            year: queryParams.year || null,
                            authors: queryParams.authors || null, //.split(", "),
                            references: queryParams.references || null,
                            cascade: queryParams.cascade || false
                        }}
                        entity="Schema"
                        mode={queryParams.mode}
                    />
                ) : 
                '';
    
    return (
        <div>
            {schemas}
        </div>
    );
};

export default SchemaMutateResults;
