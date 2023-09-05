import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import Descriptions from "./Descriptions.js";
import { useContext } from 'react';
import { GlobalContext } from '../GlobalContext.js';

function DescriptionList(props) {
    console.log("DescriptionList");
    console.log(props);
    console.log(props.filters.genus);

    const global = useContext(GlobalContext);

    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));
    
    const filter = filters.specimen ?
        ", filter: {AND: [{elementOf_some: {pbotID_in: $groups}}, {specimens_some: {Specimen: {pbotID: $specimen}}}]}" :
        ", filter: {elementOf_some: {pbotID_in: $groups}}";
        
    
    let descriptionGQL;
    descriptionGQL = gql`
        query (
            $pbotID: ID, 
            ${filters.specimen ? ", $specimen: ID" : ""} 
            $groups: [ID!]
        ) {
            Description (
                pbotID: $pbotID
                ${filter}
            ) {
                pbotID
                name
                notes
                schema {
                    pbotID
                }
                specimens {
                    Specimen {
                    name
                    pbotID
                    }
                }
                elementOf {
                    name
                    pbotID
                }
                references (orderBy: order_asc) {
                    Reference {
                        pbotID
                    }
                    order
                }
            }            
        }
        
    `;
    
    const { loading, error, data } = useQuery(descriptionGQL, {
        variables: {
            ...filters
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    return (
        <Descriptions public={(filters.groups && filters.groups.length === 1 && global.publicGroupID === filters.groups[0])} descriptions={data.Description} select={props.select} handleSelect={props.handleSelect}/>
    );

}

const DescriptionQueryResults = ({queryParams, select, handleSelect}) => {
    console.log(queryParams);

    const global = useContext(GlobalContext);

    return (
        <DescriptionList 
            filters={{
                pbotID: queryParams.descriptionID || null,
                specimen: queryParams.specimen || null,
                groups: queryParams.groups.length === 0 ? [global.publicGroupID] : queryParams.groups, 
            }}
            includeComplex={queryParams.includeComplex} 
            select={select}
            handleSelect={handleSelect}
        />
    );
};

export default DescriptionQueryResults;
