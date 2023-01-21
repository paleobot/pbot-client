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
    return list.sort((a,b) => {
        //"z" forces null/blank names to end of list
        const field1A = a[sortField1] ? a[sortField1].toString().toUpperCase() : "z"; 
        const field1B = b[sortField1] ? b[sortField1].toString().toUpperCase() : "z"; 

        const field2A = a[sortField2] ? a[sortField2].toString().toUpperCase() : "z"; 
        const field2B = b[sortField2] ? b[sortField2].toString().toUpperCase() : "z"; 

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
