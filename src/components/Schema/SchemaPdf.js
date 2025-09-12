import React from 'react';
import { Document, Page, PDFViewer, StyleSheet, Text, View, Image } from '@react-pdf/renderer';
import { alphabetize, sort } from '../../util.js';
import CharacterInstances from '../CharacterInstance/CharacterInstances.js';
import {Table, TableRow, TableHeader as TableHead, TableCell} from '@ag-media/react-pdf-table';
import { Comments } from '../Comment/Comments.js';
import { Country, State } from 'country-state-city';
import Characters from '../Character/Characters.js';

// Create styles for PDF layout
const styles = StyleSheet.create({
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

export const SchemaPdf = (props) => {
    //console.log("SchemaWeb");
    const s = props.schema;
    if (!s) return ''; //TODO: is this the best place to handle this?
    //console.log(s);

    // Helper to render a field if it exists
    const renderField = (label, value) => {
        if (!value && value !== 0) return null;
        return (
        <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}:</Text>
            <Text style={styles.fieldValue}>{value}</Text>
        </View>
        );
    };

    // Helper to render array values
    const renderArrayField = (label, arr, keyProp = null) => {
        if (!arr || arr.length === 0) return null;
        let displayValue = '';
        
        if (keyProp) {
            displayValue = arr.map(item => item[keyProp]).join(', ');
        } else {
            displayValue = arr.join(', ');
        }
        
        return renderField(label, displayValue);
    };

    // Get workspace name (public or other)
    const isPublic = s.elementOf && s.elementOf.some(group => group.name === "public");
    const workspaceName = isPublic ? "public" : (s.elementOf && s.elementOf.length > 0 ? s.elementOf[0].name : "private");

    return (
        <>
        <Page size="A4" style={styles.page} wrap>

            {/* Title section */}
            <View style={styles.titleContainer}>
            <Text style={styles.heading}>{s.title}</Text>
            <Text style={styles.titleSubheading}>Workspace: {workspaceName}</Text>
            </View>

            {/* Key Information Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Key Information</Text>
                {renderField("PBOT ID", s.pbotID)}
                {renderField("Direct Link", s.directURL.toString())}
                {renderField("JSON Link", s.jsonURL.toString())}
                {renderField("PDF Link", s.pdfURL.toString())}
                {renderField("Year", s.year)}
                {renderField("Purpose", s.purpose)}
                {renderField("Acknowledgments", s.acknowledgments)}
                {renderArrayField("Parts Preserved", s.partsPreserved, 'type')}
                {renderArrayField("Notable Features", s.notableFeatures, 'name')}
                {renderField("References", sort([...s.references], "#order").map(reference => `${reference.Reference.title}, ${reference.Reference.year}`).join('; '))}
                {renderField("Authors", sort([...s.authoredBy], "#order").map(author => `${author.Person.given} ${author.Person.surname}`).join(', '))}
            </View>

            {/* Characters Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Characters</Text>
                <Characters characters={s.characters} top="true" format="pdf" style={styles.singleSpacedLine}/>
            </View>

        </Page>
        </>
    );
}
    
    
