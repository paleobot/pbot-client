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

function DescriptionCreate(props) {
    console.log(props);
    console.log(props.params.genus);
    const specs = Object.keys(props.params).reduce((acc, key) => {
        console.log(key + ", " + props.params[key]);
        if (props.params[key]) acc += `, ${key}: "${props.params[key]}"`;
        return acc;
    }, 'schemaID: "38e10c5e-3abb-4fb5-90f5-db42bc241752"'); //TODO: select these from form
    console.log(specs);

    let descriptionGQL;
        /*
        otuGQL = gql`
            mutation {
                CreateDescription(${specs}) {
                    descriptionID
                }      
            }
        `;
        */
        descriptionGQL = gql`
            mutation {
                CustomCreateDescription(data:{${specs}}) {
                    descriptionID
                }      
            }
        `;

    const [addDescription, { data, loading, error }] = useMutation(descriptionGQL);

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

const DescriptionMutateResults = ({queryParams, queryEntity}) => {
    console.log(queryParams);

    let descriptions = queryEntity === "Description-mutate" ? (
                    <DescriptionCreate 
                        params={{
                            type: queryParams.type,
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
            {descriptions}
        </ApolloProvider>
    );
};

export default DescriptionMutateResults;
