import logo from '../../PBOT-logo-transparent.png';
import {ApolloProvider} from "@apollo/client";
import { useParams, useSearchParams } from 'react-router-dom';
import {client} from '../../ApolloClientSetup.js';
import { AppBar, Typography, Link } from '@mui/material';
import SpecimenQueryResults from './SpecimenQueryResults';
import { GlobalProvider } from '../GlobalContext';

const SpecimenDirectQueryResults = () => {
    const { specimenid } = useParams();
    const [search] = useSearchParams();
    console.log("search = " + search)

    console.log("specimenid = " + specimenid);
    //Get specimenid ID, create necessary parameters, and call SpecimenQueryResults to do the work
    if (specimenid.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi)) {
        const queryParams = {
            specimenID: specimenid,
            organs:[],
            groups: [], 
            includeImages: "true" === search.get("includeImages"),
            includeDescriptions: "true" === search.get("includeDescriptions"),
            includeOTUs: "true" === search.get("includeOTUs"),
            standAlone: true,
        };
        return (
            <GlobalProvider>
            <ApolloProvider client={client}>
                <SpecimenQueryResults queryParams={queryParams} />
            </ApolloProvider>
            </GlobalProvider>
        );
    } else {
        return (
            <div>
                <h1>Not a valid PBOT URL</h1>
                <Typography variant="body1">To access the PBOT interface, go to <Link underline="hover" href={window.location.origin}  target="_blank">{window.location.origin}</Link></Typography>
                <Typography variant="body1">To view a Specimen directly, the URL should look like this: {window.location.origin}/specimen/<i>specimenid*</i></Typography>
                <br/>
                <Typography variant="body1" style={{marginLeft: "2em"}}><i>*</i>specimenid is a uuid that identifies a Specimen in the PBOT database</Typography>
            </div>
        )
    }
}

export default SpecimenDirectQueryResults;
