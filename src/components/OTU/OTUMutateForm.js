﻿import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, MenuItem, Stack, Typography } from '@mui/material';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import React from 'react';
import * as Yup from 'yup';
import { alphabetize } from '../../util.js';
import { GroupSelect } from '../Group/GroupSelect.js';
import { ReferenceManager } from '../Reference/ReferenceManager.js';
import { SpecimenManager } from '../Specimen/SpecimenManager.js';

import {
    gql, useQuery
} from "@apollo/client";
import { SensibleTextField } from '../SensibleTextField.js';
import { PartsPreservedSelect } from '../Organ/PartsPreservedSelect.js';
import { NotableFeaturesSelect } from '../Specimen/NotableFeaturesSelect.js';
import { MajorTaxonGroupSelect, QualityIndexSelect } from './OTUHelper.js';
import { OTUSelect } from './OTUSelect.js';

/*
const OTUSelect = (props) => {
    console.log("OTUSelect");
    console.log(props);
    console.log(props.values);
    const gQL = gql`
            query {
                OTU {
                    pbotID
                    name
                    authority
                    diagnosis
                    qualityIndex
                    majorTaxonGroup
                    pbdbParentTaxon
                    family
                    genus
                    species
                    additionalClades
                    notes
                    identifiedSpecimens {
                      Specimen {
                        name
                        pbotID
                      }
                    }
                  	typeSpecimens {
                      Specimen {
                        name
                        pbotID
                      }
                    }
                    holotypeSpecimen {
                        Specimen {
                            name
                            pbotID
                        }
                    }
                    partsPreserved {
                        pbotID
                    }
                    notableFeatures {
                        pbotID
                    }
                    references (orderBy: order_asc) {
                        Reference {
                            pbotID
                        }
                        order
                    }
                    elementOf {
                        name
                        pbotID
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data);
    let otus = [...data.OTU];
        
    console.log(otus);
    otus = alphabetize(otus, "name");
    console.log(otus);
    
    const style = {minWidth: "12ch"}
    return (
        <Field 
            style={style}
            component={TextField}
            type="text"
            name="otu"
            label="OTU"
            fullWidth
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => {
                console.log("onChange");
                console.log(child.props);
                console.log(child.props.didentifiedspecimens);
                props.values.name = child.props.dname;
                props.values.authority = child.props.dauthority || '';
                props.values.diagnosis = child.props.ddiagnosis || '';
                props.values.qualityIndex = child.props.dqualityindex || '';
                props.values.majorTaxonGroup = child.props.dmajortaxongroup || '';
                props.values.pbdbParentTaxon = child.props.dpbdbparenttaxon || '';
                props.values.family = child.props.dfamily || '';
                props.values.genus = child.props.dgenus || '';
                props.values.species = child.props.dspecies || '';
                props.values.additionalClades = child.props.dadditionalclades || '';
                props.values.notes = child.props.dnotes ? child.props.dnotes : '';
                props.values.partsPreserved = child.props.dpartspreserved ? JSON.parse(child.props.dpartspreserved) : [];
                props.values.notableFeatures = child.props.dnotablefeatures ? JSON.parse(child.props.dnotablefeatures) : [];
                props.values.identifiedSpecimens = child.props.didentifiedspecimens ? JSON.parse(child.props.didentifiedspecimens) : [];
                props.values.typeSpecimens = child.props.dtypespecimens ? JSON.parse(child.props.dtypespecimens) : [];
                props.values.holotypeSpecimen = child.props.dholotypespecimen;
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.values.public = "true"=== child.props.dpublic || false;
                props.values.origPublic = props.values.public;
                props.values.groups = child.props.dgroups ? JSON.parse(child.props.dgroups) : [];
                //props.resetForm();
                props.handleChange(event);
            }}
        >
            {otus.map((otu) => (
                <MenuItem 
                    key={otu.pbotID} 
                    value={otu.pbotID} 
                    dname={otu.name} 
                    dauthority={otu.authority} 
                    ddiagnosis={otu.diagnosis} 
                    dqualityindex={otu.qualityIndex} 
                    dmajortaxongroup={otu.majorTaxonGroup}
                    dpbdbparenttaxon={otu.pbdbParentTaxon}
                    dfamily={otu.family}
                    dgenus={otu.genus}
                    dspecies={otu.species}
                    dadditionalclades={otu.additionalClades}
                    dnotes={otu.notes}
                    dpartspreserved={otu.partsPreserved ? JSON.stringify(otu.partsPreserved.map(organ => organ.pbotID)) : null}
                    dnotablefeatures={otu.notableFeatures ? JSON.stringify(otu.notableFeatures.map(feature => feature.pbotID)) : null}
                    didentifiedspecimens={otu.identifiedSpecimens ? JSON.stringify(otu.identifiedSpecimens.map(specimen => {return {pbotID: specimen.Specimen.pbotID}})) : null}
                    dtypespecimens={otu.typeSpecimens ? JSON.stringify(otu.typeSpecimens.map(specimen => specimen.Specimen.pbotID)) : null}
                    dholotypespecimen={otu.holotypeSpecimen.Specimen.pbotID}
                    dreferences={otu.references ? JSON.stringify(otu.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                    dpublic={otu.elementOf && otu.elementOf.reduce((acc,group) => {return acc || "public" === group.name}, false).toString()}
                    dgroups={otu.elementOf ? JSON.stringify(otu.elementOf.map(group => group.pbotID)) : null}
                >{otu.name}</MenuItem>
            ))}
        </Field>
    )
        
}
*/

