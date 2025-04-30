import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";


export const FileSelectController = ({name, label, control, errors, ...props}) => {
    const pathElements = name.split(".");

    let topName, index, fieldName;
    if (pathElements.length === 3) {
        topName = pathElements[0];
        index = pathElements[1];
        fieldName = pathElements[2];
    } else if (pathElements.length === 2) {
        topName = pathElements[0];
        fieldName = pathElements[1];          
    } 

    return (
        <Controller
            control={control}
            render={({ field }) => <TextField 
                {...field} 
                {...props}
                type="file"
                sx={[
                    {minWidth: "12ch"},
                    // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
                    ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
                ]}
                label={label}
                error={topName ?
                    index ? 
                        !!errors[topName]?.[index]?.[fieldName] :
                        !!errors[topName]?.[fieldName] :
                    !!errors[name]
                } 
                helperText={topName ?
                    index ?
                        errors[topName]?.[index]?.[fieldName]?.message :
                        errors[topName]?.[fieldName]?.message :
                    errors[name]?.message
                }
            />}
            name={name}
            //style={{minWidth: "12ch", width:"100%"}}
            disabled={false}
        />
    );
}
