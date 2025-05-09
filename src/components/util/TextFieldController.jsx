import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";


export const TextFieldController = ({name, label, control, errors, ...props}) => {
    console.log("TextFieldController");

    //This, with the use of eval, provides a clever, if inelegant, way to handle the error and helperText props below for arbitrarily nested fields
    const pathElements = name.split(".");
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
    console.log(errorsPathString)
    //console.log(JSON.stringify(JSON.parse(errors)))
    console.log(JSON.parse(JSON.stringify(errors)))
    console.log(eval(`!!${errorsPathString}`))
    console.log(eval(`${errorsPathString}?.message`))

    return (
        <Controller
            control={control}
            render={({ field }) => <TextField 
                {...field} 
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
            name={name}
            //style={{minWidth: "12ch", width:"100%"}}
            disabled={false}
        />
    );
}