const SpecimenSelect = (props) => {
    console.log("SpecimenSelect");
    console.log(props.type)
    console.log(props.type === "type" ? props.values.identifiedSpecimens : props.values.typeSpecimens)

    /*
    //TODO: Now that I'm filtering in the query, this isn't needed. Keeping it here for now in case I change my mind.
    const specimenGQL = gql`
        query {
            Specimen {
                pbotID
                name
            }            
        }
    `;
    */
    let specimenGQL;
    if ("holotype" === props.type) {
        specimenGQL = gql`
            query {
                Specimen (filter: {pbotID_in: ${JSON.stringify(props.values.typeSpecimens)}}) {
                    pbotID
                    name
                }            
            }
        `;
    } else if ("type" === props.type) {
        specimenGQL = gql`
            query {
                Specimen (filter: {pbotID_in: ${JSON.stringify(props.values.identifiedSpecimens.map(s => s.pbotID))}}) {
                    pbotID
                    name
                }            
            }
        `;
    } 
    console.log(specimenGQL)

    const { loading: specimenLoading, error: specimenError, data: specimenData } = useQuery(specimenGQL, {fetchPolicy: "cache-and-network"});

    if (specimenLoading) return <p>Loading...</p>;
    if (specimenError) return <p>Error :(</p>;
                                 
    console.log(specimenData.Specimen);
    let specimens = alphabetize([...specimenData.Specimen], "name");

    if (props.type === "holotype") {
        //TODO: Now that I'm filtering in the query, this isn't needed. Keeping it here for now in case I change my mind.
        //Only want to offer example of specimens as holotype.
        //specimens = specimens.reduce((acc,specimen) => (props.values.exampleSpecimens.includes(specimen.pbotID) ? acc.concat(specimen) : acc),[]);
        //console.log(specimens);
        return (
            <Field
                component={TextField}
                type="text"
                name="holotypeSpecimen"
                label="Holotype specimen"
                style={{minWidth:"200px"}}
                select={true}
                SelectProps={{
                    multiple: false,
                }}
                sx={{minWidth:"200px"}}
                disabled={false}
                //onChange={(event,child) => {
                //    console.log("holotype onChange")
                //    props.handleChange(event);
                //}}
            >
                <MenuItem key="0" value="">&nbsp;</MenuItem>
                {specimens.map(({ pbotID, name }) => (
                    <MenuItem key={pbotID} value={pbotID} dname={name}>{name}</MenuItem>
                ))}
            </Field>
        )
    } else if (props.type === "type") {
        return (
            <Field
                component={TextField}
                type="text"
                name="typeSpecimens"
                label="Type specimens"
                sx={{minWidth:"200px"}}
                select={true}
                SelectProps={{
                    multiple: true,
                }}
                disabled={false}
                /*
                onChange={(event,child) => {
                    console.log("type onChange")
                    console.log(child.props.value)
                    console.log(props.values.holotypeSpecimen)
                    if (child.props.value === props.values.holotypeSpecimen) props.values.holotypeSpecimen = ''; //clear holotype if it is the specimen getting touched here
                    props.handleChange(event);
                }}
                */
            >
                {specimens.map(({ pbotID, name }) => (
                    <MenuItem key={pbotID} value={pbotID} dname={name}>{name}</MenuItem>
                ))}
            </Field>
        )
    } 
}


const OTUMutateForm = ({handleSubmit, mode}) => {

    const initValues = {
                otu: '',
                identifiedSpecimens: [],
                typeSpecimens: [],
                holotypeSpecimen: '',
                majorTaxonGroup: '',
                pbdbParentTaxon: '',
                family: '', 
                genus: '', 
                pfnGenusLink: '',
                species: '',
                pfnSpeciesLink: '',
                additionalClades: '',
                name: '',
                authority: '',
                diagnosis: '',
                qualityIndex: '',
                partsPreserved: [],
                notableFeatures: [],
                notes: '',
                references: [{
                    pbotID: '',
                    order:'',
                }],
                public: true,
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
    },[mode]);

    
    const SpecimenObserver = () => {
        const formik = useFormikContext();
      
        React.useEffect(() => {
            formik.setFieldValue(
                "typeSpecimens", 
                formik.values.typeSpecimens.filter(s => formik.values.identifiedSpecimens.map(s => s.pbotID).includes(s))
                //[]
            ); 
        }, [formik.values.identifiedSpecimens])

        React.useEffect(() => {
            formik.setFieldValue(
                "holotypeSpecimen", 
                formik.values.typeSpecimens.includes(formik.values.holotypeSpecimen) ?
                    formik.values.holotypeSpecimen :
                    ''
                //''
            ); 
        }, [formik.values.typeSpecimens])

        return null;
      };    
    
       
    const [selectedTab, setSelectedTab] = React.useState('1');
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const style = {textAlign: "left", width: "60%", margin: "auto"}
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                majorTaxonGroup: Yup.string().max(30, 'Must be 30 characters or less'),
                pbdbParentTaxon: Yup.string().test(
                    'isPBDBTaxon', 
                    ({message}) => `${message}`,
                    async (value, context) => {
                        if (!value) return true;
                        let url = `https://paleobiodb.org/data1.2/taxa/single.json?name=${value}&vocab=pbdb`;
                        console.log(url)
                        try {
                            const response = await fetch(url);
                            if (response.ok) {
                                return true;
                            } else if (response.status === 404) {
                                   return context.createError({message: `Taxon not found in PBDB.`})
                            } else {
                                const body = await response.json();
                                return context.createError({message: `Error from PBDB: ${body.errors[0]}`})
                            }
                        } catch (error) {
                            console.error("PBDB fetch error", error);
                            return context.createError({message: "Network error, unable to access PBDB"})
                        }
                }).required(),
                family: Yup.string().max(30, 'Must be 30 characters or less'),
                genus: Yup.string().max(30, 'Must be 30 characters or less'),
                pfnGenusLink: Yup.string().url(),
                species: Yup.string().max(30, 'Must be 30 characters or less'),
                pfnSpeciesLink: Yup.string().url(),
                additionalClades: Yup.string(),
                name: Yup.string().nullable().required(),
                authority: Yup.string().required(),
                diagnosis: Yup.string().required(),
                qualityIndex: Yup.string().required("Quality index is required"),
                partsPreserved: Yup.array().of(Yup.string()).min(1, "At least one part is required"),
                notableFeatures: Yup.array().of(Yup.string()),
                notes: Yup.string(),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
                public: Yup.boolean(),
                groups: Yup.array().of(Yup.string()).when('public', {
                    is: false,
                    then: Yup.array().of(Yup.string()).min(1, "Must specify at least one group")
                }),
                //holotypeSpecimen: Yup.string().required("Holotype specimen required"),
                typeSpecimens: Yup.array().min(1, "At least one type specimen required"),
                identifiedSpecimens: Yup.array().min(1, "At least one identified specimen required"),
            })}
            onSubmit={(values, {resetForm}) => {
                //alert(JSON.stringify(values, null, 2));
                //setValues(values);
                values.mode = mode;
                //values.family = null;
                //values.genus = null;
                //values.species = null;
                //values.specimen = null;
                handleSubmit(values);
                //setShowOTUs(true);
                resetForm({values:initValues});
            }}
        >
            {props => {

            return (
            <Form>
                <SpecimenObserver />
                {(mode === "edit" || mode === "delete") &&
                    <div>
                        {/*<OTUSelect values={props.values} handleChange={props.handleChange}/>*/}
                        <OTUSelect name="otu" label="Taxa (OTU)" populateMode="full"/>
                        <br />
                    </div>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.otu !== '')) &&
                <div>
                
                <Accordion style={accstyle} defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="required-content"
                        id="required-header"                        
                    >
                        Required fields
                    </AccordionSummary>
                    <AccordionDetails>

                        <Field 
                            component={SensibleTextField}
                            name="name" 
                            type="text" 
                            label="Name"
                            disabled={false}
                        />
                        <br />
               
                        <Field 
                            component={SensibleTextField}
                            name="authority" 
                            type="text" 
                            label="Authority"
                            disabled={false}
                        />
                        <br />
               
                        <PartsPreservedSelect label="Parts described" />
                        <br />

                        <Field 
                            component={SensibleTextField}
                            name="diagnosis" 
                            type="text" 
                            label="Diagnosis"
                            multiline={true}
                            disabled={false}
                        />
                        <br />

                        <QualityIndexSelect required/>
                        <br />
               
                        <MajorTaxonGroupSelect required/>
                        <br />
               
                        <Field 
                            component={SensibleTextField}
                            name="pbdbParentTaxon" 
                            type="text" 
                            label="PBDB parent taxon"
                            disabled={false}
                        />
                        {props.errors.pbdbParentTaxon &&
                        <div>
                            <Typography variant="caption">
                                (Available taxa can be found at <a target="_blank" href="https://paleobiodb.org/classic/checkTaxonInfo">https://paleobiodb.org/classic/checkTaxonInfo)</a>
                            </Typography>
                        </div>
                        }
                        <br />

                        <ReferenceManager values={props.values}/>
                
                        <SpecimenManager name="identifiedSpecimens" groupLabel="Identified specimens" individualLabel="identified specimen" values={props.values} />

                        <SpecimenSelect type="type" values={props.values} handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                        <br />
                        <br />
                        
                        {/*
                        <SpecimenSelect type="holotype" values={props.values} handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                        <br />
                        */}

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
                            <GroupSelect  omitPublic={true} />
                            <br />
                        </div>
                        }
                    </AccordionDetails>
                </Accordion>
                
                <Accordion style={accstyle}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="optional-content"
                        id="optional-header"                        
                    >
                        Optional fields
                    </AccordionSummary>
                    <AccordionDetails>
                        <SpecimenSelect type="holotype" values={props.values} handleChange={props.handleChange} setFieldValue={props.setFieldValue}/>
                        <br />

                        <Field 
                            component={SensibleTextField}
                            name="family" 
                            type="text" 
                            label="Family"
                            disabled={false}
                        />
                        <br />
                        
                        <Field
                            component={SensibleTextField}                
                            name="genus" 
                            type="text" 
                            label="Genus"
                            disabled={false}
                        />
                        <Field 
                            component={SensibleTextField}                
                            name="pfnGenusLink" 
                            type="text" 
                            label="Plant Fossil Names genus link"
                            disabled={false}
                            sx={{marginLeft:"2em"}}
                        />
                        <div>
                            <Typography sx={{marginLeft:"3em"}} variant="caption">
                                (Available names can be found at <a target="_blank" href="https://www.plantfossilnames.org/">https://www.plantfossilnames.org/)</a>
                            </Typography>
                        </div>
                        <br />
                        
                        <Field 
                            component={SensibleTextField}
                            name="species" 
                            type="text" 
                            label="Specific epithet"
                            disabled={false}
                        />
                        <Field 
                            component={SensibleTextField}                
                            name="pfnSpeciesLink" 
                            type="text" 
                            label="Plant Fossil Names species link"
                            disabled={false}
                            sx={{marginLeft:"2em"}}
                        />
                        <div>
                            <Typography sx={{marginLeft:"3em"}} variant="caption">
                                (Available names can be found at <a target="_blank" href="https://www.plantfossilnames.org/">https://www.plantfossilnames.org/)</a>
                            </Typography>
                        </div>
                        <br />

                        <Field 
                            component={SensibleTextField}
                            name="additionalClades" 
                            type="text" 
                            label="Additional clades"
                            disabled={false}
                        />
                        <br />

                        <NotableFeaturesSelect label="Notable features described" />
                        <br />
                
                        <Field
                            component={SensibleTextField}
                            type="text"
                            name="notes"
                            label="Notes"
                            multiline={true}
                            fullWidth 
                            disabled={false}
                        >
                        </Field>
                        <br />

                    </AccordionDetails>
                </Accordion>
                
                </div>
                }
                
                <Field 
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />

                {(mode === "delete") &&
                <div>
                    <Field
                        component={CheckboxWithLabel}
                        name="cascade"
                        type="checkbox" 
                        Label={{ label: 'Cascade' }}
                    />
                  <br />
                </div>
                }
                
                <br />
                <br />

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                    <Button type="reset" variant="outlined" color="secondary">Reset</Button>
                </Stack>
                <br />
                <br />
            </Form>
            )}}
        </Formik>
    
    );
};

export default OTUMutateForm;
