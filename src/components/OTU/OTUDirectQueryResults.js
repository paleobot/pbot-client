import logo from '../../PBOT-logo-transparent.png';
import {ApolloProvider} from "@apollo/client";
import {client} from '../../ApolloClientSetup.js';
import { AppBar, Typography } from '@mui/material';
import OTUQueryResults from './OTUQueryResults';

const OTUDirectQueryResults = () => {
    const pathComponents = window.location.pathname.split("/");
    //Get otu ID, create necessary parameters, and call OTUQueryResults to do the work
    if (pathComponents.length == 4 && 
        pathComponents[3].match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi)) {
        const queryEntity = "OTU";
        const queryParams = {
            otuID: pathComponents[3],
            groups: [], 
            includeSynonyms: true,
            includeComments: true,
            includeHolotypeDescription: true,
            includeMergedDescription: true, 
            standAlone: true,
        };
        return (
            <ApolloProvider client={client}>
                <AppBar>
                    <Typography variant="h2"><img src={logo} style={{ height: "30vmin" }} />PBOT OTU</Typography>
                </AppBar>
                <div style={{marginTop: "40vmin"}}>
                    <OTUQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
                </div>
            </ApolloProvider>
        );
    } else {
        return (
            <h1>I have no idea what you want</h1>
        )
    }
}

export default OTUDirectQueryResults;
