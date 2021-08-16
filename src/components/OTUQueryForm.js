import React, { useState }from 'react';
//import { useFormik } from 'formik';
//import { Formik } from 'formik';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab } from '@material-ui/core';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

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

function CharacterInstances(props) {
    if (!props.characterInstances) return ''; //TODO: is this the best place to handle this?
    console.log(props.characterInstances);
    const style = {marginLeft:"2em"}
    return props.characterInstances.map(({characterInstanceID, character, state}) => (
        <div key={characterInstanceID}  style={style}>
            {character.name}: {state.value !== null ? `${state.value}` : `${state.State.name}`}<br />
        </div>
    ));
}

function OTUs(props) {
    console.log(props);
    console.log(props.filters.genus);
    const specs = Object.keys(props.filters).reduce((acc, key) => {
        console.log(key + ", " + props.filters[key]);
        if (props.filters[key]) acc += `, ${key}: "${props.filters[key]}"`;
        return acc;
    }, 'type: "OTU"');
    console.log(specs);
    /*
    let otuGQL = gql`
        query {
            Description(${specs}) {
                descriptionID
                name
                family
                genus
                species
            }            
        }
    `;
    */
    let otuGQL;
    if (!props.includeComplex) {
        otuGQL = gql`
            query {
                Description(${specs}) {
                    descriptionID
                    name
                    family
                    genus
                    species
                }            
            }
        `;
    } else {
        otuGQL = gql`
            query {
                Description (${specs}) {
                    descriptionID
                    type
                    name
                    family
                    genus
                    species
                    characterInstances {
                        characterInstanceID
                        character {
                            name
                        }
                        state {
                            State {
                                name
                            }
                            value
                        }
                    }
                }
            }
        `;
    }
    
    const { loading, error, data } = useQuery(otuGQL);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
           
    /*
    return data.Description.map(({ descriptionID, name, family, genus, species }) => (
        <div key={descriptionID}>
        <p>
            {descriptionID}: {name}, {family}, {genus}, {species}
        </p>
        </div>
    ));
    */
    /*
    return data.Description.map(({ descriptionID, name, family, genus, species, characterInstances }) => (
        <div key={descriptionID}>
        <p>
            {descriptionID}: {name}, {family}, {genus}, {species} <br />
            <CharacterInstances characterInstances={characterInstances} />
        </p>
        </div>
    ));
    */
    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    return data.Description.map(({ descriptionID, name, family, genus, species, characterInstances }) => (
        <div key={descriptionID} style={style}>
            {descriptionID}: {name}, {family}, {genus}, {species} <br />
            <CharacterInstances characterInstances={characterInstances} />
            <br />
        </div>
    ));

}

/*
const OTUQueryForm = () => {
    const [showOTUs, setShowOTUs] = useState(false);
   
    const validate = values => {
        const errors = {};
        setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
        return errors;
    }
       
    const formik = useFormik({
        initialValues: {
            family: '',
            genus: '',
            species: '',
        },
        validate,
        onSubmit: values => {
            //alert(JSON.stringify(values, null, 2));
            setShowOTUs(true);
        },
    });
    
    let otus = showOTUs ? (
                    <OTUs family= {formik.values.family} genus={formik.values.genus} species={formik.values.species}/>
                ) : 
                '';

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="family">Family</label>
            <input
                id="family"
                name="family"
                type="text"
                {...formik.getFieldProps('family')}
            />
            <br />
            <br />
            
            <label htmlFor="genus">Genus</label>
            <input
                id="genus"
                name="genus"
                type="text"
                {...formik.getFieldProps('genus')}
            />
            <br />
            <br />

            <label htmlFor="species">Species</label>
            <input
                id="species"
                name="species"
                type="text"
                {...formik.getFieldProps('species')}
            />
            <br />
            <br />
            <br />

            <Button type="submit" variant="contained" color="primary">Submit</Button>
            <br />
            <br />
            
            <ApolloProvider client={client}>
            <div>
            {otus}
            </div>
            </ApolloProvider>
            
        </form>
    );
};
*/

