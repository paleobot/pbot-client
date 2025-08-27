import React from 'react';
import { Button } from '@mui/material';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

const REFERENCES = gql`
    query {
        Reference {
            title
            publisher
            year
        }            
    }
`;

function References() {
  const { loading, error, data } = useQuery(REFERENCES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.Reference.map(({ title, publisher, year }) => (
    <div key={title}>
      <p>
        {title}: {publisher}, {year}
      </p>
    </div>
  ));
}

export default class ApolloQuery extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {showRefs: false};
    }
        
    onClick () {
        //alert('click');
        this.setState({showRefs: true})
       
    }
    
    render() {
      
        const refs = this.state.showRefs ? (
            <References />
        ) : '';
        
        return (
            <ApolloProvider client={client}>
            <div>
                <h1>Hello, {this.props.name}</h1>
                <h2>Query using Apollo Client</h2>
                <Button variant="contained" color="primary" onClick={() => this.onClick()}>
                    {this.props.value}
                </Button>
                {refs}
            </div>
            </ApolloProvider>
        );
    }
}
