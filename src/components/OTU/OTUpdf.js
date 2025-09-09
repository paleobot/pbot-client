
import React from 'react';
import { Document, Image as PDFImage, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { alphabetize } from '../../util.js';
import CharacterInstances from '../CharacterInstance/CharacterInstances.js';

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
        marginBottom: 10,
        maxWidth: '100%',
        height: 'auto',
    },
    imageCaption: {
        fontSize: 8,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 5,
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

export const OTUpdf = (props) => {
    // Destructure all props from the otu object
    const { 
        pbotID, name, authority, diagnosis, qualityIndex, majorTaxonGroup,
        pbdbParentTaxon, family, genus, pfnGenusLink, species, pfnSpeciesLink,
        additionalClades, holotypeSpecimen, typeSpecimens, identifiedSpecimens,
        mergedDescription, synonyms, elementOf, notes, partsPreserved,
        notableFeatures, enteredBy, directQParams, jsonDirectQParams,
        history, holotypeImages, typeImages, identifiedImages,
        minIntervals, maxIntervals, stratigraphicGroups, stratigraphicFormations,
        stratigraphicMembers, stratigraphicBeds, minLat, maxLat, minLon, maxLon,
        countries, states
    } = props.otu;

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
    const isPublic = elementOf && elementOf.some(group => group.name === "public");
    const workspaceName = isPublic ? "public" : (elementOf && elementOf.length > 0 ? elementOf[0].name : "private");

    // Format links for PDF
    const directLink = window.location.origin + `/query/otu/${pbotID}?includeSynonyms&includeComments&includeHolotypeDescription&includeMergedDescription`;
    const jsonLink = directLink + "&format=json";
    const pdfLink = directLink + "&format=pdf";

    return (
        <>
        <Page size="A4" style={styles.page} wrap>
            {/* Title section */}
            <View style={styles.titleContainer}>
            <Text style={styles.heading}>{name}</Text>
            <Text style={styles.titleSubheading}>Workspace: {workspaceName}</Text>
            </View>

            {/* Key Information Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Key Information</Text>
            {renderField("PBOT ID", pbotID)}
            {renderField("Authority", authority)}
            {renderField("Direct Link", directLink)}
            {renderField("JSON Link", jsonLink)}
            {renderField("PDF Link", pdfLink)}
            {renderField("Quality Index", qualityIndex)}
            {renderArrayField("Parts Preserved", partsPreserved, "type")}
            {renderArrayField("Notable Features", notableFeatures, "name")}
            {renderArrayField("Data Access Groups", elementOf, "name")}
            </View>

            {/* Taxonomy Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Taxonomy</Text>
            {renderField("Major Taxon Group", majorTaxonGroup)}
            {renderField("PBDB Parent Taxon", pbdbParentTaxon)}
            {renderField("Family", family)}
            {renderField("Genus", genus)}
            {renderField("Species", species)}
            {/*renderArrayField("Additional Clades", additionalClades)*/}
            </View>

            {/* Diagnosis Section */}
            {diagnosis && (
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Diagnosis</Text>
                <Text style={styles.paragraph}>{diagnosis}</Text>
            </View>
            )}

            <Text
                style={styles.pageNumberBottom}
                render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
                )}
                fixed
            />        

        </Page>

        <Page size="A4" style={styles.page} wrap>
            <Text
                style={styles.pageNumberTop}
                render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
                )}
                fixed
            />        

            {/* Holotype Descriptions Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Holotype Descriptions</Text>
                {holotypeSpecimen && 
                    holotypeSpecimen.Specimen.describedBy && 
                    holotypeSpecimen.Specimen.describedBy[0] &&
                    holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances && holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances.length > 0 && 
                    <>
                    {alphabetize([...holotypeSpecimen.Specimen.describedBy], "Description.schema.title").map((d, i) => {
                        const bgColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF';
                        return (
                            <View key={i} style={{marginBottom: 10, backgroundColor: bgColor, padding: 5}}>
                                <Text style={styles.subheading}>From schema "{d.Description.schema.title}"</Text>
                                {renderField("Written Description", d.Description.writtenDescription)}
                                {renderField("Notes", d.Description.notes)}
                                <Text style={styles.fieldLabel}>Character States:</Text>                                
                                <CharacterInstances format="pdf" style={styles.singleSpacedLine} characterInstances={d.Description.characterInstances} />
                                
                            </View>
                    )})}
                    </>

                }
                {(!holotypeSpecimen || 
                    !holotypeSpecimen.Specimen.describedBy || 
                    !holotypeSpecimen.Specimen.describedBy[0] ||
                    !holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances || 
                    !holotypeSpecimen.Specimen.describedBy[0].Description.characterInstances.length > 0) &&
                    <Text style={styles.paragraph}>No holotype descriptions available</Text>
                }
            </View>

            {/* Merged Exemplar Descriptions Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Merged Exemplar Descriptions</Text>
                {mergedDescription && mergedDescription.length > 0 && 
                    <>
                    {alphabetize([...mergedDescription], "schema").reduce((acc, ci) => acc.includes(ci.schema) ? acc : acc.concat(ci.schema),[]).map((s,i) => {
                        const bgColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF';
                        return (
                            <View key={i} style={{marginBottom: 10, backgroundColor: bgColor, padding: 5}}>
                                <Text style={styles.subheading}>From schema "{s}"</Text>
                                <Text style={styles.fieldLabel}>Character States:</Text>                                
                                    {alphabetize(mergedDescription.filter(ci => ci.schema === s), "characterDeepOrder").map ((ci, i) =>  (
                                        <Text style={styles.singleSpacedLine} key={i}>{ci.characterName}:{"quantity" === ci.stateName ? ci.stateValue : ci.stateName}{ci.stateOrder  ? ', order:' + ci.stateOrder : ''}</Text>
                                    ))}
                            </View>
                        )
                    })}
                    </>

                }
                {(!mergedDescription || !mergedDescription.length > 0) && 
                    <Text style={styles.paragraph}>No merged descriptions available</Text>
                }
            </View>

        </Page>
        </>
    );
};
