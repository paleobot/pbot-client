import React from 'react';

const QueryHelper = (queryHelper, relationshipName, values, filterTemplate) => {
    queryHelper = queryHelper ? queryHelper : {};
    
    if (values && values.length > 0) {
        queryHelper[relationshipName] = {
            filterStrings: [],
            queryVariableStrings: [],
            filterValues: {}
        };
        values.forEach((v,i) => {
            queryHelper[relationshipName].filterStrings[i] = `, $${relationshipName}${i}: ID`;
            queryHelper[relationshipName].filterValues[`${relationshipName}${i}`] = v;
            if (filterTemplate) {
                queryHelper[relationshipName].queryVariableStrings[i] = filterTemplate.replace("<<nameString>>", `$${relationshipName}${i}`)

            } else {
                queryHelper[relationshipName].queryVariableStrings[i] = `, {
                    ${relationshipName}_some: {
                        {
                            pbotID: $${relationshipName}${i}
                        }
                    }
                }
                `
            }
        })
    }

    return queryHelper


}

export default QueryHelper