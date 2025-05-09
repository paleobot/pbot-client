import { Button, TextField } from "@mui/material";
import { Controller } from "react-hook-form";


export const FileSelectController = ({name, label, control, errors, ...props}) => {

    return (
        <>

        <Controller
            name={name}
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
            <>
                <input
                    type="file"
                    //accept="image/*"
                    onChange={(e) => onChange(e.target.files[0])}
                    style={{ display: 'none' }}
                    id={`${name}-file-upload`}
                />
                <label htmlFor={`${name}-file-upload`}>
                    <Button variant="outlined" component="span" size="small">
                        Choose File
                    </Button>
                </label>
                {value && (
                    <TextField
                        value={value.name}
                        slotProps={{
                            input: {
                              readOnly: true,
                            },
                        }}
                        variant="standard"
                        size="small"
                        style={{ marginLeft: '10px' }}
                        error={invalid} 
                        helperText={error?.message}
                    />
                )}
                {/*error && (
                <p style={{ color: 'red' }}>{error.message || 'Error'}</p>
                )*/}
            </>
            )}
        />



        {/*}
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
        */}

        </>
    );
}
