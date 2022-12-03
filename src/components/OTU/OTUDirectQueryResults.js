import logo from '../../PBOT-logo-transparent.png';
import {ApolloProvider} from "@apollo/client";
import { useParams, useSearchParams } from 'react-router-dom';
import {client} from '../../ApolloClientSetup.js';
import { AppBar, Typography, Link } from '@mui/material';
import OTUQueryResults from './OTUQueryResults';

const OTUDirectQueryResults = () => {
    const { otuid } = useParams();
    console.log("otuid = " + otuid);
    const [search] = useSearchParams();
    console.log("search = " + search)

    //Get otu ID, create necessary parameters, and call OTUQueryResults to do the work
    if (otuid.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi)) {
        const queryParams = {
            otuID: otuid,
            groups: [], 
            includeSynonyms: "true" === search.get("includeSynonyms"),
            includeComments: "true" === search.get("includeComments"),
            includeHolotypeDescription: "true" === search.get("includeHolotypeDescription"),
            includeMergedDescription: "true" === search.get("includeMergedDescription"), 
            standAlone: true,
        };
        return (
            <ApolloProvider client={client}>
                <OTUQueryResults queryParams={queryParams} />
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
