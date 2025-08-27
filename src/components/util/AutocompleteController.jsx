import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";


export const AutocompleteController = ({name, label, control, errors, ...props}) => {

    return (
        <Controller
            control={control}
            render={({ field, fieldState }) =>  <Autocomplete
                {...field} 
                freeSolo
                options={["UA Library"]}
                getOptionLabel={(option) => option}
                onChange={(_, value) => field.onChange(value)}
                onInputChange={(_, value) => {
                    if (value) field.onChange(value);
                }}
                renderInput={(params) => <TextField 
                    {...params} 
                    {...props}
                    sx={[
                        {minWidth: "12ch"},
                        // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
                        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
                    ]}
                    label={label}
                    error={fieldState.invalid} 
                    helperText={fieldState.error?.message}
                />}
            />}
            name={name}
            //style={{minWidth: "12ch", width:"100%"}}
            disabled={false}
        />
            
     );
}
