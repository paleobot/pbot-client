import React from 'react';
import { Button } from '@mui/material';

export default class Query extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {json: null};
    }
        
    onClick () {
        //alert('click');
        fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `
                query {
                    Reference {
                        title
                        publisher
                        year
                    }            
                }` 
            }),
        })
        .then(res => res.json())
        .then(res => this.setState({json: res}));
        //.then(res => console.log(res.data));
       
    }
    
    render() {
      
        const result = this.state.json === null ? '' : JSON.stringify(this.state.json, null, 4);
        return (
            <div>
                <h1>Hello, {this.props.name}</h1>
                <h2>Query using fetch of raw json</h2>
                <Button variant="contained" color="primary" onClick={() => this.onClick()}>
                    {this.props.value}
                </Button>
                <pre className="App-pre">
                    {result}
                </pre>
            </div>
        );
    }
}
