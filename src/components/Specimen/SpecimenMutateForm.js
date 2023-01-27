import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select, SimpleFileUpload } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {GroupSelect} from '../Group/GroupSelect.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import {ImageManager} from '../Image/ImageManager.js';
import {CollectionSelect} from '../Collection/CollectionSelect.js';
import {OrganSelect} from '../Organ/OrganSelect.js';

import {
  useQuery,
  gql
} from "@apollo/client";

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    //TODO: look into https://www.graphql-scalars.dev/docs/scalars/uuid for managing idigbiouuid
    const gQL = gql`
            query {
                Specimen {
                    pbotID
                    name
                    preservationMode {
                        pbotID
                    }
                    idigbiouuid
                    pbdbcid
                    pbdboccid
                    organs {
                        pbotID
                    }
                    describedBy {
                      	Description {
                        	pbotID
                      	}
                    }
                    elementOf {
                        name
                        pbotID
                    }
                    collection {
                        pbotID
                    }
                    references {
                        Reference {
                            pbotID
                        }
                        order
                    }
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Specimen results<<<<<<<<<<<<<");
    console.log(data.Specimen);
    const specimens = alphabetize([...data.Specimen], "name");
    console.log(specimens);
    
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="specimen"
            label="Specimen"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                //props.resetForm();
                props.values.name = child.props.dname;
                props.values.organs = child.props.dorgans ? JSON.parse(child.props.dorgans) : [];
                 props.values.preservationMode = child.props.dpreservationmode ? child.props.dpreservationmode : '';
                props.values.describedBy = child.props.ddescribedby ? JSON.parse(child.props.ddescribedby) : [];
                props.values.idigbiouuid = child.props.didigbiouuid ? child.props.didigbiouuid : '';
                props.values.pbdbcid = child.props.dpbdbcid ? child.props.dpbdbcid : '';
                props.values.pbdboccid = child.props.dpbdboccid ? child.props.dpbdboccid : '';
                props.values.public =  "true"===child.props.dpublic;;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.values.collection = child.props.dcollection ? child.props.dcollection : '';
                props.handleChange(event);
            }}
        >
            {specimens.map((specimen) => (
                <MenuItem 
                    key={specimen.pbotID} 
                    value={specimen.pbotID}
                    dname={specimen.name}
                    dorgans={specimen.organs ? JSON.stringify(specimen.organs.map(organ => organ.pbotID)) : null}
                    dpreservationmode={specimen.preservationMode ? specimen.preservationMode.pbotID : null}
                    ddescribedby={specimen.describedBy ? JSON.stringify(specimen.describedBy.map(d => d.Description.pbotID)) : ''}
                    didigbiouuid={specimen.idigbiouuid}
                    dpbdbcid={specimen.pbdbcid}
                    dpbdboccid={specimen.pbdboccid}
                    dpublic={specimen.elementOf && specimen.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={specimen.elementOf ? JSON.stringify(specimen.elementOf.map(group => group.pbotID)) : null}
                    dreferences={specimen.references ? JSON.stringify(specimen.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                    dcollection={specimen.collection ? specimen.collection.pbotID : ''}
                >{specimen.name}</MenuItem>
            ))}
        </Field>
    )
}

const PreservationModeSelect = (props) => {
    console.log("PreservationModeSelect");
    console.log(props);
    const gQL = gql`
            query {
                PreservationMode {
                    name
                    pbotID
                }            
            }
        `;

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data.preservationModes);
    const preservationModes = alphabetize([...data.PreservationMode], "name");
    
    return (
        <Field
            component={TextField}
            type="text"
            name="preservationMode"
            label="Preservation mode"
            fullWidth 
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {preservationModes.map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )
        
}

const DescriptionSelect = (props) => {
    console.log("DescriptionSelect");
    console.log(props);
    console.log(props.type);
    const descriptionGQL = gql`
            query {
                Description {
                    pbotID
                    name
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: descriptionLoading, error: descriptionError, data: descriptionData } = useQuery(descriptionGQL, {fetchPolicy: "cache-and-network"});

    if (descriptionLoading) return <p>Loading...</p>;
    if (descriptionError) return <p>Error :(</p>;
                                 
    console.log(descriptionData);
    let descriptions = [...descriptionData.Description];
    
    return (
        <Field 
            component={TextField}
            type="text"
            name="describedBy"
            label="Described by"
            fullWidth
            select={true}
            SelectProps={{
                multiple: true,
            }}
            disabled={false}
            defaultValue=""
        >
            {alphabetize(descriptions, "name").map(({ pbotID, name }) => (
                <MenuItem key={pbotID} value={pbotID}>{name}</MenuItem>
            ))}
        </Field>
    )        
}

const SpecimenMutateForm = ({handleSubmit, mode}) => {
    //const [values, setValues] = useState({});
    const initValues = {
                specimen: '',
                name: '',
                organs: [],
                preservationMode: '',
                describedBy: [],
                idigbiouuid: '',
                pbdbcid: '',
                pbdboccid: '',
                references: [{
                    pbotID: '',
                    order:'',
                }],
                public: true,
                collection: '',
                groups: [],
                cascade: false,
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
    
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                organs: Yup.array().of(Yup.string()).min(1, "At least one organ required"),
                preservationMode: Yup.string().required(),
                idigbiouuid: Yup.string().uuid('Must be a valid uuid'),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                collection: Yup.string().required(),
                images: Yup.array().of(
                    Yup.object().shape({
                        image: Yup.mixed().required('Image file is required'),
                        order: Yup.string()
                            .required('Image order is required')
                            .typeError('Image order is required')
                    })
                ),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                })
           })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values: initValues});
            }}
        >
            {props => (
            <Form>
                <Field 
                    component={TextField}
                    name="mode" 
                    sx={{display:"none"}}
                    disabled={false}
                />
                
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        <SpecimenSelect values={props.values} handleChange={props.handleChange}/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.specimen !== '')) &&
                    <div>
                    
                    <Field
                        component={TextField}
                        type="text"
                        name="name"
                        label="Name"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />
                    
                    <ReferenceManager values={props.values}/>

                    <OrganSelect />
                    <br />

                    <PreservationModeSelect />
                    <br />

                   <DescriptionSelect/>
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="idigbiouuid"
                        label="iDigBio UUID"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="pbdbcid"
                        label="PBDB cid"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />

                    <Field
                        component={TextField}
                        type="text"
                        name="pbdboccid"
                        label="PBDB occid"
                        fullWidth 
                        disabled={false}
                    >
                    </Field>
                    <br />
                    
                    <CollectionSelect />
                    <br />

                    <Field 
                        component={CheckboxWithLabel}
                        name="public" 
                        type="checkbox"
                        Label={{label:"Public"}}
                        disabled={(mode === "edit" && props.values.origPublic)}
                    />
                    <br />
                    
                    {!props.values.public &&
                    <div>
                        <GroupSelect />
                        <br />
                    </div>
                    }
                                    
                    </div>
                }
                
                {(mode === "delete") &&
                <div>
                    <Field
                        type="checkbox"
                        component={CheckboxWithLabel}
                        name="cascade"
                        Label={{ label: 'Cascade' }}
                    />
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

export default SpecimenMutateForm;
