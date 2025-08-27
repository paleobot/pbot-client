import { Button, Grid } from '@mui/material';
import { FieldArray } from 'formik';
import React from 'react';
import { CharacterSelect } from '../Character/CharacterSelect';
import { SchemaSelect } from '../Schema/SchemaSelect';
import { StateSelect } from '../State/StateSelect';
import ClearIcon from '@mui/icons-material/Clear';
import { AlternatingTableRow } from '../../util';

const CharacterInstanceQueryManager = (props) => {

    return (
        <>
        <FieldArray name="characterInstances">
            {({ insert, remove, push }) => (
                <>
                {props.values.characterInstances.map((cI, i) => {
                    //const bC = i % 2 ? "#ffffff" : theme.palette.action.hover
                    return (
                        <Grid container item spacing={2} direction="row" key={i} sx={{mt:"20px"}}>
                            <Grid item xs={8}>
                                <SchemaSelect index={i}/>
                                <br />

                                {props.values.characterInstances[i].schema !== '' &&
                                    <>
                                        <CharacterSelect values={props.values} source="characterInstance" index={i}/>
                                        <br />
                                    </>
                                }
                            
                                {props.values.characterInstances[i].character !== "" &&
                                    <>
                                        <StateSelect values={props.values} source="characterInstance" multi={true} index={i}/>
                                        <br />
                                    </>
                                }
                            </Grid>
                            <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-start" }}>
                                    <Button
                                        type="button"
                                        variant="text" 
                                        color="secondary" 
                                        size="large"
                                        onClick={() => remove(i)}
                                        sx={{width:"50px"}}
                                    >
                                        <ClearIcon/>
                                    </Button>
                            </Grid>
                        </Grid>
                    )
                })}

                <Button
                    sx={{mt:"40px"}}
                    type="button"
                    variant="text" 
                    color="secondary" 
                    onClick={() => push({ schema: '', character: '', states: []  })}
                    disabled={props.values.characterInstances.length !== 0 && props.values.characterInstances[props.values.characterInstances.length-1].schema === ''}
                >
                    Add character instance
                </Button>

                </>
            )}


        </FieldArray>
        
        {/*
        {props.values.characterInstances.map((cI, i) => {
            return (
                <>
                <SchemaSelect index={i}/>
                <br />

                {props.values.characterInstances[0].schema !== '' &&
                    <>
                        <CharacterSelect values={props.values} source="characterInstance" index={i}/>
                        <br />
                    </>
                }
                
                {props.values.characterInstances[0].character !== "" &&
                    <>
                        <StateSelect values={props.values} source="characterInstance" multi={true} index={i}/>
                        <br />
                    </>
                }
                </>
            )
        })}

        <Button
            type="button"
            variant="text" 
            color="secondary" 
            onClick={() => props.values.characterIntances.push({ schema: '', character: '', states: []  })}
            disabled={props.values.characterInstances.length !== 0 && props.values.characterInstances[props.values.characterInstances.length-1].schema === ''}
        >
            Add character instance
        </Button>
        */}


        </>
    );
};

export default CharacterInstanceQueryManager;