/*
const OTUQueryForm = () => {
    const [showOTUs, setShowOTUs] = useState(false);
    const [values, setValues] = useState({});
   
    let otus = showOTUs ? (
                    <OTUs descriptionID={values.descriptionID} family={values.family} genus={values.genus} species={values.species}/>
                ) : 
                '';

    return (
        
        <Formik
            initialValues={{descriptionID: '', family: '', genus: '', species: ''}}
            validate={values => {
                const errors = {};
                setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                return errors;
            }}
            validationSchema={Yup.object({
                descriptionID: Yup.string()
                .uuid('Must be a valid uuid'),
                family: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                genus: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                species: Yup.string()
                .max(30, 'Must be 30 characters or less'),
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                setValues(values);
                setShowOTUs(true);
            }}
        >
            <Form>
                <label style={{marginRight: 10}} htmlFor="descriptionID">Description ID</label>
                <Field name="descriptionID" type="text" />
                <ErrorMessage className="error" name="descriptionID" />
                <br />
                <br />

                <label htmlFor="family">Family</label>
                <Field name="family" type="text" />
                <ErrorMessage name="family" />
                <br />
                <br />

                <label htmlFor="genus">Genus</label>
                <Field name="genus" type="text" />
                <ErrorMessage name="genus" />
                <br />
                <br />

                <label htmlFor="species">Species</label>
                <Field name="species" type="text" />
                <ErrorMessage name="species" />
                <br />
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
                
                <ApolloProvider client={client}>
                <div>
                {otus}
                </div>
                </ApolloProvider>
            </Form>

        </Formik>
    );
};
*/

const OTUQueryForm = () => {
    const [showOTUs, setShowOTUs] = useState(false);
    const [values, setValues] = useState({});
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newTab) => {
        setSelectedTab(newTab);
    };
   
    /*
    let otus = showOTUs ? (
                    <OTUs descriptionID={values.descriptionID} family={values.family} genus={values.genus} species={values.species} includeComplex={values.includeComplex} />
                ) : 
                '';
    */
    let otus = showOTUs ? (
                    <OTUs 
                        filters={{
                            descriptionID: values.descriptionID,
                            family: values.family, 
                            genus: values.genus, 
                            species: values.species, 
                        }}
                        includeComplex={values.includeComplex} 
                    />
                ) : 
                '';

    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
    <div style={style}>
    <AppBar position="static">
        <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Query"  />
            <Tab label="Results"  />
        </Tabs>
    </AppBar>
    <div hidden={selectedTab === 1}>
       
        <Formik
            initialValues={{
                descriptionID: '', 
                family: '', 
                genus: '', 
                species: '',
                includeComplex: false}}
            validate={values => {
                const errors = {};
                setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                return errors;
            }}
            validationSchema={Yup.object({
                descriptionID: Yup.string()
                .uuid('Must be a valid uuid'),
                family: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                genus: Yup.string()
                .max(30, 'Must be 30 characters or less'),
                species: Yup.string()
                .max(30, 'Must be 30 characters or less'),
            })}
            onSubmit={values => {
                //alert(JSON.stringify(values, null, 2));
                setValues(values);
                setShowOTUs(true);
                setSelectedTab(1);
            }}
        >
            <Form>
                <Field 
                    component={TextField}
                    name="descriptionID" 
                    type="text"
                    label="Description ID"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}
                    name="family" 
                    type="text" 
                    label="Family"
                    disabled={false}
                />
                <br />
                
                <Field 
                    component={TextField}                
                    name="genus" 
                    type="text" 
                    label="Genus"
                    disabled={false}
                />
                <br />
                <Field 
                    component={TextField}
                    name="species" 
                    type="text" 
                    label="Species"
                    disabled={false}
                />
                <br />
                <Field 
                    component={CheckboxWithLabel}
                    name="includeComplex" 
                    type="checkbox" 
                    Label={{ label: 'Include complex' }}
                    disabled={false}
                />
                <br />
                <br />
                <br />

                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <br />
                <br />
            </Form>
        </Formik>
    </div>
    
     <div hidden={selectedTab === 0}>
                <ApolloProvider client={client}>
                <div>
                {otus}
                </div>
                </ApolloProvider>
    </div>
    </div>
    );
};

export default OTUQueryForm;
