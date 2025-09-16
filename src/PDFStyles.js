import { StyleSheet } from "@react-pdf/renderer";

// Create styles for PDF layout
export const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: 2,
        borderColor: '#000000',
    },
    headerLeft: {
        flexDirection: 'row',
        width: '25%',
    },
    headerCenter: {
        width: '50%',
        textAlign: 'center',
    },
    headerRight: {
        width: '25%',
        textAlign: 'right',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },

    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
    },
    titleContainer: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: '2px solid #000000',
    },
    sectionContainer: {
        marginTop: 15,
        marginBottom: 15,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        border: '1px solid #CCCCCC',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        borderBottom: '1px solid #CCCCCC',
    },
    pbotHeading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingTop: 5,
        textAlign: 'center',
    },
    headerSubheading: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    titleSubheading: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'right',
    },
    subheading: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottom: '1px solid #CCCCCC',
        paddingBottom: 3,
    },
    subSubheading: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'left',
    },
    fieldRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    fieldLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        width: '20%',
    },
    fieldValue: {
        fontSize: 10,
        width: '80%',
    },
    paragraph: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 8,
    },
    singleSpacedLine: {
        fontSize: 10,
        lineHeight: 1,
        paddingLeft: 10,
    },
    spacer: {
        height: 15,
    },
    infoBox: {
        border: '1px solid #DDDDDD',
        padding: 8,
        marginBottom: 10,
        backgroundColor: '#F9F9F9',
    },
    image: {
        //marginBottom: 5,
        maxWidth: '50%',
        height: 'auto',
    },
    imageCaption: {
        fontSize: 8,
        fontStyle: 'italic',
        textAlign: 'left',
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: 'auto',
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeaderCell: {
        backgroundColor: '#EEEEEE',
        fontSize: 10,
        fontWeight: 'bold',
        padding: 4,
        borderBottom: '1px solid #CCCCCC',
    },
    tableCell: {
        fontSize: 9,
        padding: 4,
        borderBottom: '1px solid #EEEEEE',
    },
    synonymRow: {
        marginBottom: 5,
    },
    pageNumberBottom: {
        position: 'absolute',
        fontSize: 10,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumberTop: {
        position: 'relative',
        fontSize: 10,
        float: 'right',
        left: 0,
        right: 0,
        textAlign: 'right',
        color: 'grey',
    },

});