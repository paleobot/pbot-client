import logo from '../../PBOT-logo-transparent.png';
import {ApolloProvider} from "@apollo/client";
import { useParams, useSearchParams } from 'react-router-dom';
import {client} from '../../ApolloClientSetup.js';
import { AppBar, Typography, Link } from '@mui/material';
import ReferenceQueryResults from './ReferenceQueryResults';
import { GlobalProvider } from '../GlobalContext';

const ReferenceDirectQueryResults = () => {
    const { referenceid } = useParams();
    const [search] = useSearchParams();
    console.log("search = " + search)

    console.log("referenceid = " + referenceid);
    //Get reference ID, create necessary parameters, and call ReferenceQueryResults to do the work
    if (referenceid.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}(,?[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})*$/gi)) {
        const queryParams = {
            referenceID: referenceid ? referenceid.split(',') : null,
            groups: [], 
            standAlone: true,
            format: search.get("format"),
        };
        return (
            <GlobalProvider>
            <ApolloProvider client={client}>
                <ReferenceQueryResults queryParams={queryParams} />
            </ApolloProvider>
            </GlobalProvider>
        );
    } else {
        return (
            <div>
                <h1>Not a valid PBOT URL</h1>
                <Typography variant="body1">To access the PBOT interface, go to <Link underline="hover" href={window.location.origin}  target="_blank">{window.location.origin}</Link></Typography>
                <Typography variant="body1">To view a Schema directly, the URL should look like this: {window.location.origin}/schema/<i>schemaid*</i></Typography>
                <br/>
                <Typography variant="body1" style={{marginLeft: "2em"}}><i>*</i>schemaid is a uuid that identifies a Schema in the PBOT database</Typography>
            </div>
        )
    }
}

export default ReferenceDirectQueryResults;
