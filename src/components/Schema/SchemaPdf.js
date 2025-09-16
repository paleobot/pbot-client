import React from 'react';
import { Document, Page, PDFViewer, StyleSheet, Text, View, Image } from '@react-pdf/renderer';
import { alphabetize, sort } from '../../util.js';
import CharacterInstances from '../CharacterInstance/CharacterInstances.js';
import {Table, TableRow, TableHeader as TableHead, TableCell} from '@ag-media/react-pdf-table';
import { Comments } from '../Comment/Comments.js';
import { Country, State } from 'country-state-city';
import Characters from '../Character/Characters.js';
import logo from '../../PBOT-logo-transparent.png';
import { styles } from '../../PDFStyles.js';

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
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                <Image src={logo} style={styles.logo} />
                <Text style={styles.pbotHeading}>PBot</Text>
                </View>
                <View style={styles.headerCenter}>
                <Text style={styles.heading}>Schema</Text>
                <Text style={styles.headerSubheading}>{s.title}</Text>
                </View>
                <View style={styles.headerRight}>
                <Text style={styles.paragraph}>
                    Workspace: {workspaceName}
                </Text>
                </View>
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
    
    
