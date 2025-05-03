import { Checkbox } from "@mui/material"
import { Controller } from "react-hook-form"

export const CheckboxController = ({name, control, errors, ...props}) => {
    //Note 1: We could add path elements here to allow for nested checkboxes, but we don't need it right now. If we do, we can use the same logic as in TextFieldController, or better yet, we could factor it out into a common controller function.

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
            error={!!errors[name]} 
            helperText={errors[name]?.message}    
            name={name}
        />   
    )

}             