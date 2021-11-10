import React, { useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
  useMutation,
  gql,
  useApolloClient
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
//Create new client. This will be passed explicitly to useMutation, since we already have a 
//client defined in the context from ApolloProvider. 
//TODO: Look into loading the ApolloProvider client on the fly using something like the 
//method described in https://github.com/apollographql/apollo-client/issues/2897.
const mclient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function CharacterCreate(props) {
    console.log("CharacterCreate");
    console.log(props);
    
    const qclient = useApolloClient();

    const gQL = gql`
            mutation ($data: CharacterInput!) {
                CustomCreateCharacter(data: $data) {
                    characterID
                }      
            }
        `;

    const [addCharacter, { data, loading, error }] = useMutation(gQL, {variables: {data: props.params}, client: mclient});

    //Apollo client mutations are a little weird. Rather than executing automatically on render, 
    //the hook returns a function we have to manually execute, in this case addDescription.
    //The idea is that this would be attached to a submit event, I guess, but that's not 
    //how this current architecture works. Instead, I'm using the useEffect hook with the empty 
    //array option that causes it to only execute once.
    useEffect(() => {
            addCharacter().catch((err) => {
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
        
        //Force reload of cache
        qclient.resetStore();

        const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"};
        return (
            <div key={data.CustomCreateCharacter.characterID} style={style}>
                {data.CustomCreateCharacter.characterID} <br />
                <br />
            </div>
        );
                
    } else {
        return (<div></div>); //gotta return something until addDescription runs
    }

}

const CharacterMutateResults = ({queryParams, queryEntity}) => {
    console.log("CharacterMutateResults");
    console.log(queryParams);

    let characters = queryEntity === "Character-mutate" ? (
                    <CharacterCreate 
                        params={{
                            name: queryParams.name || null,
                            defintion: queryParams.definion || null,
                            schemaID: queryParams.schema || null,
                        }}
                    />
                ) : 
                '';
    
    return (
        <div>
            {characters}
        </div>
    );
};

export default CharacterMutateResults;
