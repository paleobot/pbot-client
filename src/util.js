import React from 'react';
import { Link, styled, TableRow } from "@mui/material";

export const alphabetize = (list, sortField) => {
    return list.sort((a,b) => {
        const nameA = a[sortField] ? a[sortField].toUpperCase() : "z"; //"z" forces null names to end of list
        const nameB = b[sortField] ? b[sortField].toUpperCase() : "z"; 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

export const sort = (list, sortField1, sortField2) => {
    //console.log("sort")
    //console.log(list);

    return list.sort((a,b) => {
        //"z"/1000 forces null/blank/NaN to end of list
        //const field1A = a[sortField1] ? a[sortField1].toString().toUpperCase() : "z"; 
        //const field1B = b[sortField1] ? b[sortField1].toString().toUpperCase() : "z"; 
        let field1A, field1B;
        if (sortField1.startsWith("#")) {
            field1A = a[sortField1.substring(1)] ? Number.parseFloat(a[sortField1.substring(1)]) : 1000; 
            field1B = b[sortField1.substring(1)] ? Number.parseFloat(b[sortField1.substring(1)]) : 1000; 
        } else {
            field1A = a[sortField1] ? a[sortField1].toString().toUpperCase() : "z";
            field1B = b[sortField1] ? b[sortField1].toString().toUpperCase() : "z";
        }

        let field2A = "z", field2B = "z";
        if (sortField2) {
            if (sortField2.startsWith("#")) {
                field2A = a[sortField2.substring(1)] ? Number.parseFloat(a[sortField2.substring(1)]) : 1000; 
                field2B = b[sortField2.substring(1)] ? Number.parseFloat(b[sortField2.substring(1)]) : 1000; 
            } else {
                field2A = a[sortField2].toString().toUpperCase();
                field2B = b[sortField2].toString().toUpperCase();
            }
        }

        if (field1A < field1B) {
            return -1;
        } else if (field1A > field1B) {
            return 1;
        } else if (field2A < field2B) {
            return -1;
        } else if (field2A > field2B) {
            return 1;
        } else {
            return 0;
        }
    });
}

export const AlternatingTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


export const useFetchIntervals = (minInt, maxInt, includeOverlappingIntervals, setLoading, setError) => {
    console.log("useFetchIntervalsEffect")
    const [intervals, setIntervals] = React.useState(null);
    React.useEffect(() => {
        if (!includeOverlappingIntervals) return;
        setLoading(true);
        const minAge = JSON.parse(minInt).minAge; 
        const maxAge = JSON.parse(maxInt).maxAge; 

        fetch(`https://macrostrat.org/api/v2/defs/intervals?t_age=${minAge}&b_age=${maxAge}`)
        .then(res => res.json())
        .then(
            (response) => {
                setLoading(false);
                if (response.status_code) {
                    throw new Error ("Error fetching intervals. Try unchecking the \"Include overlapping intervals\" box.");
                }
                console.log(response.success.data)
                const ints = response.success.data.map(int => { 
                    return int.name
                })
                console.log(ints)
                setIntervals(ints);
            }
        ).catch (
            (error) => {
                console.log("error!")
                console.log(error)
                setError(error)
            }
        )
    }, [])
    return intervals

}

export const DirectQueryLink = (props) => {
    console.log("DirectQueryLink")
    console.log(props.children)
    let url
    if (!Array.isArray(props.pbotID)) {
        url = new URL(`${window.location.origin}/query/${props.type}/${props.pbotID}`);
    } else {
        url = new URL(`${window.location.origin}/query/${props.type}/${props.pbotID.reduce((acc, s) => {
            return '' === acc ?
                s.pbotID :
                acc + "," + s.pbotID
        }, '')}`);
    }
    console.log(props.params)
    //props.params.forEach(p => console.log(p))
    if (props.params) props.params.forEach(p => {
        console.log(p)
        const kv = p.split('=')
        console.log(kv)
        url.searchParams.append(kv[0], kv[1] || "true");
    })
    return (
        <Link style={props.style} color="success.main" underline="hover" href={url}  target="_blank">
            {props.children && props.children.length > 0 &&
                <>
                {props.children}
                </>
            } 
            {(!props.children || props.children.length === 0) &&
                <>
                {props.text || url.toString()}
                </>
            }
        </Link>
    )
}