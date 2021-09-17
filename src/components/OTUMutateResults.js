import React, { useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
  useMutation,
  gql
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import CharacterInstances from "./CharacterInstances";
/*
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});
*/
const httpLink = createHttpLink({
  uri: '/graphql',
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('PBOTMutationToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function OTUcreate(props) {
    console.log(props);
    console.log(props.filters.genus);
    const specs = Object.keys(props.filters).reduce((acc, key) => {
        console.log(key + ", " + props.filters[key]);
        if (props.filters[key]) acc += `, ${key}: "${props.filters[key]}"`;
        return acc;
    }, 'type: "OTU", enteredByPersonID: "fbc53387-0447-479b-b655-e210884763ee"'); //TODO: set person through login of some sort
    console.log(specs);

    let otuGQL;
        /*
        otuGQL = gql`
            mutation {
                CreateDescription(${specs}) {
                    descriptionID
                }      
            }
        `;
        */
        otuGQL = gql`
            mutation {
                CustomCreateDescription(data:{${specs}}) {
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
            addDescription().catch((err) => {
                //Just eat it. The UI will get what it needs below through the error field defined on the hook.
                console.log("catch");
                console.log(err);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else if (error) {
        console.log("ERROR!");
        console.log(error);
        return <p>Error: {error.message}</p>;
    } else if (data) {
        console.log(data);
        
        const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"};
        return (
            <div key={data.CustomCreateDescription.descriptionID} style={style}>
                {data.CustomCreateDescription.descriptionID} <br />
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
