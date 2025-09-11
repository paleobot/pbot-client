
import React from 'react';
import { Document, Page, PDFViewer, StyleSheet, Text, View, Image } from '@react-pdf/renderer';
import { alphabetize, sort } from '../../util.js';
import CharacterInstances from '../CharacterInstance/CharacterInstances.js';
import {Table, TableRow, TableHeader as TableHead, TableCell} from '@ag-media/react-pdf-table';
import { Comments } from '../Comment/Comments.js';

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


// SpecimenTable: reusable table for holotype, other type specimens, and additional specimens
function SpecimenTable({ title, specimens }) {
    const specimenDirectQParams = ["includeImages", "includeDescriptions", "includeOTUs"];
    const indent = { marginLeft: "2em" };
    return (
        <>
        <Text style={[styles.fieldLabel, {marginTop: 10}]}>{title}</Text>
        <Table               
            tdStyle={{padding: 5, borderBottomWidth: 1, fontSize: 10}}
        >
            <TableHead>
                <TableCell style={{backgroundColor: '#e0e0e0'}}>Specimen name</TableCell>
                <TableCell style={{backgroundColor: '#e0e0e0'}}>Collection name</TableCell>
                <TableCell style={{backgroundColor: '#e0e0e0'}}>Country</TableCell>
                <TableCell style={{backgroundColor: '#e0e0e0'}}>Min interval</TableCell>
                <TableCell style={{backgroundColor: '#e0e0e0'}}>Max interval</TableCell>
            </TableHead>
                {specimens
                    .filter(s => s.Specimen && s.Specimen.collection)
                    .sort((a, b) => {
                        const nameA = a.Specimen.collection.name || '';
                        const nameB = b.Specimen.collection.name || '';
                        return nameA.localeCompare(nameB);
                    })
                    .map((s, i) => (
                        <TableRow key={s.Specimen.pbotID} style={{backgroundColor: i % 2 === 0 ? '#F0F0F0' : '#FFFFFF'}}>
                            <TableCell>{s.Specimen.name}</TableCell>
                            <TableCell>{s.Specimen.collection.name}</TableCell>
                            <TableCell>{s.Specimen.collection.country}</TableCell>
                            <TableCell>{s.Specimen.collection.mininterval}</TableCell>
                            <TableCell>{s.Specimen.collection.maxinterval}</TableCell>
                        </TableRow>
                    ))}
        </Table>
        </>
    );
}


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
        countries, states, exclusiveTypeSpecimens, exclusiveIdentifiedSpecimens
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

    const RenderImage = ({ image }) => (
        <View key={image.pbotID} style={styles.imageContainer}>
            <Image source={{ uri: image.link }} style={styles.image} />
            <Text style={styles.imageCaption}>{image.caption}</Text>
        </View>
    );

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
                        )
                    })}
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
                                    {sort(mergedDescription.reduce((acc, ci) => {
                                        if (ci.schema === s) {
                                            acc.push({
                                                ...ci,
                                                deepOrder: `${ci.characterDeepOrder}.${ci.stateDeepOrder}`
                                            });
                                        }
                                        return acc;
                                    }, []), "deepOrder").map ((ci, i) =>  (
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

            {/* Exemplar Specimens Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Exemplar Specimens</Text>
                {holotypeSpecimen && (
                <>
                    <SpecimenTable title="Holotype specimen" specimens={[holotypeSpecimen]}/>
                </>
                )}
                {exclusiveTypeSpecimens && exclusiveTypeSpecimens.length > 0 &&
                <>
                    <SpecimenTable title="Other type specimens" specimens={exclusiveTypeSpecimens}/>
                </>
                }

                {(!holotypeSpecimen && (!typeSpecimens || typeSpecimens.length === 0)) &&
                    <Text style={styles.paragraph}>No type specimens available</Text>
                }

            </View>

            {/* Additional Specimens Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Additional Specimens</Text>
                    {exclusiveIdentifiedSpecimens && exclusiveIdentifiedSpecimens.length > 0 &&
                    <>
                        <SpecimenTable title="Additional specimens" specimens={exclusiveIdentifiedSpecimens}/>
                    </>
                    }
                    {(!exclusiveIdentifiedSpecimens || exclusiveIdentifiedSpecimens.length === 0) &&
                        <Text style={styles.paragraph}>No additional specimens available</Text>
                    }
            </View>

            {/* History Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>History</Text>
                {history && history.length > 0 &&
                    <>
                    <Table               
                        tdStyle={{padding: 5, borderBottomWidth: 1, fontSize: 10}}
                    >
                        {history.map((eb, i) => {
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
                {(!history || history.length === 0) &&
                    <Text style={styles.paragraph}>No history available</Text>
                }
            </View>

            {/* Notes Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Notes</Text>
                {notes && 
                    <Text style={styles.paragraph}>{notes}</Text>
                }
                {(!notes || notes.length === 0) &&
                    <Text style={styles.paragraph}>No notes available</Text>
                }
            </View>

            {/* Synonyms Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.subheading}>Synonyms</Text>
                {synonyms && synonyms.length > 0 &&
                    <>
                    <Table               
                        tdStyle={{padding: 5, borderBottomWidth: 1, fontSize: 10}}
                    >
                        {synonyms.map((synonym, i) => {
                            const synOTU = synonym.otus.filter(synOtu => synOtu.pbotID !== pbotID)[0];
                            const bgColor = i % 2 === 0 ? '#F0F0F0' : '#FFFFFF';
                            return (
                                <View key={i} style={{backgroundColor: bgColor}}>
                                        <View>
                                            <Text style={styles.paragraph}>{synOTU.name}</Text>
                                        </View>
                                        {synonym.explanation &&
                                        <>
                                        {renderField("Explanation", synonym.explanation)}
                                        </>
                                        }
                                        {synonym.references && synonym.references.length > 0 &&
                                            <>
                                            <View style={{marginBottom: 5}}>
                                                <Text style={styles.fieldLabel}>References:</Text>
                                                {sort([...synonym.references], "order").map((ref, idx) => (
                                                    <Text key={idx} style={[styles.singleSpacedLine, {marginLeft: 10}]}>{ref.Reference.title}</Text>
                                                ))}
                                            </View>
                                            </>
                                        }
                                        {synOTU.family &&
                                        <>
                                        {renderField("Family", synOTU.family)}
                                        </>
                                        }
                                        {synOTU.genus &&
                                        <>
                                        {renderField("Genus", synOTU.genus)}
                                        </>
                                        }
                                        {synOTU.species &&
                                        <>
                                        {renderField("Specific epithet", synOTU.species)}
                                        </>
                                        }
                                        {synOTU.identifiedSpecimens &&
                                        <>
                                        {renderField("Number of identified specimens", synOTU.identifiedSpecimens.length)}
                                        </>
                                        }
                                        {synonym.comments && synonym.comments.length > 0 &&
                                            <>
                                            <View>
                                                <Text style={styles.fieldLabel}>Comments:</Text><br />
                                                <Comments comments={synonym.comments} level={1} format="pdf"/>
                                            </View>
                                            </>
                                        }

                                </View>
                            )
                        })}
                    </Table>
                    </>
                }
                {(!synonyms || synonyms.length === 0) &&
                    <Text style={styles.paragraph}>No proposed synonyms</Text>
                }
            </View>

            {holotypeImages && holotypeImages.length > 0 &&
                <View style={styles.sectionContainer}>
                    <Text style={styles.subheading}>Holotype Images</Text>
                    {holotypeImages.map((image, i) => (
                        <RenderImage key={i} image={image} />
                    ))}
                </View>
            }

            {typeImages && typeImages.length > 0 &&
                <View style={styles.sectionContainer}>
                    <Text style={styles.subheading}>Other type Images</Text>
                    {typeImages.map((image, i) => (
                        <RenderImage key={i} image={image} />
                    ))}
                </View>
            }

            {identifiedImages && identifiedImages.length > 0 &&
                <View style={styles.sectionContainer}>
                    <Text style={styles.subheading}>Identified Specimen Images</Text>
                    {identifiedImages.map((image, i) => (
                        <RenderImage key={i} image={image} />
                    ))}
                </View>
            }

        </Page>

        </>
    );
};
