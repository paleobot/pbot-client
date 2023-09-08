import { Field } from 'formik';
import { TextField } from 'formik-mui';
import React from 'react';
import { MenuItem } from '@mui/material';
import { confidenceQualitative, majorTaxonGroups } from '../../Lists.js';

export const MajorTaxonGroupSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="majorTaxonGroup"
            label="Major taxon group"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {!props.required &&
                <MenuItem 
                key='' 
                value=''
            ><i>None</i></MenuItem>
            }
            {majorTaxonGroups.map((t) => (
                <MenuItem 
                    key={t} 
                    value={t}
                >{t}</MenuItem>
            ))}
        </Field>
    )
}

export const QualityIndexSelect = (props) => {
    const style = {minWidth: "12ch"}
    return (
        <Field
            style={style}
            component={TextField}
            type="text"
            name="qualityIndex"
            label="Quality index"
            select={true}
            SelectProps={{
                multiple: false,
            }}
            disabled={false}
        >
            {!props.required &&
                <MenuItem 
                key='' 
                value=''
            ><i>None</i></MenuItem>
            }
            {confidenceQualitative.map((cQ) => (
                <MenuItem 
                    key={cQ} 
                    value={cQ}
                >{cQ}</MenuItem>
            ))}
        </Field>
    )
}