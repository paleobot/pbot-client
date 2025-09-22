import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';
import { alphabetize, sort } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';
import { styles } from '../../PDFStyles.js';

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

// Main ReferencePDF component
export const ReferencePDF = (props) => {
    if (!props.reference) return null;

    const reference = props.reference;

    // Get workspace name (public or other)
    const isPublic = reference.elementOf && reference.elementOf.some(group => group.name === "public");
    const workspaceName = isPublic ? "public" : (reference.elementOf && reference.elementOf.length > 0 ? reference.elementOf[0].name : "private");

    // Component to be used for direct PDF viewing
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
                <Text style={styles.heading}>Reference</Text>
                <Text style={styles.headerSubheading}>{reference.title}</Text>
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
                {renderField("PBot ID", reference.pbotID)}
                {renderField("Direct Link", reference.directURL.toString())}
                {renderField("JSON Link", reference.jsonURL.toString())}
                {renderField("PDF Link", reference.pdfURL.toString())}
                {renderField("PBDB ID", reference.pbdbid)}
                {renderField("DOI", reference.doi)}
            </View>

            {/* Publication Details Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Publication Details</Text>

                {renderField("Authors", sort([...reference.authoredBy], "#order").map(author => `${author.Person.given} ${author.Person.surname}`).join(', '))}
                {renderField("Year", reference.year)}
                {renderField("Publication type", reference.publicationType)}
                {reference.journal &&
                    renderField("Journal", reference.journal)
                }
                {reference.publicationVolume &&
                    renderField("Publication volume", reference.publicationVolume)
                }
                {reference.publicationNumber &&
                    renderField("Publication number", reference.publicationNumber)
                }
                {reference.bookTitle &&
                    renderField("Book title", reference.bookTitle)
                }
                {reference.bookType &&
                    renderField("Book type", reference.bookType)
                }
                {reference.publisher &&
                    renderField("Publisher", reference.publisher)
                }
                {reference.firstPage &&
                    renderField("First page", reference.firstPage)
                }
                {reference.lastPage &&
                    renderField("Last page", reference.lastPage)
                }
            </View>

            <Text
                style={styles.pageNumberBottom}
                render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
                )}
                fixed
            />        

        </Page>
        </>
  );
};