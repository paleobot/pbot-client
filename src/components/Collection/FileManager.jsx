import { InputLabel, Stack, Typography } from "@mui/material";
import { FileSelectController } from "../util/FileSelectController";
import { MultiManager } from "../MultiManager";
import { CheckboxController } from "../util/CheckboxController";

const fileShape = {
    file: null
};
const FileFields = ({name, index, control, errors}) => {
    return (
        <Stack direction="column" spacing={0} sx={{ marginLeft:"1.5em"}}>
            <FileSelectController name={`${name}.${index}.file`} control={control} errors={errors} sx={{width:"75%",}}/>
        </Stack>
    )
}  

export const FileManager = ({ name, label, control, watch, errors, mode }) => {
    return (
        <>
        {(() => {
            if (
                    mode === "edit" && 
                    control._formValues.files && 
                    control._formValues.files.filter(file => file.type === name).length > 0
            ) {
                return (
                    <>
                    <InputLabel sx={{ marginTop:"1.5em", }}>
                        {label}
                    </InputLabel>
                    <InputLabel sx={{ marginTop:"1em", marginBottom:"0.5em", marginLeft:"1em"}}>
                        Existing (check to delete)
                    </InputLabel>
                    {control._formValues.files.map((file, index) => {
                        if (file.type === name) {
                            return (
                                <Stack direction="row" alignItems="center" spacing={0} sx={{ marginLeft:"2em"}}>
                                    <Typography name={`files.${index}.name`}  control={control} errors={errors} sx={{width:"50%", }} variant ="body2">
                                        {file.name}
                                    </Typography>
                                    <CheckboxController sx={{padding:"0", margin:"0"}} name={`files.${index}.delete`} control={control} errors={errors} />
                                </Stack>
                            )
                        }
                        return null;
                    })}

                    <MultiManager label="New" name={name} content={FileFields} shape={fileShape} control={control} watch={watch} errors={errors} optional sx={{marginLeft: "1em"}} />
                    <br />

                    </>

                )
            } else {
                return (
                    <>
                    <MultiManager label={label} name={name} content={FileFields} shape={fileShape} control={control} watch={watch} errors={errors} optional/>
                    <br />
                    </>
                )
            }
        })()}
        </>
    )
}
