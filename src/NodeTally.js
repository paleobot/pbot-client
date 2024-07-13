import { gql, useQuery } from '@apollo/client'
import * as React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Box, Stack, Typography } from "@mui/material"


export const NodeTally = (props) => {

    const trueNodeType = 
        "References" === props.nodeType ? "Reference" :
        "Taxa" === props.nodeType ? "OTU" : 
        "Collections" === props.nodeType ? "Collection" : 
        "Specimens" === props.nodeType ? "Specimen" : 
        "Contributors" === props.nodeType ? "Person" : 
        "";



/*
    const gQL = gql`
            query ($nodeType: String!) {
                GetNodeCount (nodeType: $nodeType) 
            }
        `;

    console.log("executing query")
    const { loading, error, data } = useQuery(gQL, {
        variables: {
            nodeType: props.nodeType
        },        
        fetchPolicy: "cache-and-network"
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
*/
const [tally, setTally] = useState(0);

/* Note: I'm going at the graphql server via fetch here because Apollo client is not available yet.
*/
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

    const gQL = `
        query  {
            GetNodeCount (nodeType: "${trueNodeType}") 
        }
    `;
    console.log(gQL)

    useEffect(() => {
        setLoading(true);
        fetch(`/graphql`, {
            method: "POST", 
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: gQL }),
        })
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error (response.errors[0]);
                }
                console.log("tally response")
                console.log(response)
                setTally(response.data.GetNodeCount);
            }
        ).catch (
            (error) => {
                console.log("error!")
                console.log(error)
                setError(error)
            }
        )
    }, [])

    return (
        <Box sx={{p:"0px"}}>
            <Stack direction="column">
                <Typography variant="caption" sx={{ lineHeight: 1, color:"#2e7d32" }}>
                    {props.nodeType}
                </Typography>
                <Typography variant="caption" sx={{ lineHeight: 1, color: "grey" }}>
                    {tally}
                </Typography>
            </Stack>
        </Box>
    )
}
