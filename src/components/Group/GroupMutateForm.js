import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Autocomplete } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const GroupSelect = (props) => {
    console.log("GroupSelect");
    //TODO: preservationMode, idigbiouuid, pbdbcid, pbdboccid
    
    const me = localStorage.getItem('PBOTMe');

    const gQL = gql`
        query {
            Group (filter: {name_not: "public"}) {
                pbotID
                name
                members {
                    given
                    surname
                    pbotID
                }
            }            
        }
    `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Group results<<<<<<<<<<<<<");
    console.log(data.Group);
    const groups = alphabetize([...data.Group], "name");
    console.log(groups);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="group"
            label="Group"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.name = child.props.dname || '';
                props.values.members = child.props.dmembers ? JSON.parse(child.props.dmembers) : [];
                props.handleChange(event);
            }}
        >
            {groups.map((group) => (
                <MenuItem 
                    key={group.pbotID} 
                    value={group.pbotID}
                    dname={group.name}
                    dmembers={group.members ? JSON.stringify(group.members.map(member => {return {pbotID: member.pbotID, name: member.given + " " + member.surname}})) : null}
                >{group.name}</MenuItem>
            ))}
        </Field>
    )
}

const MemberSelect = (props) => {
    console.log("MemberSelect");

    const me = localStorage.getItem('PBOTMe');
    console.log(me);
    
    const gQL = gql`
            query {
                Person (
                    filter: {
                        AND: [
                            {password_regexp: ".*"},
                            {
                                AND: [{given_not: "guest"}, {surname_not: "guest"}]
                            }
                        ]
                }) {
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
    
    const members = alphabetize(
        data.Person.map(person => {
            const newPerson = {...person};
            console.log(newPerson);

            newPerson.name = person.given + " " + person.surname;
            return newPerson;
        }), 
    "surname");
    console.log(members)
    
    return (
        <Autocomplete
            multiple
            id="members"
            name="members"
            options={members}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.pbotID === value.pbotID}
            defaultValue={props.values.members}
            onChange={(e, value) => {
                console.log("value!!!!");
                console.log(value)
                const ids = value.map(member => member.pbotID);
                console.log(ids);
                props.setFieldValue("members", value)
            }}
            renderInput={params => (
                <Field component={TextField} {...params} name="members" label="Members" variant="standard" fullWidth/>
            )}
        />    
    )
}


const GroupMutateForm = ({queryParams, handleQueryParamChange, showResult, setShowResult, mode}) => {
    const initValues = {
                group: '', 
                name: '',
                members: [],
                mode: mode,
    };

    //To clear form when mode changes (this and the innerRef below). formikRef points to the Formik DOM element, 
    //allowing useEffect to call resetForm
    const formikRef = React.useRef();
    React.useEffect(() => {
        if (formikRef.current) {
            formikRef.current.resetForm({values:initValues});
        }
    });
    
    const style = {textAlign: "left", width: "60%", margin: "auto"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validate={values => {
                const errors = {};
                //setShowOTUs(false); //Really want to clear results whenever an input changes. This seems like the only place to do that.
                //handleQueryParamChange(values);
                setShowResult(false);
                return errors;
            }}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                members: Yup.array().of(Yup.object())//.min(1, "at least one member required"),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleQueryParamChange(values);
                setShowResult(true);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {(props, setFieldValue) => (
            <Form>

                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <GroupSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.group !== '')) &&
                    <div>
                    <Field
                        component={TextField}
                        type="text"
                        name="name"
                        label="Name"
                        fullWidth 
                        disabled={false}
                    />
                    <br />

                    <MemberSelect values={props.values} setFieldValue={props.setFieldValue} />
                    <br />

                    </div>
                }
                
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

export default GroupMutateForm;
