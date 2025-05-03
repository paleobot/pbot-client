import { Button, TextField } from "@mui/material";
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
        <>

        <Controller
            name={name}
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
