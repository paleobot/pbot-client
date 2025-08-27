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
import { createUploadLink } from "apollo-upload-client";

/*
const httpLink = createHttpLink({
    uri: '/graphql',
    //useGETForQueries: true
});
*/
const httpLink = createUploadLink({
    uri: '/graphql',
    //useGETForQueries: true
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('PBOTMutationToken');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            "apollo-require-preflight": "true",
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});
//TODO: Look into loading the ApolloProvider client on the fly using something like the 
//method described in https://github.com/apollographql/apollo-client/issues/2897.
export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});
