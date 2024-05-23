import { styled, TableRow } from "@mui/material";

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
