import React, { useState }from 'react';
import { Field, FieldArray } from 'formik';
import { Button, Grid, InputLabel, Radio, Tooltip, Typography } from '@mui/material';
import { TextField } from 'formik-mui';
import {ReferenceSelect} from '../Reference/ReferenceSelect.js';
import ClearIcon from '@mui/icons-material/Clear';

export const ReferenceManager = (props) => {
    //console.log("ReferenceManager")

    const maxOrder = props.values.references.reduce((acc, ref) => parseInt(ref.order) > acc ? parseInt(ref.order) : acc, 0)
    //console.log("maxOrder = " + maxOrder)

    //Flag at most one reference as the one the OTU was published in. Clicking the
    //currently-flagged row clears it (toggle-off); clicking another row moves the flag.
    const orderShown = !props.omitOrder && !props.single;
    //Fixed column widths for the order/published-in/delete columns. The title
    //column is the only flexible one (it shrinks), so the rows stay on a single
    //line and the columns line up across the header and every row at any width.
    const ORDER_W = "75px", PUB_W = "90px", DEL_W = "50px";
    const togglePublishedIn = (form, references, index) => {
        const next = references.map((ref, i) => ({
            ...ref,
            publishedInReference: i === index ? !ref.publishedInReference : false,
        }));
        form.setFieldValue("references", next);
    };

    const style = {marginTop: "1.5em"}
    return (
    <div style={style}>
        <InputLabel>
            {props.single ? "Reference" : "References"}
        </InputLabel>
        <FieldArray name="references">
            {({ insert, remove, push, form }) => (
            <div>
            {/*<Grid container direction="column">*/}
                {(props.displayPublishedIn && props.values.references.length > 0) &&
                    <Grid container item spacing={2} direction="row" alignItems="center" wrap="nowrap">
                        <Grid item xs={8} />
                        {orderShown && <Grid item sx={{width: ORDER_W, flexShrink: 0}} />}
                        <Grid item sx={{width: PUB_W, flexShrink: 0, textAlign: "center"}}>
                            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.0 }}>Authority source</Typography>
                        </Grid>
                        <Grid item sx={{width: DEL_W, flexShrink: 0}} />
                    </Grid>
                }
                {props.values.references.length > 0 &&
                    props.values.references.map((reference, index) => {
                        return (
                            <Grid container item spacing={2} direction="row" key={index}
                                alignItems="center"
                                wrap="nowrap"
                            >
                                <Grid item xs={8} sx={{minWidth: 0}}>
                                    <ReferenceSelect name={`references.${index}.pbotID`} exclude={props.values.references.filter(ref => ref.pbotID !== reference.pbotID)} maxOrder={maxOrder} fullWidth />
                                </Grid>

                                {orderShown &&
                                <Grid item sx={{width: ORDER_W, flexShrink: 0}}>
                                    <Field
                                        component={TextField}
                                        name={`references.${index}.order`}
                                        label="Order"
                                        type="text"
                                        sx={{width:"75px"}}
                                    />
                                </Grid>
                                }

                                {props.displayPublishedIn &&
                                <Grid item sx={{ width: PUB_W, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Tooltip title="Click here if this is the publication that named the taxon. Click again to clear.">
                                        <span>
                                            <Radio
                                                color="secondary"
                                                checked={reference.publishedInReference === true}
                                                disabled={reference.pbotID === ''}
                                                onClick={() => togglePublishedIn(form, props.values.references, index)}
                                            />
                                        </span>
                                    </Tooltip>
                                </Grid>
                                }

                                {!props.single &&
                                <Grid item sx={{width: DEL_W, flexShrink: 0, display: "flex", justifyContent: "flex-start"}}>
                                    {(index > 0 || props.optional) &&
                                    <Button
                                        type="button"
                                        variant="text"
                                        color="secondary"
                                        size="large"
                                        onClick={() => remove(index)}
                                        sx={{width:"50px"}}
                                    >
                                        <ClearIcon/>
                                    </Button>
                                    }
                                </Grid>
                                }
                            </Grid>
                        )
                    })}
                {/*</Grid>*/}
                {!props.single &&
                <Button
                    type="button"
                    variant="text" 
                    color="secondary" 
                    onClick={() => push(props.displayPublishedIn ? { pbotID: '', order: '', publishedInReference: false } : { pbotID: '', order: ''/*(maxOrder + 1).toString()*/  })}
                    disabled={props.values.references.length !== 0 && props.values.references[props.values.references.length-1].pbotID === ''}
                >
                    Add reference
                </Button>
                }
            </div>
            )}
        </FieldArray>
    </div>
    );
};

