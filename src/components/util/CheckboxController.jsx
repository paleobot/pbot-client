import { Checkbox } from "@mui/material"
import { Controller } from "react-hook-form"

export const CheckboxController = ({name, control, errors, ...props}) => {

    return (
        <Controller
            control={control}
            render={({ field, fieldState }) => 
                <Checkbox
                    {...field} 
                    {...props}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    error={fieldState.invalid} 
                    helperText={fieldState.error?.message}
                />
            }
            name={name}
        />   
    )

}             