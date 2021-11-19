import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";

function References(props) {
    console.log(props);
    
    //toss out falsy fields
    let filters = Object.fromEntries(Object.entries(props.filters).filter(([_, v]) => v ));

    const gQL = gql`
            query ($referenceID: ID, $title: String, $year: String, $publisher: String) {
                Reference (referenceID: $referenceID, title: $title, year: $year, publisher: $publisher) {
                    referenceID
                    title
                    year
                    publisher
                }
            }
        `;
    
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            ...filters
        },
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Reference.map(({ referenceID, title, year, publisher }) => (
        <div key={referenceID} style={style}>
            {referenceID}, {title}, {year}, {publisher} <br />
            <br />
        </div>
    ));

}

const ReferenceQueryResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let references = queryEntity === "Reference" ? (
                    <References 
                        filters={{
                            referenceID: queryParams.referenceID || null,
                            title: queryParams.title || null, 
                            year: queryParams.year || null, 
                            publisher: queryParams.publisher || null, 
                        }}
                    />
                ) : 
                '';
    
    return (
        <div>
            {references}
        </div>
    );
};

export default ReferenceQueryResults;
