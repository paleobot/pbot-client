import logo from '../../PBOT-logo-transparent.png';
import {ApolloProvider} from "@apollo/client";
import { useParams, useSearchParams } from 'react-router-dom';
import {client} from '../../ApolloClientSetup.js';
import { AppBar, Typography, Link } from '@mui/material';
import CollectionQueryResults from './CollectionQueryResults';
import { GlobalProvider } from '../GlobalContext';

const CollectionDirectQueryResults = () => {
    const { collectionid } = useParams();
    const [search] = useSearchParams();
    console.log("search = " + search)

    console.log("collectionid = " + collectionid);
    //Get collection ID, create necessary parameters, and call CollectionQueryResults to do the work
    if (collectionid.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi)) {
        const queryParams = {
            collectionID: collectionid,
            groups: [], 
            includeSpecimens: "true" === search.get("includeSpecimens"),
            standAlone: true,
        };
        return (
            <GlobalProvider>
            <ApolloProvider client={client}>
                <CollectionQueryResults queryParams={queryParams} />
            </ApolloProvider>
            </GlobalProvider>
        );
    } else {
        return (
            <div>
                <h1>Not a valid PBOT URL</h1>
                <Typography variant="body1">To access the PBOT interface, go to <Link underline="hover" href={window.location.origin}  target="_blank">{window.location.origin}</Link></Typography>
                <Typography variant="body1">To view a Collection directly, the URL should look like this: {window.location.origin}/collection/<i>collectionid*</i></Typography>
                <br/>
                <Typography variant="body1" style={{marginLeft: "2em"}}><i>*</i>collectionid is a uuid that identifies a Collection in the PBOT database</Typography>
            </div>
        )
    }
}

export default CollectionDirectQueryResults;
