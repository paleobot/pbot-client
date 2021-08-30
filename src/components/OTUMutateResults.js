import React, { useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  gql
} from "@apollo/client";
import CharacterInstances from "./CharacterInstances";

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

function OTUcreate(props) {
    console.log(props);
    console.log(props.filters.genus);
    const specs = Object.keys(props.filters).reduce((acc, key) => {
        console.log(key + ", " + props.filters[key]);
        if (props.filters[key]) acc += `, ${key}: "${props.filters[key]}"`;
        return acc;
    }, 'type: "OTU"');
    console.log(specs);

    let otuGQL;
        otuGQL = gql`
            mutation {
                CreateDescription(${specs}) {
                    descriptionID
                }            
            }
        `;
    
    const [addDescription, { data, loading, error }] = useMutation(otuGQL);

    //Apollo client mutations are a little weird. Rather than executing automatically on render, 
    //the hook returns a function we have to manually execute, in this case addDescription.
    //The idea is that this would be attached to a submit event, I guess, but that's not 
    //how this current architecture works. Instead, I'm using the useEffect hook with the empty 
    //array option that causes it to only execute once.
    useEffect(() => {
        addDescription();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else if (error) {
        return <p>Error :(</p>;
    } else if (data) {
        console.log(data);
        
        const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"};
        return (
            <div key={data.CreateDescription.descriptionID} style={style}>
                {data.CreateDescription.descriptionID} <br />
                <br />
            </div>
        );
        
    } else {
        return (<div></div>); //gotta return something until addDescription runs
    }

}

const OTUMutateResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let otus = queryEntity === "OTU-mutate" ? (
                    <OTUcreate 
                        filters={{
                            family: queryParams.family, 
                            genus: queryParams.genus, 
                            species: queryParams.species, 
                            name: queryParams.genus + ' ' + queryParams.species,
                        }}
                    />
                ) : 
                '';
    
    return (
        <ApolloProvider client={client}>
            {otus}
        </ApolloProvider>
    );
};

export default OTUMutateResults;
