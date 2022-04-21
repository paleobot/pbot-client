import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { alphabetize } from '../../util.js';
import {
  useQuery,
  gql
} from "@apollo/client";

const AuthorSelect = (props) => {
    console.log("AuthorSelect");
    console.log(props);
    console.log(props.name);
    const gQL = gql`
            query {
                Person (filter: {AND: [{given_not: "guest"}, {surname_not: "guest"}]}) {
                    pbotID
                    given
                    surname
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.Person);
    
    const authors = alphabetize(
        data.Person.map(person => {
            const newPerson = {...person};
            console.log(newPerson);

            newPerson.name = person.given + " " + person.surname;
            return newPerson;
        }), 
    "surname");
    console.log(authors)
    
    return (
        <Field
            component={TextField}
            type="text"
            name={props.name}
            label="Name"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {authors.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
}

export const AuthorManager = (props) => {
    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            Authors
        </InputLabel>
        <FieldArray name="authors">
            {({ insert, remove, push }) => (
            <div>
            <Grid container direction="column">
                {props.values.authors.length > 0 &&
                    props.values.authors.map((author, index) => { 
                        //props.values.authors[index].order = index+1; 
                        return (
                            <Grid container spacing={2} direction="row" key={index}>
                                <Grid item xs={6}>
                                    <AuthorSelect name={`authors.${index}.pbotID`}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Field
                                        component={TextField}
                                        name={`authors.${index}.order`}
                                        label="Order"
                                        type="text"
                                        //disabled={props.values.authors[index].name === ''}
                                    />
                                </Grid>
                                {index > 0 &&
                                <Grid item xs={3}>
                                    <Button
                                        type="button"
                                        variant="text" 
                                        color="secondary" 
                                        size="large"
                                        onClick={() => remove(index)}
                                        //disabled={props.values.authors[index].name === ''}
                                    >
                                        X
                                    </Button>
                                </Grid>
                                }
                            </Grid>
                        )
                    })}
                </Grid>
                <Button
                    type="button"
                    variant="text" 
                    color="secondary" 
                    onClick={() => push({ pbotID: '', order: '' })}
                    disabled={props.values.authors.length !== 0 && props.values.authors[props.values.authors.length-1].pbotID === ''}
                >
                    Add author
                </Button>
            </div>
            )}
        </FieldArray>
    </div>
    );
};

