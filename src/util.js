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
