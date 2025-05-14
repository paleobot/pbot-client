import { Button, InputLabel, Stack, Typography } from "@mui/material"
import { TextFieldController } from "../util/TextFieldController";
import { useState } from "react";
import { MultiManager } from "../MultiManager";
import { useWatch } from "react-hook-form";


export const ExistingCollectionManager = ({supersedes, mode, control, reset, watch, errors, ...props}) => {

    //const [id, setId] = useState('')
    //const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async (permID) => {
        console.log("fetchData");
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(new URL(`api/v1/metadata/${permID}`, process.env.REACT_APP_AZLIB_API_URL));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let json = await response.json();
            console.log(JSON.parse(JSON.stringify(json)));
            
            console.log("massaged data:");
            console.log(json.data.metadata);

            const initValues = {
                metadata: {...json.data.metadata},
                originalMetadata: {...json.data.metadata},
                //oldCollections: control._formValues.oldCollections,
                supersedes: control._formValues.supersedes.concat(json.data.metadata.identifiers.supersedes ?
                    json.data.metadata.identifiers.supersedes.map((oldID) => { return {permID: oldID} }) :
                    [])
            }

            reset(initValues, {keepDefaultValues: true});
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    }

    const FetchStatus = () => {
        if (loading) {
            return <Typography variant="body1">Loading...</Typography>;
        }

        if (error) {
            return <Typography color="error" variant="caption">Error accessing API: {error.message}</Typography>;
        }
    }

    const replaceShape = {
        permID: '',
    };
    const ReplaceFields = ({index, control, errors}) => {
        //TODO: The old form used separate variables: oldCollections here and supersedes in edit. I'm not sure why. I'm going to use supersedes for both. I'm ghosting the oldCollections stuff everywhere for now. Eventually, I should remove it.
        return (
            <Stack direction="row" spacing={0} sx={{ marginLeft:"1.5em"}}>
                {/*<TextFieldController name={`oldCollections.${index}.permID`} label="Old collection" control={control} errors={errors} sx={{width:"90%"}}/>
                
                <Button variant="outlined" color="secondary" size="small" onClick={() => {fetchData(control._formValues.oldCollections[index].permID)}}>Load</Button>

                */}
                <TextFieldController name={`supersedes.${index}.permID`} label="Old collection" control={control} errors={errors} sx={{width:"90%"}}/>
    
                <Button variant="outlined" color="secondary" size="small" disabled={!watch(`supersedes.${index}.permID`)} onClick={() => {fetchData(control._formValues.supersedes[index].permID)}}>Load</Button>
             </Stack>
        )
    }   

    const editSupersedesShape = {
        permID: '',
    };
    const EditSupersedesFields = ({index, control, errors}) => {
        return (
            <Stack direction="row" spacing={0} sx={{ marginLeft:"1.5em"}}>
                <TextFieldController name={`supersedes.${index}.permID`} label="Old collection" control={control} errors={errors} sx={{width:"90%"}}/>
             </Stack>
        )
    }   

    if ("delete" === mode) {
        return (
            <TextFieldController  name={`metadata.identifiers.perm_id`} label="Remove existing collection" control={control} errors={errors}/>
        )
    } else if ("edit" === mode) {
        if (supersedes) {
            return (
                <>
                <MultiManager label="Supersedes" name="supersedes" content={EditSupersedesFields} shape={editSupersedesShape} control={control} watch={watch("supersedes")} errors={errors} optional/>
                </>
            )
        } else {
            console.log("other");
            return (
                <>
                <Stack direction="row" spacing={2} sx={{marginTop: "1.5em"}}>
                    <TextFieldController  name={`metadata.identifiers.perm_id`} label="Edit existing collection" control={control} errors={errors}/>
                    <Button variant="outlined" color="secondary" size="small" disabled={!watch("metadata.identifiers.perm_id")} onClick={() => {fetchData(control._formValues.metadata.identifiers.perm_id)}}>Load</Button>
                    <Button variant="outlined" color="secondary" size="small" onClick={() => {reset()}}>Clear</Button>
                </Stack>
                <FetchStatus/>
                </>
            )
        }
    } else if ("replace" === mode) {
        //I tried to use UseWatch here, but it was causing issues with the number of hooks. I think this is because the watch is inside a conditional. So, instead, I get around this by passing in watch as a prop from the calling component.
        return (
            <>
            {/*<MultiManager label="Replace existing collections" name="oldCollections" content={ReplaceFields} shape={replaceShape} control={control} watch={/*useWatch({control, name:"oldCollections"})#/watch("oldCollections")} errors={errors} optional/>*/}

            <MultiManager label="Replace existing collections" name="supersedes" content={ReplaceFields} shape={replaceShape} control={control} watch={/*useWatch({control, name:"supersedes"})*/watch("supersedes")} errors={errors} />

            </>
        )
    }
}
