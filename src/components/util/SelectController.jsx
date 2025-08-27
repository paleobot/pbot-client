import { MenuItem, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { useAuth } from "../AuthContext";


export const SelectController = ({name, label, options, control, errors, ...props}) => {
    //Note 1: We could add path elements here to allow for nested checkboxes, but we don't need it right now. If we do, we can use the same logic as in TextFieldController, or better yet, we could factor it out into a common controller function.

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const {token} = useAuth()

  
    React.useEffect(() => {
        const fetchData = async () => {
            //If options is an array, we don't need to fetch anything. Just set the data.
            if (Array.isArray(options)) {
                setData(options);
                setLoading(false);
                return;
            }

            //Otherwise, we need to fetch the data. 
            setLoading(true);
            try {
                console.log(`Fetching data from ${process.env.REACT_APP_AZLIB_API_URL}`);
                const response = await fetch(
                    new URL(options.path, process.env.REACT_APP_AZLIB_API_URL),
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let json = await response.json();
                json = json.data.map((item) => {
                    return {
                        name: item[options.nameField],
                        value: item[options.valueField]
                    }
                })
                setData(json);
                console.log(json)
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        }

        fetchData();
    }, []);
  
    if (loading) {
        return <Typography variant="body1">Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error" variant="caption">Error accessing API: {error.message}</Typography>;
    }

    const {includeEmptyOption, ...otherProps} = props;
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => 
                <TextField
                    {...field}
                    {...otherProps}
                    select
                    sx={[
                        {minWidth: "12ch"},
                        // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
                        ...(Array.isArray(otherProps.sx) ? otherProps.sx : [otherProps.sx]),
                    ]}
                    label={label}
                    error={fieldState.invalid} 
                    helperText={fieldState.error?.message}
                >
                    {includeEmptyOption && 
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                    }
                    {data.map((option, index) => (
                        <MenuItem value={option.value}>{option.name}</MenuItem>
                    ))}
                </TextField>
            }
        />
    )
}
