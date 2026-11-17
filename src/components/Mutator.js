import React, { useEffect } from 'react';


import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
  useMutation,
  gql,
  useApolloClient
} from "@apollo/client";

const Mutator = (props) => {
//function Mutater(props) {
    console.log("Mutator");
    console.log(props);
    
    const client = useApolloClient();
    
    //const entityID=`${props.entity[0].toLowerCase()}${props.entity.slice(1)}ID`;
    const entityID="pbotID";

    //These deletes take the server's slim DeleteInput {pbotID, cascade}. The rest (Person, Organ,
    //PreservationMode, Feature) are refused by the server and still take their entity input.
    const slimDeleteEntities = ["Reference", "Schema", "Character", "State", "Description", "CharacterInstance",
        "OTU", "Synonym", "Comment", "Specimen", "Collection", "Group", "Image"];
    const slimDelete = props.mode === "delete" && slimDeleteEntities.includes(props.entity);

    let gQL;
    gQL = props.mode === "edit" ?
        gql`
            mutation ($data: ${props.entity}Input!) {
                Update${props.entity}(data: $data) {
                    ${entityID}
                }      
            }
        ` :
        props.mode === "create" ?
        gql`
            mutation ($data: ${props.entity}Input!) {
                Create${props.entity}(data: $data) {
                    ${entityID}
                }      
            }
        ` :
        props.mode === "delete" ?
        gql`
            mutation ($data: ${slimDelete ? "Delete" : props.entity}Input!) {
                Delete${props.entity}(data: $data) {
                    ${entityID}
                }
            }
        ` :
        '';

    //Slim deletes send only what the server reads; other fields would fail DeleteInput validation.
    const variables = slimDelete ?
        {data: {pbotID: props.params.pbotID, cascade: props.params.cascade ?? false}} :
        {data: props.params};

    const [mutateNode, { data, loading, error }] = useMutation(gQL, {variables: variables});

    //Apollo client mutations are a little weird. Rather than executing automatically on render, 
    //the hook returns a function we have to manually execute, in this case addDescription.
    //The idea is that this would be attached to a submit event, I guess, but that's not 
    //how this current architecture works. Instead, I'm using the useEffect hook with the empty 
    //array option that causes it to only execute once.
    useEffect(() => {
            mutateNode().catch((err) => {
                //Just eat it. The UI will get what it needs below through the error field defined on the hook.
                console.log("catch");
                console.log(err);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else if (error) {
        console.log("ERROR!");
        console.log(error);
        return <p>Error: {error.message}</p>;
    } else if (data) {
        console.log(data);
        
        //Force reload of cache
        client.resetStore();

        //If handleClose is present, caller was a dialog. Just close it and return
        if (props.handleClose) {
            props.handleClose();
            return null;
        }

        const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"};
        return props.mode === "edit" ?
        (
            <div key={data[`Update${props.entity}`][`${entityID}`]} style={style}>
                {data[`Update${props.entity}`][`${entityID}`]} updated<br />
                <br />
            </div>
        ) :
        props.mode === "create" ?
        (
            <div key={data[`Create${props.entity}`][`${entityID}`]} style={style}>
                {data[`Create${props.entity}`][`${entityID}`]} created<br />
                <br />
            </div>
        ) :
        props.mode === "delete" ?
        (
            <div key={data[`Delete${props.entity}`][`${entityID}`]} style={style}>
                {data[`Delete${props.entity}`][`${entityID}`]} deleted<br />
                <br />
            </div>
        ) :
        '';
                
    } else {
        return (<div></div>); //gotta return something until addDescription runs
    }

}

export default Mutator;
