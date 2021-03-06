import React, { useEffect } from 'react';
import Mutator from '../Mutator';
import {publicGroupID} from '../Group/GroupSelect.js';

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
                            acknowledgments: queryParams.acknowledgments || null,
                            authors: queryParams.authors || null, 
                            //authors: queryParams.authors.map(author => author.name) || null, 
                            references: queryParams.references || null,
                            groups: queryParams.public ? 
                                [publicGroupID] : queryParams.groups || null,
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
