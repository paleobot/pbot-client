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

const jwt = localStorage.getItem('PBOTMutationToken');

// Make a headers object that we can add to the request
const headers = new Headers({
    authorization: "Bearer " + jwt,
});

function fetchImageAsBase64(url) {
    console.log("fetching " + url);
    return new Promise((resolve) => {

        // Make the request and wait for the response
        window
            .fetch(url, { headers }).catch(e=> {console.log(e);})
            .then((response) => response.blob()).catch(e=> {console.log(e);})
            .then((blob) => blobToBase64(blob)).catch(e=> {console.log(e);})
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
        
        //If the url is to our host, need to fetch the image securely. 
        if (new URL(this.props.src).hostname === window.location.host.split(':')[0]) {
            fetchImageAsBase64(this.props.src).then((base64String) => {
                this.setState({
                    imageSrc: base64String,
                });
            });
        } else {
                this.setState({
                    imageSrc: this.props.src,
                });
        }
    }

    render() {
        if (!this.state.imageSrc) {
            return "Loading...";
        }

        return <img src={this.state.imageSrc} alt={this.props.alt} width={this.props.width} />;
    }
}

