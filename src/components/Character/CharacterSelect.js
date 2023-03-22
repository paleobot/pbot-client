import React from 'react';
import { sort } from '../../util.js';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import { MenuItem } from '@mui/material';
import {
    useQuery,
    gql
  } from "@apollo/client";
  
const CharacterMenuItems = (props) => {
    const characters = sort([...props.characters], "order", "name");

    const indent = props.level * 2;
    const fontWeight = props.level === 0 ? "bold" : "normal";
    const style = {marginLeft: indent + "em", fontWeight: fontWeight};

    return (
        <>
        {characters.map((character) => (
            <>
            <MenuItem 
                style={style}
                key={character.pbotID} 
                value={character.pbotID}
                dname={character.name}
                ddefinition={character.definition}
                dorder={character.order}
                dparentcharacter={"Character" === character.characterOf.__typename ? character.characterOf.pbotID: ''}
                onClick={(event)=> {alert('name = ' + character.name)}}
            >{character.name}</MenuItem>
            <CharacterMenuItems characters={character.characters} level={props.level+1} />
            </>
        ))}
        </>
    )
}

const sortAndFlatten = (characters, level) => {
    const chars = sort([...characters], "order", "name");
    
    const indent = level * 2;
    const fontWeight = level === 0 ? "bold" : "normal";
    const style = {marginLeft: indent + "em", fontWeight: fontWeight};

    let flatList = []; 
    chars.forEach((character) => {
        
        
        const {characters, ...lightCharacter} = character; // remove characters
        flatList.push({
            ...lightCharacter,
            style: style,
        });
        
        if (character.characters && character.characters.length > 0) {
            flatList = flatList.concat(sortAndFlatten(character.characters, level+1));
        }
        return flatList;
        
        
    })
    return flatList
}

export const CharacterSelect = (props) => {
    const gQL = gql`
    fragment CharacterFields on Character {
        pbotID
        name
        definition
        order
        characterOf {
            ... on Character {
                pbotID
                __typename
            }
            ... on Schema {
                pbotID
                __typename
            }
        }
    }

    fragment CharactersRecurse on Character {
        characters {
            ...CharacterFields
            characters {
                ...CharacterFields
                characters {
                    ...CharacterFields
                    characters {
                        ...CharacterFields
                        characters {
                            ...CharacterFields
                            characters {
                                ...CharacterFields
                            }
                        }
                    }
                }
            }
        }
    }

    query ($schemaID: ID) {
        Schema (pbotID: $schemaID) {
            characters {
                ...CharacterFields
                ...CharactersRecurse
            }
        }
    }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {schemaID: props.values.schema}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                    
    console.log(">>>>>>>>>>>>Results<<<<<<<<<<<<<");
    console.log(data.Schema[0].characters);

    const characters = sortAndFlatten(data.Schema[0].characters, 0);

    const label = props.parent ? "Parent character" : "Character";
    //const name =  props.parent ? "parentCharacter" : "character";
    const name =  props.name ? 
        props.name :
        props.parent ? 
            "parentCharacter" : 
            "character";
    let level = 0;
    const style = {minWidth: "12ch"}
    return data.Schema[0].characters && data.Schema[0].characters.length === 0 ? null : (
        <>
        {props.source === "state" &&
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
                        props.values.parentState = '';
                    }
                    props.handleChange(event);
                }}
            >             
            {characters.map((character) => {
                    return (
                        <MenuItem 
                            style={character.style} 
                            key={character.pbotID} 
                            value={character.pbotID}
                        >{character.name}</MenuItem>
                    )
            })}
            </Field>
        }

        {props.source === "character" &&
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
                        props.values.order = child.props.dorder || '';
                        props.values.definition = child.props.ddefinition || '';
                    }
                    props.values.parentCharacter = child.props.dparentcharacter || '';
                    props.handleChange(event);
                }}
            >
            {characters.map((character) => {
                    return (
                        <MenuItem 
                            style={character.style}
                            key={character.pbotID} 
                            value={character.pbotID}
                            dname={character.name}
                            ddefinition={character.definition}
                            dorder={character.order}
                            dparentcharacter={"Character" === character.characterOf.__typename ? character.characterOf.pbotID: ''}
                        >{character.name}</MenuItem>
                    )
            })}
            </Field>
        }

        {props.source === "characterInstance" &&
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
            >
            {characters.map((character) => {
                return (
                    <MenuItem 
                        style={character.style}
                        key={character.pbotID} 
                        value={character.pbotID}
                    >{character.name}</MenuItem>
                )       
             })}
             </Field>
        }

        <br />
        </>
    );

}
