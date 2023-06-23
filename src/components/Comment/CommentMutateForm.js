import React, { useState }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, AppBar, Tabs, Tab, FormControlLabel, Radio, Grid, InputLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TextField, CheckboxWithLabel, RadioGroup, Select } from 'formik-mui';
import { alphabetize } from '../../util.js';
import {ReferenceManager} from '../Reference/ReferenceManager.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  useQuery,
  gql
} from "@apollo/client";

const CommentSelect = (props) => {
    console.log("CommentSelect");
    console.log(props);
    
    const gQL = gql`
        query ($synonymID: String!) {
            GetAllComments (synonymID: $synonymID)  {
                pbotID
                content
                subject {
                    ...on Synonym {
                        pbotID
                        __typename
                    }
                    ...on Comment {
                        pbotID
                        __typename
                    }
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

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network", variables: {synonymID: props.values.synonym}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                      
    console.log(">>>>>>>>>>>>Results<<<<<<<<<<<<<");
    console.log(data.GetAllComments);
    const comments = alphabetize([...data.GetAllComments], "content");
    console.log(comments);
    
    const label = props.parent ? "Parent comment" : "Comment";
    const name =  props.parent ? "parentComment" : "comment";
    
    const style = {minWidth: "12ch"}
    return comments.length === 0 ? null : (
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
            disabled={"edit"===props.mode}
            onChange={(event,child) => {
                //props.resetForm();
                if (!props.parent) {
                    props.values.content = child.props.dcontent || '';
                }
                props.values.parentComment = child.props.dparent || '';
                props.values.references = child.props.dreferences ? JSON.parse(child.props.dreferences) : [];
                props.handleChange(event);
            }}
        >
            {comments.map((comment) => (
                <MenuItem 
                    key={comment.pbotID} 
                    value={comment.pbotID}
                    dcontent={comment.content}
                    dparent={"Comment" === comment.subject.__typename ? comment.subject.pbotID: ''}
                    dreferences={comment.references ? JSON.stringify(comment.references.map(reference => {return {pbotID: reference.Reference.pbotID, order: reference.order || ''}})) : null}
                >{comment.content}</MenuItem>
            ))}
        </Field>
    )
}

const SynonymSelect = (props) => {
    console.log("SynonymSelect");
    console.log(props);
    console.log(props.values);
    const gQL = gql`
            query {
                Synonym {
                    pbotID
                    otus {
                        name
                    }
                }            
            }
        `;
        
    //TODO: set global schema somehow, for use in getting Characters

    const { loading: loading, error: error, data: data } = useQuery(gQL, {fetchPolicy: "cache-and-network"});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
                                 
    console.log(data);
    let synonyms = [...data.Synonym];
        
    console.log(synonyms);
    synonyms = synonyms.map(synonym => {
        return {
            ...synonym,
            name: synonym.otus.reduce((acc,otu) => acc ? acc + "/" + otu.name : otu.name, null)
        }
    });
    synonyms = alphabetize(synonyms, "name");
    console.log(synonyms);
    
    const style = {minWidth: "12ch"}
    return (
        <Field 
            style={style}
            component={TextField}
            type="text"
            name="synonym"
            label="Synonym"
            fullWidth
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
            onChange={(event,child) => { //TODO: necessary?
                console.log("onChange");
                console.log(child.props);
                //props.resetForm();
                props.handleChange(event);
            }}
        >
            {synonyms.map((synonym) => (
                <MenuItem 
                    key={synonym.pbotID} 
                    value={synonym.pbotID} 
                >{synonym.name/*synonym.otus.reduce((acc,otu) => acc ? acc + "/" + otu.name : otu.name, null)*/}</MenuItem>
            ))}
        </Field>
    )
        
}

const CommentMutateForm = ({handleSubmit, mode}) => {
    const initValues = {
                comment: '',
                content: '',
                synonym: '',
                parentComment: '',
                references: [],
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
    const accstyle = {textAlign: "left", width: "70%"}
    return (
       
        <Formik
            innerRef={formikRef}
            initialValues={initValues}
            validationSchema={Yup.object({
                content: Yup.string().required(),
                synonym: Yup.string().required(),
                references: Yup.array().of(
                    Yup.object().shape({
                        pbotID: Yup.string()
                            .required('Reference title is required'),
                        order: Yup.string()
                            .required('Reference order is required')
                            .typeError('Reference order is required')
                    })
                ),
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
                    name="mode" 
                    type="hidden" 
                    disabled={false}
                />
                
                <SynonymSelect values={props.values} handleChange={props.handleChange}/>
                <br />
                
                {(mode === "edit" || mode === "delete") && props.values.synonym !== '' &&
                    <>
                    <CommentSelect values={props.values} handleChange={props.handleChange}/>
                    <br />
                    </>
                }
                
                {((mode === "create" && props.values.synonym) || (mode === "edit" && props.values.parentComment)) &&
                    <>
                    <CommentSelect values={props.values} parent mode={mode} handleChange={props.handleChange}/>
                    <br />
                    </>
                }
                
                {(mode === "create" || (mode === "edit" && props.values.comment !== '')) &&
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
                                component={TextField}
                                type="text"
                                name="content"
                                label="Comment"
                                fullWidth 
                                disabled={false}
                            />
                            <br />
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
                        <AccordionDetails >
                            <ReferenceManager values={props.values} optional={true}/>
                            <br />
                        </AccordionDetails>
                    </Accordion>
          
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

export default CommentMutateForm;
