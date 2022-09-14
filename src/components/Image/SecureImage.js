//This is taken from https://stackoverflow.com/a/66273943

import React from 'react';

// This function is asynchronous since it returns a promise
// It converts a binary blob into a base64 string representation
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            resolve(reader.result);
        };
    });
}

function fetchImageAsBase64(url) {
    return new Promise((resolve) => {
        const jwt = localStorage.getItem('PBOTMutationToken');

        // Make a headers object that we can add to the request
        const headers = new Headers({
            authorization: "Bearer " + jwt,
        });

        // Make the request and wait for the response
        window
            .fetch(url, { headers })
            .then((response) => response.blob())
            .then((blob) => blobToBase64(blob))
            .then((base64) => resolve(base64));
    });
}

// This is our custom image component that puts this together
export class SecureImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageSrc: null,
        };
    }

    componentDidMount() {
        console.log("mounted");
        console.log(this.props.src);
        fetchImageAsBase64(this.props.src).then((base64String) => {
            this.setState({
                imageSrc: base64String,
            });
        });
    }

    render() {
        if (!this.state.imageSrc) {
            return "Loading...";
        }

        return <img src={this.state.imageSrc} alt={this.props.alt} width={200} />;
    }
}

