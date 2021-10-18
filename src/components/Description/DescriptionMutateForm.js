import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-material-ui';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});


/*
function SpecimenMenuItems() {
    console.log("SpecimenMenuItems");
    const specimenGQL = gql`
            query {
                Specimen {
                    specimenID
                    name
                }            
            }
        `;

    const { loading, error, data } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    return data.Specimen.map(({ specimenID, name }) => (
        <MenuItem key={specimenID} value="{specimenID}">{name}</MenuItem>
    ));
}
*/
//This is the cleanest version, though I really don't understand how the forwardRef thing works.
//The MenuItem's still aren't selectable. I think it needs a complete rewrite to return
//the entire Field. Also, should use conditional rendering rather than disabled in presenting 
//OTU vs Specimen form.
const SpecimenMenuItems = React.forwardRef((props, ref) => {
    console.log("SpecimenMenuItems");
    const specimenGQL = gql`
            query {
                Specimen {
                    specimenID
                    name
                }            
            }
        `;

    const { loading, error, data } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    return data.Specimen.map(({ specimenID, name }) => (
        <MenuItem ref={ref} key={specimenID} value="{specimenID}">{name}</MenuItem>
    ));
});
/*
class SpecimenMenuItems extends React.Component {
    constructor() {
        console.log("SpecimenMenuItems - constructor");
        super();
        this.state = {items: []};
    }
    
    componentDidMount() {
        console.log("SpecimenMenuItems - componentDidMount");
        const specimenGQL = gql`
                query {
                    Specimen {
                        specimenID
                        name
                    }            
                }
            `;
            
        client.query({
            query: specimenGQL,
            variables: {}
        }).then(result => {
            console.log("then");
            console.log(result);
            const items = result.data.Specimen.map(({ specimenID, name }) => (
                    <MenuItem key={specimenID} value="{specimenID}">{name}</MenuItem>
                ));
            console.log("items:");
            this.setState({items: items});
            console.log(this.state.items);
        });
    }
    
    render() {
        console.log("SpecimenMenuItems - render");
        return (
            <div>
            {this.state.items}
            </div>
        );
    }
}
*/

const DescriptionMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult}) => {
    //const [values, setValues] = useState({});
    
    const ref = React.createRef();

    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            initialValues={{
                type: '',
                specimen: '',
                family: '', 
                genus: '', 
                species: '',
            }}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                type: Yup.string().required(),
                specimen: Yup.string().when("type", {
                    is: (val) => val === "Specimen",
                    then: Yup.string().required()
                }),
                family: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                genus: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
                species: Yup.string().when("type", {
                    is: (val) => val === "OTU",
                    then: Yup.string().required().max(30, 'Must be 30 characters or less')
                }),
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
            }}
        >
            {props => (
            <Form>
                <Field
                    component={TextField}
                    type="text"
                    name="type"
                    label="Type"
                    fullWidth 
                    disabled={false}
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                >
                    <MenuItem value="OTU">OTU</MenuItem>
                    <MenuItem value="specimen">Specimen</MenuItem>
                </Field>
                <br />

                <Field
                    component={TextField}
                    type="text"
                    name="specimen"
                    label="Specimen"
                    fullWidth 
                    select={true}
                    SelectProps={{
                        multiple: false,
                    }}
                    disabled={props.values.type === "OTU"}
                >
                    <ApolloProvider client={client}>
                        <SpecimenMenuItems ref={ref}/>
                    </ApolloProvider>
                </Field>
                <br />
                
                <Field 
                    component={TextField}
                    name="family" 
                    type="text" 
                    label="Family"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="genus" 
                    type="text" 
                    label="Genus"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
                <Field 
                    component={TextField}
                    name="species" 
                    type="text" 
                    label="Species"
                    disabled={props.values.type !== "OTU"}
                />
                <br />
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
            )}
        </Formik>
    
    );
};

export default DescriptionMutateForm;
