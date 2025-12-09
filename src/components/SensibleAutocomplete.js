import React, { useState } from 'react';
import { Autocomplete as MuiAutocomplete, TextField as MuiTextField } from '@mui/material';

export function SensibleAutocomplete(props) {
  const {
    form: { setFieldValue },
    field: { name, value },
    options,
    getOptionLabel,
    isOptionEqualToValue,
    onChange,
    textFieldProps,
    ...other
  } = props;

  // Local state to track the selected value without triggering Formik updates
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (event, newValue) => {
    // Update local state immediately for UI responsiveness
    setLocalValue(newValue);
    
    // Update Formik's state
    setFieldValue(name, newValue);
    
    // Call custom onChange if provided
    if (onChange) {
      onChange(event, newValue);
    }
  };

  const handleBlur = () => {
    // Ensure Formik's value is synced on blur
    if (localValue !== value) {
      setFieldValue(name, localValue);
    }
  };

  // Find the actual option object from the value
  const getSelectedOption = () => {
    if (!value) return null;
    
    // If value is already an object, return it
    if (typeof value === 'object') return value;
    
    // If value is a string (pbotID), find the matching option
    return options.find(option => 
      isOptionEqualToValue ? isOptionEqualToValue(option, value) : option === value
    ) || null;
  };

  return (
    <MuiAutocomplete
      {...other}
      options={options}
      value={getSelectedOption()}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      onChange={handleChange}
      onBlur={handleBlur}
      renderInput={(params) => (
        <MuiTextField
          {...params}
          {...textFieldProps}
          name={name}
          onBlur={handleBlur}
        />
      )}
    />
  );
}