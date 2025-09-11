import React from 'react';
import { Document, Page, PDFViewer, StyleSheet, Text, View, Image } from '@react-pdf/renderer';
import { alphabetize, sort } from '../../util.js';
import CharacterInstances from '../CharacterInstance/CharacterInstances.js';
import {Table, TableRow, TableHeader as TableHead, TableCell} from '@ag-media/react-pdf-table';
import { Comments } from '../Comment/Comments.js';
import { Country, State } from 'country-state-city';

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

export const SpecimenPdf = (props) => {
    //console.log("SpecimenWeb");
    const s = props.specimen;
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

    const RenderImage = ({ image }) => (
        <View key={image.pbotID} style={styles.imageContainer}>
            <Image source={{ uri: image.link }} style={styles.image} />
            <Text style={styles.imageCaption}>{image.caption}</Text>
        </View>
    );

    // Get workspace name (public or other)
    const isPublic = s.elementOf && s.elementOf.some(group => group.name === "public");
    const workspaceName = isPublic ? "public" : (s.elementOf && s.elementOf.length > 0 ? s.elementOf[0].name : "private");


    const style = {textAlign: "left", width: "100%", margin: "auto", marginTop:"1em"}
    const indent = {marginLeft:"2em"}
    const indent2 = {marginLeft:"4em"}
    const indent3 = {marginLeft:"6em"}
    const carousel = {width: "60%", marginLeft: "2em", borderStyle:"solid"}
    const header1 = {marginLeft:"2em", marginTop:"10px"}
    const borderBoxedDisplay = {wordWrap: "break-word", border: 1, margin:"4px", paddingLeft:"2px"};
    const boxedDisplay = {wordWrap: "break-word", border: 0, margin:"4px",  paddingLeft:"2px"};
    const accstyle = {textAlign: "left", marginLeft:"10px", marginRight:"10px" /*width: "95%",  marginLeft:"8px"*/}

    return (
        <>
        <Page size="A4" style={styles.page} wrap>
            {/* Title section */}
            <View style={styles.titleContainer}>
            <Text style={styles.heading}>{s.name}</Text>
            <Text style={styles.titleSubheading}>Workspace: {workspaceName}</Text>
            </View>

            {/* Key Information Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Key Information</Text>
                {renderField("PBOT ID", s.pbotID)}
                {renderField("Direct Link", s.directURL.toString())}
                {renderField("JSON Link", s.jsonURL.toString())}
                {renderField("PDF Link", s.pdfURL.toString())}
                {renderField("Repository", s.repository)}
                {renderField("Other Repository Link", s.otherRepositoryLink)}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>iDigBio InstitutionCode, CatalogNumber, uuid:</Text>
                    <Text style={styles.fieldValue}>{`${s.idigbioInstitutionCode}, ${s.idigbioCatalogNumber}, ${s.idigbiouuid}`}</Text>
                </View>
                {renderArrayField("Parts Preserved", s.partsPreserved, 'type')}
                {renderArrayField("Notable Features Preserved", s.notableFeatures, 'name')}
                {renderArrayField("Preservation Modes", s.preservationModes, 'name')}
                {renderArrayField("Data Access Groups", s.elementOf, 'name')}
            </View>

            {/* Location and Geologic Info Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Location and Geologic Info</Text>
                {s.collection && renderField("Collection", s.collection.name)}
                {s.collection && s.collection.country && renderField("Country", `${Country.getCountryByCode(s.collection.country).name} (${s.collection.country})`)}
                {s.collection && s.collection.country && s.collection.state && renderField("State/Province", `${State.getStateByCodeAndCountry(s.collection.state, s.collection.country).name} (${s.collection.state})`)}
                {s.collection && renderField("Geologic Group", s.collection.stratigraphicGroup)}
                {s.collection && renderField("Geologic Formation", s.collection.stratigraphicFormation)}
                {s.collection && renderField("Geologic Member", s.collection.stratigraphicMember)}
                {s.collection && renderField("Geologic Bed", s.collection.stratigraphicBed)}
                {s.collection && renderField("Maximum Time Interval", s.collection.maxinterval)}
                {s.collection && renderField("Minimum Time Interval", s.collection.mininterval)}
            </View>
        </Page>

        <Page size="A4" style={styles.page} wrap>
            <Text
                style={styles.pageNumberTop}
                render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
                )}
                fixed
            />        

            {/* Taxonomic Data Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Taxonomic Data</Text>
                    {s.identifiedAs && s.identifiedAs.length > 0 && 
                        <>
                        {s.identifiedAs.map((otu, i) => {
                            const bgColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF';
                            return (
                                <View key={i} style={{marginBottom: 10, backgroundColor: bgColor, padding: 5}}>
                                    {renderField("Taxon/OTU", otu.OTU.name)}
                                    {renderField("Exemplar Specimen Type", 
                                        s.holotypeOf && s.holotypeOf.some(h => h.OTU.pbotID === otu.OTU.pbotID) ? 'holotype' :
                                        s.typeOf && s.typeOf.some(t => t.OTU.pbotID === otu.OTU.pbotID) ? 'other' : ''
                                    )}
                                    {renderField("Major Taxon Group", otu.OTU.majorTaxonGroup)}
                                    {renderField("Parent Taxon", otu.OTU.pbdbParentTaxon ? otu.OTU.pbdbParentTaxon : '')}
                                    {renderField("Identified By", s.identifiers.map(id => `${id.given} ${id.middle} ${id.surname}`).join(', '))}
                                </View>
                            )
                        })}
                        </>
                    } 
            </View>

            {/* Descriptions Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Descriptions</Text>
                {s.describedBy && s.describedBy.length > 0 && s.describedBy[0].Description ? (
                    s.describedBy.map((d, i) => {
                        const bgColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF';
                        return (
                            <View key={i} style={{marginBottom: 10, backgroundColor: bgColor, padding: 5}}>
                                <Text style={styles.subheading}>From schema "{d.Description.schema.title}"</Text>
                                {renderField("Written Description", d.Description.writtenDescription)}
                                {renderField("Notes", d.Description.notes)}
                                <Text style={styles.fieldLabel}>Character States:</Text>                                
                                <CharacterInstances format="pdf" style={styles.singleSpacedLine} characterInstances={d.Description.characterInstances} />                                
                            </View>
                        )

                    })
                ) : (
                    <Text style={styles.singleSpacedLine}>No descriptions available</Text>
                )}
            </View>

            {/* History Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>History</Text>
                {s.history && s.history.length > 0 &&
                    <>
                    <Table               
                        tdStyle={{padding: 5, borderBottomWidth: 1, fontSize: 10}}
                    >
                        {s.history.map((eb, i) => {
                            const bgColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF';
                            return (
                                <TableRow key={eb.timestamp} style={{backgroundColor: bgColor}}>
                                    <TableCell>{eb.timestamp}</TableCell>
                                    <TableCell>{eb.type}</TableCell>
                                    <TableCell>{eb.person}</TableCell>
                                </TableRow>
                            )
                        })}
                    </Table>
                    </>
                }
                {(!s.history || s.history.length === 0) &&
                    <Text style={styles.paragraph}>No history available</Text>
                }
            </View>

            {/* Notes Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Notes</Text>
                {s.notes && 
                    <Text>{s.notes}</Text>
                } 
                {!s.notes &&
                    <Text style={styles.singleSpacedLine}>No notes available</Text>
                }
            </View>

            {/* Images Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Images</Text>
                {s.images && s.images.length > 0 ? (
                    s.images.map((image) => (
                        <RenderImage key={image.pbotID} image={image} />
                    ))
                ) : (
                    <Text style={styles.singleSpacedLine}>No images available</Text>
                )}
            </View>
        </Page>
        </>
    )
}
