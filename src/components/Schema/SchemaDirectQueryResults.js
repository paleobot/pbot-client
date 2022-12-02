import logo from '../../PBOT-logo-transparent.png';
import {ApolloProvider} from "@apollo/client";
import { useParams, useSearchParams } from 'react-router-dom';
import {client} from '../../ApolloClientSetup.js';
import { AppBar, Typography, Link } from '@mui/material';
import SchemaQueryResults from './SchemaQueryResults';

const SchemaDirectQueryResults = () => {
    const { schemaid } = useParams();
    const [search] = useSearchParams();
    console.log("search = " + search)

    console.log("schemaid = " + schemaid);
    //Get schema ID, create necessary parameters, and call SchemaQueryResults to do the work
    if (schemaid.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi)) {
        const queryParams = {
            schemaID: schemaid,
            groups: [], 
            includeCharacters: "true" === search.get("includeCharacters"),
            standAlone: true,
        };
        return (
            <ApolloProvider client={client}>
                <SchemaQueryResults queryParams={queryParams} />
            </ApolloProvider>
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

export default SchemaDirectQueryResults;
