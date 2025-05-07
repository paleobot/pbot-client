import { Checkbox } from "@mui/material"
import { Controller } from "react-hook-form"

export const CheckboxController = ({name, control, errors, ...props}) => {

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

    return (
        <Controller
            control={control}
            render={({ field }) => 
                <Checkbox
                    {...field} 
                    {...props}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                />
            }
            error={eval(`!!${errorsPathString}`)} 
            helperText={eval(`${errorsPathString}?.message`)}                  
            name={name}
        />   
    )

}             