import logo from '../../PBOT-logo-transparent.png';
import {ApolloProvider} from "@apollo/client";
import {client} from '../../ApolloClientSetup.js';
import { AppBar, Typography, Link } from '@mui/material';
import OTUQueryResults from './OTUQueryResults';

const OTUDirectQueryResults = () => {
    const pathComponents = window.location.pathname.split("/");
    //Get otu ID, create necessary parameters, and call OTUQueryResults to do the work
    if (pathComponents.length == 3 && 
        "otu" == pathComponents[1] &&
        pathComponents[2].match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi)) {
        const queryEntity = "OTU";
        const queryParams = {
            otuID: pathComponents[2],
            groups: [], 
            includeSynonyms: true,
            includeComments: true,
            includeHolotypeDescription: true,
            includeMergedDescription: true, 
            standAlone: true,
        };
        return (
            <ApolloProvider client={client}>
                <AppBar position="static" >
                    <Typography variant="h2"><img src={logo} style={{ height: "15vmin" }} />PBOT OTU</Typography>
                </AppBar>
                <OTUQueryResults queryParams={queryParams} queryEntity={queryEntity}/>
            </ApolloProvider>
        );
    } else {
        return (
            <div>
                <h1>Not a valid PBOT URL</h1>
                <Typography variant="body1">To access the PBOT interface, go to <Link underline="hover" href={window.location.origin}  target="_blank">{window.location.origin}</Link></Typography>
                <Typography variant="body1">To view an OTU directly, the URL should look like this: {window.location.origin}/otu/<i>otuID*</i></Typography>
                <br/>
                <Typography variant="body1" style={{marginLeft: "2em"}}><i>*</i>otuID is a uuid that identifies an OTU in the PBOT database</Typography>
            </div>
        )
    }
}

export default OTUDirectQueryResults;
