import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";


export const AutocompleteController = ({name, label, control, errors, ...props}) => {
    const pathElements = name.split(".");

    //This, with the use of eval, provides a clever, if inelegant, way to handle the error and helperText props below for arbitrarily nested fields
    const errorsPathString = pathElements.reduce((acc, curr, idx) => {
        if (idx === 0) {
            return `${acc}${curr}`;
        } else {
            if (isNaN(curr)) {
                return `${acc}?.${curr}`;
            } else {
                return `${acc}?.[${curr}]`;
            }
        }    
    },'errors.')

    return (
        <Controller
            control={control}
            render={({ field }) =>  <Autocomplete
                {...field} 
                freeSolo
                options={["UA Library", "test"]}
                getOptionLabel={(option) => option}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => <TextField 
                    {...params} 
                    {...props}
                    sx={[
                        {minWidth: "12ch"},
                        // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
                        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
                    ]}
                    label={label}
                    error={eval(`!!${errorsPathString}`)} 
                    helperText={eval(`${errorsPathString}?.message`)}
                />}
            />}
            name={name}
            //style={{minWidth: "12ch", width:"100%"}}
            disabled={false}
        />
            
     );
}
