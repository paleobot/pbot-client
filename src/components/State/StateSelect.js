import React from 'react';
import { sort } from '../../util.js';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import { MenuItem, Typography } from '@mui/material';
import {
    useQuery,
    gql
  } from "@apollo/client";

const sortAndFlatten = (states, level) => {
    const lstates = sort([...states], "order", "name");
    
    const indent = level * 2;
    const fontWeight = level === 0 ? "bold" : "normal";
    const style = {marginLeft: indent + "em", fontWeight: fontWeight};

    let flatList = []; 
    lstates.forEach((state) => {
        
        
        const {states, ...lightState} = state; // remove characters
        flatList.push({
            ...lightState,
            style: style,
        });
        
        if (state.states && state.states.length > 0) {
            flatList = flatList.concat(sortAndFlatten(state.states, level+1));
        }
        return flatList;
        
        
    })
    return flatList
}

export const StateSelect = (props) => {
    const gQL = gql`
            fragment StateFields on State {
                pbotID
                name
                definition
                order
                stateOf {
                    ... on State {
                        pbotID
                        __typename
                    }
                    ... on Character {
                        pbotID
                        __typename
                    }
                }
            }

            fragment StatesRecurse on State {
                states {
                    ...StateFields
                    states {
                        ...StateFields
                        states {
                            ...StateFields
                            states {
                                ...StateFields
                                states {
                                    ...StateFields
                                    states {
                                        ...StateFields
                                    }
                                }
                            }
                        }
                    }
                }
            }

    query ($characterID: ID) {
        Character (pbotID: $characterID) {
            states {
                ...StateFields
                ...StatesRecurse
            }
        }
    }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {characterID: props.values.character}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                    
    console.log(">>>>>>>>>>>>Results<<<<<<<<<<<<<");
    console.log(data.Character[0].states);

    const states = sortAndFlatten(data.Character[0].states, 0);

    const label = props.parent ? "Parent state" : "State";
    //const name =  props.parent ? "parentState" : "state";
    console.log("choosing state select name")
    console.log(props.name);
    const name =  props.name ?
        props.name :
        props.parent ? 
            "parentState" : 
            "state";
    console.log(name);

    let level = 0;
    const style = {minWidth: "12ch"}

    /*
    if (props.source === "characterInstance" && (!states || states.length === 0)) {
        return <Typography variant="body1" color="error">This character has no states.</Typography>
    */
    if (!states || states.length === 0) {
        if (props.source === "characterInstance") {
            return <Typography variant="body1" color="error">This character has no states.</Typography>
        } else {
            return null;
        }
    }

    return /*data.Character[0].states && data.Character[0].states.length === 0 ? null :*/ (
        <>
        {(states && props.source === "state") &&
        <Field
            style={style}
            component={TextField}
            type="text"
            name={name}
            label={label}
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                if (!props.parent) {
                    props.values.name = child.props.dname || '';
                    props.values.definition = child.props.ddefinition || '';
                    props.values.order = child.props.dorder || '';
                    props.values.parentState = child.props.dparentstate || '';
                }
                //props.values.parentState = child.props.dparentstate || '';
                props.handleChange(event);
            }}
        >

            {states.map((state) => (
                <MenuItem 
                    style={state.style}
                    key={state.pbotID} 
                    value={state.pbotID}
                    dname={state.name}
                    ddefinition={state.definition}
                    dorder={state.order}
                    dparentstate={"State" === state.stateOf.__typename ? state.stateOf.pbotID: ''}
               >{state.name}</MenuItem>

            ))}

        </Field>
        }

        {props.source === "characterInstance" &&        
        <Field
            component={TextField}
            type="text"
            name={name}
            label="State"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {states.map(({ pbotID, name, style }) => (
                <MenuItem 
                    style={style}
                    key={pbotID} 
                    value={name + "," + pbotID}
                >{name}</MenuItem>
            ))}
        </Field>
        }

        <br />
        </>
    );

}


